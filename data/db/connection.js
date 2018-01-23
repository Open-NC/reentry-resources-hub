const pgConnection = require('./pg_connection');

const os = require('os');
const ssConnection = (os.platform() === 'win32') ? require('./ss_connection') : null;

class Connection {
  constructor(name, connectionInfo, logger) {
    this.name = name;
    this.info = connectionInfo;
    this.logger = logger;
    this.connection = null;
    this.connected = false;
    this.timeout = 500;
    this.jobs = [];
    this.inJob = false;
    this.doShutdown = false;
    if (connectionInfo.type === 'pg') {
      this.connection = pgConnection(connectionInfo);
      this.connected = true;
      this.runJobs();
      this.startQueue();
    } else if (connectionInfo.type === 'sqlserver') {
      this.connection = ssConnection(connectionInfo);
      this.connection.connect().then(() => {
        this.connected = true;
        this.runJobs();
        this.startQueue();
      });
    }
  }

  startQueue() {
    setTimeout(this.runJobs, this.timeout);
  }

  addJob(jobConfig, jobProc) {
    this.jobs.push({ config: jobConfig, proc: jobProc });
  }

  runJobs() {
    if (this.doShutdown) {
      if (this.jobs.length === 0 && !this.inJob) this.shutDown();
    }
    if (this.connected && this.jobs && this.jobs.length > 0 && !this.inJob) {
      const job = this.jobs.shift();
      job.proc(job).then(() => {
        this.inJob = false;
      });
    }
    if (this.jobs) {
      setTimeout(this.runJobs, this.timeout);
    }
  }

  getDatabase() {
    return this.info.database;
  }

  getConnectionName() {
    return this.name;
  }

  shutDown() {
    this.jobs = null;
    if (this.info.type === 'sqlserver' && this.connection) {
      this.connection.close();
    } else if (this.info.type === 'pg' && this.connection) {
      this.connection.end();
    }
  }

  async query(sql) { // Returns a recordset
    if (this.info.type === 'sqlserver') {
      return this.connection.connect().then(() => {
        return new sql.Request(this.connection).query(sql);
      });
    } else if (this.info.type === 'pg') {
      return this.connection.connect().then(client => {
        return client.query(sql).then(result => {
          client.release();
          return Promise.resolve(result);
        })
        .catch(err => {
          return Promise.reject(new Error(JSON.stringify(err.message)));
        });
      });
    }
    return Promise.reject(new Error(`Unknown connection type ${this.info.type}`));
  }

  static normalizeColumn(name, obj, dbType) {
    const type = {
      name: name.toLowerCase(),
      type: obj.type.toLowerCase(),
      scale: obj.scale,
      precision: obj.precision,
      length: obj.length,
      nullable: obj.is_nullable, // Do we have something on this in PG?
    };
    if (dbType === 'sqlserver') {
      switch (obj.type) {
        case 'integer':
          type.type = 'integer';
          type.length = 4;
          break;
        case 'bigint':
          type.type = 'integer';
          type.length = 8;
          break;
        case 'smallint':
          type.type = 'integer';
          type.length = 2;
          break;
        case 'datetime':
          type.type = 'timestamp-no-tz';
          break;
        default:
          // Catches text, numeric
          // just leave alone.
      }
    } else if (dbType === 'pg') {
      switch (obj.type) {
        case 'int4':
          type.type = 'integer';
          type.length = 4;
          break;
        case 'int8':
          type.type = 'integer';
          type.length = 8;
          break;
        case 'timestamp':
          type.type = 'timestamp-no-tz';
          break;
        default:
          // Catches text, geometry, numeric, varchar
          // just leave alone.
      }
    }
    return type;
  }

  tableInfo(db, schema, table) {
    if (this.info.type === 'pg') {
      const sql = `
        SELECT column_name, udt_name, data_type, character_maximum_length, table_schema,
               is_nullable, numeric_precision, numeric_scale, numeric_precision_radix,
               datetime_precision,interval_type, interval_precision
        FROM information_schema.columns
        WHERE table_name='${table}'
      `;
    //  new sql.Request().query('select * from mytable').then(function(recordset) {
    //     console.dir(recordset);
    // }).catch(function(err) {
    //     // ... query error checks
    // });
      return this.connection.connect().then(client => {
        return client.query(sql).then(result => {
          client.release();
          let tableMeta = null;
          if (result.rows.length > 0) {
            const rows = result.rows.filter(r => {
              return (r.table_schema === schema);
            });
            if (rows.length > 0) {
              tableMeta = {};
              rows.forEach(r => {
                // console.log(`Column - ${r.column_name}`);
                const column = {
                  name: r.column_name,
                  type: r.udt_name,
                  precision: r.numeric_precision,
                  scale: r.numeric_scale,
                  is_nullable: r.is_nullable,
                  length: r.character_maximum_length,
                };
                tableMeta[r.column_name] = Connection.normalizeColumn(r.column_name, column, 'pg');
              });
            }
          }
          return Promise.resolve(tableMeta);
        })
        .catch(err => {
          console.log(`Query exception with err = ${JSON.stringify(err)}`);
        });
      });
    } else if (this.info.type === 'sqlserver') {
      console.log('Type is sqlserver');
      if (this.connected) {
        console.log('ALREADY CONNECTED');
        return this.connection.connect().then(this.sqlTableInfoQuery(schema, table));
      }
      return this.connection.connect().then(() => {
        this.connected = true;
        console.log('CONNECTING THIS TIME');
        return this.sqlTableInfoQuery(schema, table);
      });
    }
    return Promise.resolve(null);
  }

  sqlTableInfoQuery(schema, table) {
    const sql = `
      SELECT c.name as 'name', t.name as 'type', c.scale as 'scale', c.precision as 'precision', c.max_length as 'length' c.is_nullable as 'nullable'
      FROM sys.columns c
      JOIN sys.objects o ON o.object_id = c.object_id
      JOIN sys.types t ON c.system_type_id = t.system_type_id
      JOIN sys.schemas s ON o.schema_id = s.schema_id
      WHERE o.name = ${table} AND s.name = ${schema}
    `;
    return new sql.Request(this.connection).query(sql).then(recordSet => {
      console.log('Back from the request');
      let tableMeta = null;
      if (recordSet && recordSet.length > 0) {
        tableMeta = {};
        recordSet.forEach(r => {
          tableMeta[r[0]] = Connection.normalizeColumn(r[0],
            { type: r[1], length: r[2], precision: r[3], scale: r[4], is_nullable: r[5] },
            'sqlserver');
        });
      }
      return Promise.resolve(tableMeta);
    });
  }
}
module.exports = Connection;
