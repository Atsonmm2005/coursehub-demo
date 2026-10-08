--SQL | 05_constraint_checks.sql - loi co y
INSERT INTO enrollments (student_id, class_section_id)
VALUES ('22000001', 'WEB-01');

--SQL | 05_constraint_checks.sql - loi co y
INSERT INTO enrollments (student_id, class_section_id)
VALUES ('22999999', 'WEB-01');

--SQL | 05_constraint_checks.sql - loi co y
UPDATE class_sections
SET capacity = 0
WHERE id = 'WEB-01';

--SQL | 05_constraint_checks.sql - loi co y
UPDATE courses
SET credits = NULL
WHERE code = 'INT2204';

--SQL | 05_constraint_checks.sql - loi co y
UPDATE students
SET email = 'anh@example.com'
WHERE id = '22000002';

--SQL | 05_constraint_checks.sql - loi co y
UPDATE students
SET name = ' '
WHERE id = '22000004';

--SQL | Query Tool - chay sau cac vi du loi
SELECT COUNT(*) AS total_enrollments
FROM enrollments;