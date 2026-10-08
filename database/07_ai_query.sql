--SQL | 07_ai_query.sql - vi du sai de doi chieu
SELECT cs.id, COUNT(*) AS enrolled
FROM class_sections AS cs
LEFT JOIN enrollments AS e ON e.class_section_id = cs.id
WHERE cs.id = 'WEB-02'
GROUP BY cs.id;

--SQL | 07_ai_query.sql - truy van da sua
SELECT cs.id, COUNT(e.student_id) AS enrolled
FROM class_sections AS cs
LEFT JOIN enrollments AS e ON e.class_section_id = cs.id
WHERE cs.id = 'WEB-02'
GROUP BY cs.id;