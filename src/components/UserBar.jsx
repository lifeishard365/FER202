import { Badge, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserBar({ onLogout }) {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
    navigate("/Food");
  };

  return (
    <div className="d-flex justify-content-end align-items-center gap-2 pt-3 small">
      {user ? (
        <>
          <span>
            Xin chào, <strong>{user.fullName ?? user.email}</strong>
            {isAdmin && <Badge bg="secondary" className="ms-1">Admin</Badge>}
          </span>
          <Button as={Link} to="/OrderList" size="sm" variant="outline-secondary">
            {isAdmin ? "Tất cả đơn hàng" : "Đơn hàng của tôi"}
          </Button>
          <Button size="sm" variant="outline-danger" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </>
      ) : (
        <>
          <Button as={Link} to="/login" size="sm" variant="outline-primary">
            Đăng nhập
          </Button>
          <Button as={Link} to="/register" size="sm">
            Đăng ký
          </Button>
        </>
      )}
    </div>
  );
}

export default UserBar;
