import { useEffect, useState } from "react";
import { api } from "./api.js";
import Notice from "./components/Notice.jsx";
import SectionTable from "./components/SectionTable.jsx";
import EnrollmentList from "./components/EnrollmentList.jsx";

export default function App() {
  const [draftId, setDraftId] = useState("22000004");
  const [studentId, setStudentId] = useState("22000004");
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState({ kind: "info", text: "" });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [courseData, sectionData, enrollmentData] = await Promise.all([
          api("/courses", options),
          api("/sections", options),
          api(
            `/students/${encodeURIComponent(studentId)}/enrollments`,
            options,
          ),
        ]);
        if (controller.signal.aborted) return;
        setCourses(courseData);
        setSections(sectionData);
        setEnrollments(enrollmentData);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.message);
        setCourses([]);
        setSections([]);
        setEnrollments([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadData();
    return () => controller.abort();
  }, [studentId, refresh]);

  function chooseStudent(event) {
    event.preventDefault();
    const nextId = draftId.trim();
    if (!/^\d{8}$/.test(nextId)) {
      setNotice({ kind: "error", text: "Mã demo phải gồm 8 chữ số." });
      return;
    }
    setNotice({ kind: "info", text: "" });
    setLoading(true);
    setStudentId(nextId);
    setRefresh((value) => value + 1);
  }

  async function changeEnrollment(sectionId, cancel = false) {
    if (busy || loading || error) return;
    if (cancel && !window.confirm(`Hủy đăng ký lớp ${sectionId}?`)) return;
    setBusy(true);
    setNotice({ kind: "info", text: "Đang gửi yêu cầu..." });
    try {
      if (cancel) {
        await api(
          `/enrollments/${encodeURIComponent(studentId)}/${encodeURIComponent(sectionId)}`,
          { method: "DELETE" },
        );
      } else {
        await api("/enrollments", {
          method: "POST",
          body: { student_id: studentId, class_section_id: sectionId },
        });
      }
      setNotice({
        kind: "success",
        text: cancel
          ? `Đã hủy đăng ký ${sectionId}.`
          : `Đăng ký ${sectionId} thành công.`,
      });
    } catch (err) {
      setNotice({ kind: "error", text: err.message });
    } finally {
      // Đọc lại CSDL kể cả sau lỗi; không tự cộng/trừ số chỗ ở giao diện.
      setLoading(true);
      setRefresh((value) => value + 1);
      setBusy(false);
    }
  }

  const keyword = search.trim().toLowerCase();
  const rows = sections
    .map((section) => ({
      ...section,
      course_name:
        courses.find((course) => course.code === section.course_code)?.name ??
        section.course_code,
      registered: enrollments.some(
        (item) => item.class_section_id === section.class_id,
      ),
    }))
    .filter(
      (row) =>
        `${row.class_id} ${row.course_code} ${row.course_name}`
          .toLowerCase()
          .includes(keyword) &&
        (!onlyAvailable || row.remaining > 0),
    );
  const disabled = loading || busy || Boolean(error);

  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">CSDL WEB VÀ HỆ THỐNG THÔNG TIN · BUỔI 5</p>
        <h1>CourseHub</h1>
        <p>Tra cứu và đăng ký lớp học phần</p>
        <span className="chip">React → FastAPI → PostgreSQL</span>
      </header>
      <p className="demo-note">
        Môi trường thực hành. Nhập mã sinh viên để thử dữ liệu, không phải đăng
        nhập.
      </p>
      <section className="panel">
        <h2>1. Chọn sinh viên</h2>
        <form className="student-form" onSubmit={chooseStudent}>
          <label htmlFor="student-id">Mã sinh viên</label>
          <input
            id="student-id"
            value={draftId}
            maxLength={8}
            required
            inputMode="numeric"
            onChange={(e) => setDraftId(e.target.value)}
            disabled={busy}
          />
          <button type="submit" disabled={busy}>
            Xem đăng ký
          </button>
          <button
            type="button"
            className="secondary"
            disabled={busy || loading}
            onClick={() => setRefresh((value) => value + 1)}
          >
            Tải lại dữ liệu
          </button>
        </form>
        <p className="muted">
          Dữ liệu đang xem: <strong>{studentId}</strong>. Mã mẫu:
          22000001–22000004.
        </p>
      </section>

      <Notice kind={notice.kind}>{notice.text}</Notice>
      <Notice kind="error">{error}</Notice>
      {loading && <Notice>Đang tải dữ liệu từ API...</Notice>}

      {!loading && !error && (
        <div className="workspace">
          <section className="panel">
            <h2>2. Danh sách lớp học phần</h2>
            <div className="filters">
              <label htmlFor="search">Tìm lớp / học phần</label>
              <input
                id="search"
                value={search}
                placeholder="Ví dụ: web"
                onChange={(e) => setSearch(e.target.value)}
              />
              <label className="check">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                Chỉ hiện lớp còn chỗ
              </label>
            </div>
            <SectionTable
              rows={rows}
              disabled={disabled}
              onEnroll={(id) => changeEnrollment(id)}
            />
          </section>
          <section className="panel">
            <h2>3. Lớp đã đăng ký</h2>
            <p className="muted">
              Sinh viên {studentId} · {enrollments.length} lớp
            </p>
            <EnrollmentList
              rows={enrollments}
              disabled={disabled}
              onCancel={(id) => changeEnrollment(id, true)}
            />
          </section>
        </div>
      )}
      <footer>
        Số chỗ và đăng ký được đọc từ API; Backend quyết định tính hợp lệ.
      </footer>
    </main>
  );
}
