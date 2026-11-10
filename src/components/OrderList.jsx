import { useEffect, useState } from "react";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getOrder, getRestaurant } from "../config/api";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getOrder(),
      getRestaurant(),
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

  const countItems = (items = []) =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return <Spinner animation="border" className="m-4" />;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Danh sách đơn hàng</h3>
        <Button as={Link} to="/Food" variant="outline-secondary">
          Quay lại menu
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && orders.length === 0 && (
        <Alert variant="light">Chưa có đơn hàng nào.</Alert>
      )}

      {orders.length > 0 && (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th style={{backgroundColor: "gray", color: "white"}} >Mã đơn</th>
              <th style={{backgroundColor: "gray", color: "white"}} >Nhà hàng</th>
              <th style={{backgroundColor: "gray", color: "white"}} >Số món</th>
              <th style={{backgroundColor: "gray", color: "white"}} >Tổng tiền</th>
              <th style={{backgroundColor: "gray", color: "white"}} >Thanh toán</th>
              <th style={{backgroundColor: "gray", color: "white"}} >Trạng thái</th>
              <th style={{backgroundColor: "gray", color: "white"}} >Ngày đặt</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = order.status;

              return (
                <tr
                  key={order.id}
                  onClick={() => (window.location.href = `/OrderList/${order.id}`)}
                  onMouseEnter={(event) => event.currentTarget.classList.add("table-success")}
                  onMouseLeave={(event) => event.currentTarget.classList.remove("table-success")}
                >
                  <td>{order.id}</td>
                  <td>{restaurantName(order.restaurantId)}</td>
                  <td>{countItems(order.items)}</td>
                  <td>{order.totalAmount}</td>
                  <td>
                     {order.paymentMethod}
                  </td>
                  <td>
                      {status?.label ?? order.status}
                  </td>
                  <td>{order.createdAt}</td>
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