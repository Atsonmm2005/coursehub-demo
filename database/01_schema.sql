--SQL | 01_schema.sql - phan 1/6

CREATE TABLE students (
id VARCHAR(8) NOT NULL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
major VARCHAR(20) NOT NULL,
email VARCHAR(120) NOT NULL,
CONSTRAINT uq_students_email UNIQUE (email),
CONSTRAINT ck_students_id CHECK (length(id) = 8),
CONSTRAINT ck_students_name CHECK (trim(name) <> '')
);

--SQL | 01_schema.sql - phan 2/6
CREATE TABLE courses (
code VARCHAR(10) NOT NULL PRIMARY KEY,
name VARCHAR(120) NOT NULL,
credits INTEGER NOT NULL,
CONSTRAINT ck_courses_credits
CHECK (credits BETWEEN 1 AND 6)
);

--SQL | 01_schema.sql - phan 3/6
CREATE TABLE semesters (
code VARCHAR(10) NOT NULL PRIMARY KEY,
name VARCHAR(80) NOT NULL,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
CONSTRAINT ck_semesters_dates
CHECK (end_date >= start_date)
);

--SQL | 01_schema.sql - phan 4/6
CREATE TABLE lecturers (
id VARCHAR(10) NOT NULL PRIMARY KEY,
name VARCHAR(100) NOT NULL
);

--SQL | 01_schema.sql - phan 5/6
CREATE TABLE class_sections (
id VARCHAR(20) NOT NULL PRIMARY KEY,
course_code VARCHAR(10) NOT NULL
REFERENCES courses(code),
semester_code VARCHAR(10) NOT NULL
REFERENCES semesters(code),
lecturer_id VARCHAR(10) NOT NULL
REFERENCES lecturers(id),
capacity INTEGER NOT NULL,
CONSTRAINT ck_sections_capacity CHECK (capacity > 0)
);

--SQL | 01_schema.sql - phan 6/6
CREATE TABLE enrollments (
student_id VARCHAR(8) NOT NULL
REFERENCES students(id),
class_section_id VARCHAR(20) NOT NULL
REFERENCES class_sections(id),
registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pk_enrollments
PRIMARY KEY (student_id, class_section_id)
);