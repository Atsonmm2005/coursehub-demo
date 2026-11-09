from __future__ import annotations
from concurrent.futures import ThreadPoolExecutor
import threading
import requests

BASE_URL = "http://127.0.0.1:8000"
SECTION_ID = "RACE-01"
STUDENT_IDS = ["22000002", "22000004"]

def reset_demo() -> None:
    for student_id in STUDENT_IDS:
        response = requests.delete(
            f"{BASE_URL}/enrollments/{student_id}/{SECTION_ID}",
            timeout=10,
        )
        if response.status_code not in (204, 404):
            raise RuntimeError(
                f"Khong reset duoc {student_id}: "
                f"{response.status_code} {response.text}"
            )

def enroll(
    student_id: str,
    barrier: threading.Barrier,
) -> tuple[str, int, object]:
    barrier.wait(timeout=5)
    response = requests.post(
        f"{BASE_URL}/enrollments",
        json={
            "student_id": student_id,
            "class_section_id": SECTION_ID,
        },
        timeout=15,
    )
    body: object = response.json() if response.content else None
    return student_id, response.status_code, body

def main() -> None:
    health = requests.get(f"{BASE_URL}/health", timeout=5)
    health.raise_for_status()
    reset_demo()

    barrier = threading.Barrier(len(STUDENT_IDS))

    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [
            executor.submit(enroll, student_id, barrier)
            for student_id in STUDENT_IDS
        ]
        results = [future.result() for future in futures]

    for student_id, status_code, body in results:
        print(student_id, status_code, body)

    statuses = sorted(status_code for _, status_code, _ in results)
    assert statuses == [201, 409], f"Trang thai khong mong doi: {statuses}"

    sections = requests.get(f"{BASE_URL}/sections", timeout=5).json()
    race_section = next(
        item for item in sections
        if item["class_id"] == SECTION_ID
    )
    assert race_section["enrolled"] == 1
    assert race_section["remaining"] == 0
    print("PASS: chi mot request dang ky thanh cong cho lop co 1 cho.")
    print(race_section)

if __name__ == "__main__":
    main()