# Thời tiết 8 thành phố Việt Nam (React + TypeScript + Vite)

## Chạy dự án
```
npm install
npm run dev
```
Mở địa chỉ terminal in ra (thường là http://localhost:5173). Kiểm tra lỗi kiểu: `npm run build`.

## Đối chiếu yêu cầu
- YC1 Danh sách 8 thành phố, mục đang chọn nổi bật: src/components/CityList.tsx, src/cities.ts
- YC2 Thời tiết hiện tại (biểu tượng, mô tả, nhiệt độ, độ ẩm, gió, thời điểm cập nhật): src/components/WeatherPanel.tsx
- YC3 Dự báo 7 ngày (thứ, ngày, biểu tượng, cao/thấp): src/components/WeatherPanel.tsx, src/utils.ts
- YC4 Trạng thái chưa chọn / đang tải / lỗi + nút Thử lại: WeatherPanel.tsx, App.tsx
- YC5 Đổi °C/°F không gọi lại API: dữ liệu lưu °C, chỉ quy đổi khi hiển thị (src/utils.ts)
- YC6 Responsive: từ 768px 2 cột, nhỏ hơn xếp dọc (src/styles.css)
- Nâng cao: tìm không phân biệt dấu (utils.normalize), yêu thích lưu localStorage, màu nền theo thời tiết (themeOf), TypeScript.
