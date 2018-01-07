create table if not exists categories (
  id varchar(36) primary key,
  name varchar(256) not null,
  description text
);
truncate table categories;
select 'OK' as result;
