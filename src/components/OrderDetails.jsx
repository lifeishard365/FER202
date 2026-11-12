import { useEffect, useState } from "react";
import { Alert, Badge, Button, Form, Spinner, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import {
  getAddressById,
  getOrderById,
  getRestaurant,
  updateOrder,
} from "../config/api";
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

const formatAddress = (address) => {
  if (address.fullAddress) return address.fullAddress;
  const parts = [address.street, address.ward, address.district, address.city];
  return parts.filter(Boolean).join(", ") || address.id;
};

function OrderDetails() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [restaurantName, setRestaurantName] = useState("Không rõ");
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const [orderRes, restaurantRes] = await Promise.all([
          getOrderById(id),
          getRestaurant(),
        ]);
        const data = orderRes.data;

        if (!isAdmin && data.userId !== user.id) {
          setOrder(null);
          setError("Bạn không có quyền xem đơn hàng này.");
          return;
        }

        setOrder(data);
        const restaurant = restaurantRes.data.find(
          (item) => item.id === data.restaurantId
        );
        if (restaurant) setRestaurantName(restaurant.name);

        const addressRes = await getAddressById(data.addressId).catch(() => null);
        setAddress(addressRes?.data ?? null);
      } catch {
        setOrder(null);
        setError("Không tìm thấy đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, isAdmin, user.id]);

  const changeStatus = async (status) => {
    setError("");
    try {
      const res = await updateOrder(id, {
        status,
        updatedAt: new Date().toISOString(),
      });
      setOrder(res.data);
    } catch {
      setError("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) {
      changeStatus("CANCELLED");
    }
  };

  if (loading) return <Spinner animation="border" className="m-4" />;

  const status = ORDER_STATUS[order?.status];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Chi tiết đơn hàng</h3>
        <Button as={Link} to="/OrderList" variant="outline-secondary">
          Quay lại danh sách
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {order && (
        <>
          <dl className="row">
            <dt className="col-sm-3">Mã đơn</dt>
            <dd className="col-sm-9">{order.id}</dd>
            <dt className="col-sm-3">Nhà hàng</dt>
            <dd className="col-sm-9">{restaurantName}</dd>
            <dt className="col-sm-3">Trạng thái</dt>
            <dd className="col-sm-9">
              <Badge style={{ backgroundColor: status?.color ?? "#6c757d" }}>
                {status?.label ?? order.status}
              </Badge>
            </dd>
            <dt className="col-sm-3">Giao đến</dt>
            <dd className="col-sm-9">
              {address ? formatAddress(address) : order.addressId}
            </dd>
            {order.phone && (
              <>
                <dt className="col-sm-3">Số điện thoại</dt>
                <dd className="col-sm-9">{order.phone}</dd>
              </>
            )}
            <dt className="col-sm-3">Thanh toán</dt>
            <dd className="col-sm-9">
              {PAYMENT_METHOD[order.paymentMethod] ?? order.paymentMethod}
            </dd>
            <dt className="col-sm-3">Ngày đặt</dt>
            <dd className="col-sm-9">{formatDateTime(order.createdAt) || "Không rõ"}</dd>
            {order.note && (
              <>
                <dt className="col-sm-3">Ghi chú</dt>
                <dd className="col-sm-9">{order.note}</dd>
              </>
            )}
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
              {(order.items ?? []).map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Tạm tính</td>
                <td>{formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3}>Phí giao hàng</td>
                <td>{formatPrice(order.deliveryFee)}</td>
              </tr>
              <tr>
                <td colSpan={3}>Giảm giá</td>
                <td>- {formatPrice(order.discount)}</td>
              </tr>
              <tr>
                <th colSpan={3}>Tổng tiền</th>
                <th>{formatPrice(order.totalAmount)}</th>
              </tr>
            </tfoot>
          </Table>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            {order.status === "PENDING" && (
              <Button variant="outline-danger" onClick={handleCancel}>
                Hủy đơn
              </Button>
            )}

            {isAdmin && (
              <Form.Select
                style={{ width: "auto" }}
                value={order.status}
                onChange={(e) => changeStatus(e.target.value)}
                aria-label="Cập nhật trạng thái đơn"
              >
                {Object.entries(ORDER_STATUS).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </Form.Select>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default OrderDetails;
