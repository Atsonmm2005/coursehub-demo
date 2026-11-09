# CourseHub - Buoi 5: React Frontend + FastAPI

## Thay doi trong buoi nay

- `backend/app/main.py`: chi bo sung `CORSMiddleware` ngay sau `app = FastAPI(...)`,
  cho phep origin `http://localhost:5173` va `http://127.0.0.1:5173`, method `GET/POST/DELETE`.
  Giu nguyen version `0.4.0`, `SELECT ... FOR UPDATE` va ghi `enrollment_events` cua Buoi 4.
- `frontend/`: React 18.2.0 + Vite 7.1.7.
  - `src/api.js`: ham `api()` dung chung, xu ly 204 (khong doc JSON), loi `detail` dang chuoi/danh sach (422), mat ket noi.
  - `src/components/Notice.jsx`, `SectionTable.jsx`, `EnrollmentList.jsx`.
  - `src/App.jsx`: state, `useEffect` + `AbortController` tai `GET /courses`, `GET /sections`,
    `GET /students/{id}/enrollments`; dang ky/huy chi chay tu su kien bam nut, sau do luon tai lai tu API.
  - `tests/api.test.mjs`: 8 tinh huong HTTP gia lap cho `api.js`.
- `frontend/.env.example`: `VITE_API_BASE_URL=http://127.0.0.1:8000` (`.env.local` khong commit).
- `database/13_week05_verify.sql`: 3 truy van chi doc de doi chieu sau POST/DELETE.
- `.gitignore`: them `.env.local`, `node_modules/`, `dist/` (giu `.env`, `__pycache__/`, `*.pyc`).

## Cach chay

```powershell
# Terminal 1 - thu muc goc
.venv\Scripts\Activate.ps1
python -m uvicorn backend.app.main:app --reload

# Terminal 2 - thu muc frontend
cd frontend
npm install        # hoac npm ci khi da co package-lock.json
npm run dev        # http://127.0.0.1:5173/
```

## Ban phac giao dien (Figma)

- Link: _(dien link Figma "CourseHub – Buổi 5" tai day)_
- Bo cuc: tieu de → chon sinh vien (o ma + "Xem đăng ký") → hai cot: danh sach lop (bang + bo loc) | lop da dang ky (nut "Hủy đăng ký").

## Ket qua kiem thu (09/11/2026)

### Kiem thu tu dong

| Lenh | Ket qua |
|---|---|
| `npm test` | 8/8 pass |
| `npm run build` | Thanh cong, 31 module, `dist/` ~150 kB JS |

### Luong Frontend → API → CSDL (sinh vien 22000004, lop WEB-01)

| Buoc | Request (DevTools Network) | Status | SQL `13_week05_verify.sql` |
|---|---|---|---|
| Truoc khi thu | — | — | WEB-01: capacity 3, enrolled 2, remaining 1 |
| Bam "Đăng ký" WEB-01 | `OPTIONS` (preflight) → `POST /enrollments` body `{"student_id":"22000004","class_section_id":"WEB-01"}` | 200 → **201** | Co cap 22000004/WEB-01; enrolled 3, remaining 0; su kien `CREATED` (id 100004) |
| Bam "Hủy đăng ký" WEB-01 | `OPTIONS` → `DELETE /enrollments/22000004/WEB-01` | 200 → **204** (body rong) | Khong con cap dang ky; enrolled 2, remaining 1; them `CANCELLED` (id 100005), `CREATED` cu van con |

Sau moi thao tac giao dien tu tai lai tu API (khong tu cong/tru so cho), hang WEB-01 doi
"Đăng ký" ↔ "Đã đăng ký" va danh sach ben phai cap nhat dung.

### Truong hop loi

| Truong hop | Ket qua quan sat |
|---|---|
| Ma `99999999` | `HTTP 404: Khong tim thay sinh vien`, an bang va nut ghi |
| Ma `123` (ngan hon 8 so) | Form bao "Mã demo phải gồm 8 chữ số." truoc khi goi API |
| POST vao RACE-01 da het cho (capacity 1, enrolled 1) | **409** `Lop hoc phan da het cho`; nut tren giao dien hien "Hết chỗ" va bi khoa |
| Man hinh 390 px | Bo cuc mot cot, bang cuon ngang rieng, trang khong tran ngang |

### Gioi han

- Bai thu hai cua so cung tranh suat cuoi RACE-01 (muc X.3) chua lam lai trong buoi nay;
  tinh dung cua 409 khi tranh chap van dua tren test hai worker cua Buoi 4.
- Bo loc tim kiem chay tren trinh duyet (du lieu demo nho), khong phai phan trang CSDL.
- O ma sinh vien chi de chon du lieu demo, khong phai dang nhap.
