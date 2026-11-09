import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:9999";

const statusVariant = {
  pending: "warning",
  completed: "success",
  cancelled: "danger",
};

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/orders`)
      .then((res) => setOrders(res.data))
      .catch(() => setError("Không thể tải danh sách đơn hàng."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" className="m-4" />;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Danh sách đơn hàng</h3>
        <Button as={Link} to="/foods" variant="outline-secondary">
          Quay lại
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {!error && orders.length === 0 && (
        <Alert variant="light">Chưa có đơn hàng nào.</Alert>
      )}
      {orders.length > 0 && (
        <Table bordered hover>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{Number(o.totalAmount).toLocaleString("vi-VN")} ₫</td>
                <td>
                  <Badge bg={statusVariant[o.status] ?? "secondary"}>
                    {o.status}
                  </Badge>
                </td>
                <td>
                  <Button as={Link} to={`/orders/${o.id}`} size="sm" variant="outline-primary">
                    Chi tiết
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default OrderList;