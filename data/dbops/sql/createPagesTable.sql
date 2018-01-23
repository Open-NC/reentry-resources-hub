create table if not exists pages (
  id varchar(36) primary key,
  jurisdiction varchar(36) not null,
  topic varchar(36),
  content text
);
truncate table pages;
select 'OK' as result;
