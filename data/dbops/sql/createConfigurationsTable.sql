create table if not exists configurations (
  id varchar(36) primary key,
  name varchar(256) not null,
  value text
);
truncate table configurations;
select 'OK' as result;

