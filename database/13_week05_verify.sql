-- Buoi 5: chi doc du lieu. Chay tung truy van trong Query Tool.
SELECT class_id, capacity, enrolled, remaining
FROM v_section_summary
WHERE class_id IN ('WEB-01', 'RACE-01')
ORDER BY class_id;

SELECT student_id, class_section_id
FROM enrollments
WHERE student_id = '22000004'
ORDER BY class_section_id;

SELECT id, student_id, class_section_id, event_type, occurred_at
FROM enrollment_events
WHERE dataset = 'demo'
  AND student_id = '22000004'
  AND class_section_id = 'WEB-01'
ORDER BY id DESC
LIMIT 10;