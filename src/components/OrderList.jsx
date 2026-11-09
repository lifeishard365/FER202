import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API_URL, ORDER_STATUS, formatPrice } from "../config/api";

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
          Quay lại menu
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
            {orders.map((order) => {
              const status = ORDER_STATUS[order.status];
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>
                    <Badge bg={status?.color ?? "secondary"}>
                      {status?.label ?? order.status}
                    </Badge>
                  </td>
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