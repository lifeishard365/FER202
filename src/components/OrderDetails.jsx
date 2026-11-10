import { useEffect, useState } from "react";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { getOrderById, getRestaurant } from "../config/api";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [restaurantName, setRestaurantName] = useState("Không rõ");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getOrderById(id), getRestaurant()])
      .then(([orderRes, restaurantRes]) => {
        setOrder(orderRes.data);
        const restaurant = restaurantRes.data.find(
          (item) => item.id === orderRes.data.restaurantId
        );
        if (restaurant) setRestaurantName(restaurant.name);
      })
      .catch(() => setError("Không thể tải thông tin đơn hàng."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner animation="border" className="m-4" />;

  const status = order.status;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Chi tiết đơn hàng</h3>
        <Button as={Link} to="/OrderList" variant="outline-secondary">
          Quay lại danh sách
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {!error && order && (
        <>
          <dl className="row">
            <dt className="col-sm-3">Mã đơn</dt>
            <dd className="col-sm-9">{order.id}</dd>
            <dt className="col-sm-3">Nhà hàng</dt>
            <dd className="col-sm-9">{restaurantName}</dd>
            <dt className="col-sm-3">Trạng thái</dt>
            <dd className="col-sm-9">
              <Badge bg={status?.color ?? "secondary"}>
                {status?.label ?? order.status}
              </Badge>
            </dd>
            <dt className="col-sm-3">Thanh toán</dt>
            <dd className="col-sm-9">
              {order.paymentMethod}
            </dd>
            <dt className="col-sm-3">Ngày đặt</dt>
            <dd className="col-sm-9">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("vi-VN")
                : "Không rõ"}
            </dd>
          </dl>

          <Table bordered responsive>
            <thead>
              <tr>
                <th>Món ăn</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {(order.items ?? []).map((item) => (
                <tr key={item.foodId}>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString("vi-VN")} ₫</td>
                  <td>{item.quantity}</td>
                  <td>
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3}>Tổng tiền</th>
                <th>{order.totalAmount.toLocaleString("vi-VN")} ₫</th>
              </tr>
            </tfoot>
          </Table>
        </>
      )}
    </div>
  );
}

export default OrderDetails;