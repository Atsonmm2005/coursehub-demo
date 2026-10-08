--SQL | 06_view_demo.sql - buoc 1
BEGIN;
--SQL | 06_view_demo.sql - buoc 2
INSERT INTO enrollments (student_id, class_section_id)
VALUES ('22000004', 'WEB-01');
--SQL | 06_view_demo.sql - buoc 3
SELECT class_id, capacity, enrolled, remaining
FROM v_section_summary
WHERE class_id = 'WEB-01';
--SQL | 06_view_demo.sql - buoc 4
ROLLBACK;
--SQL | 06_view_demo.sql - buoc 5
SELECT class_id, capacity, enrolled, remaining
FROM v_section_summary
WHERE class_id = 'WEB-01';