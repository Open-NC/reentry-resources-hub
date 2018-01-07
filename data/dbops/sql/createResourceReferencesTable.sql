create table if not exists resource_references (
  id varchar(36) primary key,
  resource varchar(36) not null,
  jurisdiction varchar(36) not null,
  topic varchar(36) not null,
  ordinal integer
);
truncate table resource_references;
select 'OK' as result;
