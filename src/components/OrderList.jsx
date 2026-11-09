import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
import { ORDER_STATUS, PAYMENT_METHOD } from "../config/constants";
import { formatPrice, formatDateTime } from "../utils/format";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/orders`),
      axios.get(`${API_URL}/restaurants`),
    ])
      .then(([orderRes, restaurantRes]) => {
        // Đơn mới nhất lên đầu
        const sorted = [...orderRes.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
        setRestaurants(restaurantRes.data);
      })
      .catch(() => setError("Không thể tải danh sách đơn hàng."))
      .finally(() => setLoading(false));
  }, []);

  const restaurantName = (id) =>
    restaurants.find((r) => r.id === id)?.name ?? "Không rõ";

  const countItems = (items) =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return <Spinner animation="border" className="m-4" />;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Danh sách đơn hàng</h3>
        <Button as={Link} to="/foods" variant="outline-secondary">
          Quay lại menu
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && orders.length === 0 && (
        <Alert variant="light">Chưa có đơn hàng nào.</Alert>
      )}

      {orders.length > 0 && (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Nhà hàng</th>
              <th>Số món</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = ORDER_STATUS[order.status];
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{restaurantName(order.restaurantId)}</td>
                  <td>{countItems(order.items)}</td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>
                    {PAYMENT_METHOD[order.paymentMethod] ?? order.paymentMethod}
                  </td>
                  <td>
                    <Badge bg={status?.color ?? "secondary"}>
                      {status?.label ?? order.status}
                    </Badge>
                  </td>
                  <td>{formatDateTime(order.createdAt)}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/OrderList/${order.id}`}
                      size="sm"
                      variant="outline-primary"
                    >
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default OrderList;