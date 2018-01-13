create table if not exists resources (
  id varchar(36) primary key,
  name text not null,
  description text,
  url text,
  jurisdiction varchar(36),
  localized boolean,
  category varchar(256)
);
truncate table resources;
select 'OK' as result;
