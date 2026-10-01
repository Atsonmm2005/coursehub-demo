students = [
    {"id": "22000001", "name": "Nguyen Minh Anh", "major": "KHDL"},
    {"id": "22000002", "name": "Tran Duc Long", "major": "KHDL"},
]
courses = [
    {
        "code": "INT2204",
        "name": "Co so du lieu Web va he thong thong tin",
        "capacity": 3,
        "enrolled": 2,
    },
    {
        "code": "INT2205",
        "name": "Khai pha du lieu",
        "capacity": 2,
        "enrolled": 2,
    },
]
enrollments = [
    {"student_id": "22000001", "course_code": "INT2204"}
]

# Hàm tìm sinh viên
def find_student(student_id):
    for s in students:
        if s["id"] == student_id:
            return s
    return None

# Hàm tìm học phần
def find_course(course_code):
    for c in courses:
        if c["code"] == course_code:
            return c
    return None
# Hàm đăng ký học phần
def enroll_student(student_id, course_code):
    student = find_student(student_id)
    if student is None:
        return False, "Ma sinh vien khong ton tai"

    course = find_course(course_code)
    if course is None:
        return False, "Hoc phan khong ton tai"

    if course["enrolled"] >= course["capacity"]:
        return False, "Lop da day (het cho)"

    is_duplicated = any(
        e["student_id"] == student_id and e["course_code"] == course_code
        for e in enrollments
    )

    if is_duplicated:
        return False, "Sinh vien da dang ky hoc phan nay truoc do"

    enrollments.append({"student_id": student_id, "course_code": course_code})
    course["enrolled"] += 1

    return True, f"Dang ky thanh cong hoc phan {course_code} cho sinh vien {student['name']}"

#Kiểm tra chương trình
print("Ket qua kiem tra")

test_cases = [
    {
        "case": "1. Dang ky thanh cong",
        "student_id": "22000002",
        "course_code": "INT2204",
        "expected": "Thành công (lớp còn 1 chỗ)"
    },
    {
        "case": "2. Dang ky trung (lap lai)",
        "student_id": "22000001",
        "course_code": "INT2204",
        "expected": "Báo lỗi sinh viên đã đăng ký"
    },
    {
        "case": "3. Lop day",
        "student_id": "22000002",
        "course_code": "INT2205",
        "expected": "Báo lỗi lớp đã đầy (2/2)"
    },
    {
        "case": "4. Ma hoc phan khong ton tai",
        "student_id": "22000002",
        "course_code": "INT9999",
        "expected": "Báo lỗi học phần không tồn tại"
    },
    {
        "case": "5. Ma sinh vien khong ton tai",
        "student_id": "99999999",
        "course_code": "INT2204",
        "expected": "Báo lỗi mã sinh viên không tồn tại"
    },
]

for tc in test_cases:
    success, msg = enroll_student(tc["student_id"], tc["course_code"])
    status = "SUCCESS" if success else "FAILED"
    print(f"[{tc['case']}] -> Ket qua: {status} | Thong bao: {msg}")

print("\nDu lieu enrollments sau khi dang ky:")
print(enrollments)

    