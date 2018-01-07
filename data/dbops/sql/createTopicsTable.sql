create table if not exists topics (
  id varchar(36) primary key,
  tag varchar(64) not null,
  display_name varchar(256)
);
truncate table topics;
select 'OK' as result;

