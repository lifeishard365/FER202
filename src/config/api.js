export const API_URL = "http://localhost:9999";

// Trạng thái đơn hàng: sau này thêm trạng thái mới chỉ cần sửa ở đây
export const ORDER_STATUS = {
  pending: { label: "Chờ xử lý", color: "warning" },
  completed: { label: "Hoàn thành", color: "success" },
  cancelled: { label: "Đã hủy", color: "danger" },
};

// Định dạng tiền kiểu Việt Nam: 150000 -> 150.000 ₫
export const formatPrice = (value) =>
  `${Number(value).toLocaleString("vi-VN")} ₫`;