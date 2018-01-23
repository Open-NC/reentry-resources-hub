create table if not exists categories (
  id varchar(36) primary key,
  tag varchar(64) not null,
  display_name varchar(256),  
  description text
);
truncate table categories;
select 'OK' as result;
