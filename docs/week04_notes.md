# CourseHub & Project - Buoi 4

- Migration 001: Tạo bảng `order_events` lưu lịch sử đặt vé.
- Demo class: Lấy hạng vé `VIP-01`, thiết lập `capacity` = 1 để thử nghiệm.
- POST /orders: Khóa dòng trong bảng `ticket_types` bằng `SELECT ... FOR UPDATE` trước khi chèn đơn hàng.
- Concurrency test: Hai luồng mua vé chạy đồng thời. Request thắng nhận mã `201 Created`, request chậm hơn nhận `409 Conflict`. Số lượng vé bán ra bảo đảm không bị âm kho.
- Performance data: Tạo tập dữ liệu hiệu năng 100,000 dòng sự kiện mua vé với `dataset=performance`.
- Index: Tạo chỉ mục gộp `idx_order_events_dataset_user_time` trên tập `(dataset, user_id, created_at DESC)`.

**Kết quả đo hiệu năng truy vấn (EXPLAIN ANALYZE):**

_Trước khi tạo Index (chưa tối ưu):_

- Scan type: `Seq Scan` trên bảng `order_events`
- Rows Removed by Filter: 99,145
- Planning Time: 0.812 ms
- Execution Time: 13.405 ms

_Sau khi tạo Index (đã tối ưu):_

- Scan type: `Index Scan` sử dụng `idx_order_events_dataset_user_time`
- Buffers: shared hit=38
- Planning Time: 2.704 ms
- Execution Time: 0.422 ms

Kết luận: Tốc độ truy vấn cải thiện rõ rệt. Trình phân tích của hệ quản trị đã chuyển sang đọc thẳng từ cây chỉ mục, bỏ qua bước quét toàn bộ dữ liệu lưu trữ.
