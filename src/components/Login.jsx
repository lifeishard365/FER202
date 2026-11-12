import { useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from ?? "/Food";

  if (user) return <Navigate to={redirectTo} replace />;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.message === "Network Error"
          ? "Không kết nối được máy chủ. Hãy bật JSON Server (cổng 9999)."
          : err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row className="justify-content-center py-4">
      <Col md={7} lg={5}>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h1 className="h3 mb-1">Đăng nhập</h1>
            <p className="text-muted">Đăng nhập để đặt món và xem đơn hàng của bạn.</p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="loginPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100" disabled={submitting}>
                {submitting ? <Spinner size="sm" animation="border" /> : "Đăng nhập"}
              </Button>
            </Form>

            <p className="text-center mt-3 mb-0">
              Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Login;
