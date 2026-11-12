import { useEffect, useState } from "react";
import { Alert, Badge, Button, Nav, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getOrder, getOrderByUser, getRestaurant } from "../config/api";
import { useAuth } from "../context/AuthContext";

const ORDER_STATUS = {
  PENDING: { label: "Chờ xác nhận", color: "#d97706" },
  CONFIRMED: { label: "Đã xác nhận", color: "#0891b2" },
  DELIVERING: { label: "Đang giao", color: "#0d6efd" },
  COMPLETED: { label: "Hoàn thành", color: "#198754" },
  CANCELLED: { label: "Đã hủy", color: "#dc3545" },
};

const PAYMENT_METHOD = {
  COD: "Tiền mặt khi nhận hàng",
  MOMO: "Ví MoMo",
  BANKING: "Chuyển khoản",
};

const formatPrice = (value = 0) => `${Number(value).toLocaleString("vi-VN")} ₫`;

const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("vi-VN") : "";

function OrderList() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = user.id;

  useEffect(() => {
    Promise.all([
      isAdmin ? getOrder() : getOrderByUser(userId),
      getRestaurant().catch(() => ({ data: [] })),
    ])
      .then(([orderRes, restaurantRes]) => {
        const sorted = [...orderRes.data].sort(
          (a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
        );
        setOrders(sorted);
        setRestaurants(restaurantRes.data);
      })
      .catch(() => setError("Không thể tải danh sách đơn hàng."))
      .finally(() => setLoading(false));
  }, [userId, isAdmin]);

  const restaurantName = (id) =>
    restaurants.find((r) => r.id === id)?.name ?? "Không rõ";

  const countItems = (items = []) =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  const countByStatus = (status) =>
    orders.filter((order) => order.status === status).length;

  const shownOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  if (loading) return <Spinner animation="border" className="m-4" />;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">
          {isAdmin ? "Tất cả đơn hàng" : "Lịch sử đơn hàng"}
        </h3>
        <Button as={Link} to="/Food" variant="outline-secondary">
          Quay lại menu
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && orders.length === 0 && (
        <Alert variant="light">
          Bạn chưa có đơn hàng nào. <Link to="/Food">Đặt món ngay</Link>
        </Alert>
      )}

      {orders.length > 0 && (
        <>
          <Nav variant="pills" className="flex-nowrap overflow-auto pb-2">
            <Nav.Item>
              <Nav.Link
                as="button"
                type="button"
                className="text-nowrap"
                active={statusFilter === ""}
                onClick={() => setStatusFilter("")}
              >
                Tất cả <Badge bg="light" text="dark">{orders.length}</Badge>
              </Nav.Link>
            </Nav.Item>
            {Object.entries(ORDER_STATUS).map(([key, status]) => (
              <Nav.Item key={key}>
                <Nav.Link
                  as="button"
                  type="button"
                  className="text-nowrap"
                  active={statusFilter === key}
                  onClick={() => setStatusFilter(key)}
                >
                  {status.label}{" "}
                  <Badge bg="light" text="dark">{countByStatus(key)}</Badge>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {shownOrders.length === 0 ? (
            <Alert variant="light" className="mt-3">
              Không có đơn nào ở trạng thái này.
            </Alert>
          ) : (
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "gray", color: "white" }}>Mã đơn</th>
                  {isAdmin && (
                    <th style={{ backgroundColor: "gray", color: "white" }}>Khách hàng</th>
                  )}
                  <th style={{ backgroundColor: "gray", color: "white" }}>Nhà hàng</th>
                  <th style={{ backgroundColor: "gray", color: "white" }}>Số món</th>
                  <th style={{ backgroundColor: "gray", color: "white" }}>Tổng tiền</th>
                  <th style={{ backgroundColor: "gray", color: "white" }}>Thanh toán</th>
                  <th style={{ backgroundColor: "gray", color: "white" }}>Trạng thái</th>
                  <th style={{ backgroundColor: "gray", color: "white" }}>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {shownOrders.map((order) => {
                  const status = ORDER_STATUS[order.status];
                  return (
                    <tr
                      key={order.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/OrderList/${order.id}`)}
                      onMouseEnter={(event) => event.currentTarget.classList.add("table-success")}
                      onMouseLeave={(event) => event.currentTarget.classList.remove("table-success")}
                    >
                      <td>{order.id}</td>
                      {isAdmin && <td>{order.userId}</td>}
                      <td>{restaurantName(order.restaurantId)}</td>
                      <td>{countItems(order.items)}</td>
                      <td>{formatPrice(order.totalAmount)}</td>
                      <td>{PAYMENT_METHOD[order.paymentMethod] ?? order.paymentMethod}</td>
                      <td>
                        <Badge style={{ backgroundColor: status?.color ?? "#6c757d" }}>
                          {status?.label ?? order.status}
                        </Badge>
                      </td>
                      <td>{formatDateTime(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}

export default OrderList;
