import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import { ORDER_STATUS } from "../config/constants";
import { formatPrice } from "../utils/format";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Không tìm thấy đơn hàng."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner animation="border" className="m-4" />;

  const status = ORDER_STATUS[order?.status];
  const items = order?.items ?? [];

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
          <p>
            Trạng thái:{" "}
            <Badge bg={status?.color ?? "secondary"}>
              {status?.label ?? order.status}
            </Badge>
          </p>

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
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h5 className="text-end">Tổng: {formatPrice(order.totalAmount)}</h5>
        </>
      )}
    </div>
  );
}

export default OrderDetails;