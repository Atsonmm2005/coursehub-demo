// Kiem thu ham api() voi fetch gia lap. Khong goi Backend hay PostgreSQL that.
import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/api.js";

const realFetch = globalThis.fetch;
let calls = [];

function mockFetch(status, body, { raw = false } = {}) {
  calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    const text = body === undefined ? "" : raw ? body : JSON.stringify(body);
    return new Response(status === 204 ? null : text, { status });
  };
}

afterEach(() => {
  globalThis.fetch = realFetch;
});

test("GET 200 tra ve JSON va dung URL mac dinh", async () => {
  mockFetch(200, [{ class_id: "WEB-01" }]);
  const data = await api("/sections");
  assert.deepEqual(data, [{ class_id: "WEB-01" }]);
  assert.equal(calls[0].url, "http://127.0.0.1:8000/sections");
  assert.equal(calls[0].options.method, "GET");
  assert.equal(calls[0].options.body, undefined);
});

test("POST gui body JSON va header Content-Type", async () => {
  mockFetch(201, { message: "ok" });
  const body = { student_id: "22000004", class_section_id: "WEB-01" };
  await api("/enrollments", { method: "POST", body });
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(calls[0].options.body), body);
});

test("DELETE 204 tra ve null, khong doc JSON", async () => {
  mockFetch(204);
  const data = await api("/enrollments/22000004/WEB-01", { method: "DELETE" });
  assert.equal(data, null);
});

test("404 nem loi kem status va detail", async () => {
  mockFetch(404, { detail: "Khong tim thay sinh vien" });
  await assert.rejects(api("/students/99999999/enrollments"), (err) => {
    assert.equal(err.status, 404);
    assert.equal(err.message, "HTTP 404: Khong tim thay sinh vien");
    return true;
  });
});

test("409 nem loi xung dot", async () => {
  mockFetch(409, { detail: "Lop da het cho" });
  await assert.rejects(
    api("/enrollments", { method: "POST", body: {} }),
    { status: 409, message: "HTTP 409: Lop da het cho" },
  );
});

test("422 voi detail dang danh sach duoc ghep thanh chuoi", async () => {
  mockFetch(422, { detail: [{ msg: "Field required" }, { msg: "Too short" }] });
  await assert.rejects(api("/enrollments", { method: "POST", body: {} }), {
    status: 422,
    message: "HTTP 422: Field required; Too short",
  });
});

test("Phan hoi khong phai JSON bao loi ro rang", async () => {
  mockFetch(500, "Internal Server Error", { raw: true });
  await assert.rejects(api("/sections"), {
    message: "HTTP 500: phản hồi không phải JSON.",
  });
});

test("Mat ket noi bao loi Backend/CORS; AbortError duoc giu nguyen", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  await assert.rejects(api("/sections"), /Không nhận được phản hồi API/);

  globalThis.fetch = async () => {
    throw new DOMException("aborted", "AbortError");
  };
  await assert.rejects(api("/sections"), { name: "AbortError" });
});
