create table if not exists resources (
  id varchar(36) primary key,
  name text not null,
  description text,
  url text,
  categories text,
  parameterized boolean
);
truncate table resources;
select 'OK' as result;
