create table deduction_types(
id int auto_increment primary key,
name varchar(100) not null unique,
description varchar(255),
calculation_type enum('FIXED','PERCENTAGE')
)