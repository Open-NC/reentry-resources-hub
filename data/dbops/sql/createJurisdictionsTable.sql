create table if not exists jurisdictions (
  id varchar(36) primary key,
  tag varchar(64) not null,
  display_name varchar(256),
  parent_jurisdiction varchar(36),
  jurisdiction_type varchar(64) not null
);
truncate table jurisdictions;
select 'OK' as result;
