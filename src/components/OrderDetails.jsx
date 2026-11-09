import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Badge, Button, Card, Spinner, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import { ORDER_STATUS, PAYMENT_METHOD } from "../config/constants";
import { formatPrice, formatDateTime } from "../utils/format";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderRes = await axios.get(`${API_URL}/orders/${id}`);
        const data = orderRes.data;
        setOrder(data);

        // Nhà hàng và địa chỉ lỗi thì vẫn hiện đơn, chỉ thiếu 2 dòng này
        const [restaurantRes, addressRes] = await Promise.all([
          axios.get(`${API_URL}/restaurants/${data.restaurantId}`).catch(() => null),
          axios.get(`${API_URL}/addresses/${data.addressId}`).catch(() => null),
        ]);
        setRestaurant(restaurantRes?.data ?? null);
        setAddress(addressRes?.data ?? null);
      } catch {
        setError("Không tìm thấy đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) return <Spinner animation="border" className="m-4" />;

  const status = ORDER_STATUS[order?.status];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Chi tiết đơn hàng {id}</h3>
        <Button as={Link} to="/OrderList" variant="outline-secondary">
          Quay lại danh sách
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {order && (
        <>
          <Card className="mb-3">
            <Card.Body>
              <p className="mb-1">
                Trạng thái:{" "}
                <Badge bg={status?.color ?? "secondary"}>
                  {status?.label ?? order.status}
                </Badge>
              </p>
              <p className="mb-1">Nhà hàng: {restaurant?.name ?? "Không rõ"}</p>
              {/* Đổi fullAddress theo tên field thật trong bảng addresses */}
              <p className="mb-1">Giao đến: {address?.fullAddress ?? order.addressId}</p>
              <p className="mb-1">
                Thanh toán:{" "}
                {PAYMENT_METHOD[order.paymentMethod] ?? order.paymentMethod}
              </p>
              <p className="mb-1">Ngày đặt: {formatDateTime(order.createdAt)}</p>
              <p className="mb-0">Cập nhật: {formatDateTime(order.updatedAt)}</p>
              {order.note && <p className="mt-2 mb-0">Ghi chú: {order.note}</p>}
            </Card.Body>
          </Card>

          <Table bordered>
            <thead>
              <tr>
                <th>Món</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.foodId}>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-end">
            <p className="mb-1">Tạm tính: {formatPrice(order.subtotal)}</p>
            <p className="mb-1">Phí giao hàng: {formatPrice(order.deliveryFee)}</p>
            <p className="mb-1">Giảm giá: - {formatPrice(order.discount)}</p>
            <h5>Tổng cộng: {formatPrice(order.totalAmount)}</h5>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderDetails;