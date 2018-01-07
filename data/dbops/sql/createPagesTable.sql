create table if not exists pages (
  id varchar(36) primary key,
  jurisdiction varchar(36) not null,
  topic varchar(36),
  parent_jurisdiction varchar(36),
  jurisdiction_type varchar(64)
);
truncate table pages;
select 'OK' as result;
