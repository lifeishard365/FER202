import { useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/Food" replace />;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Mật khẩu cần có ít nhất 6 ký tự.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }
    if (!/^0\d{9}$/.test(form.phone)) {
      setError("Số điện thoại gồm 10 chữ số và bắt đầu bằng 0.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone,
        password: form.password,
      });
      navigate("/Food", { replace: true });
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
      <Col md={8} lg={6}>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h1 className="h3 mb-1">Tạo tài khoản</h1>
            <p className="text-muted">Chỉ mất một phút để bắt đầu đặt món.</p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="regName">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  maxLength={60}
                  required
                />
              </Form.Group>
              <Row className="g-3 mb-3">
                <Form.Group as={Col} md={7} controlId="regEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} md={5} controlId="regPhone">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={10}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="g-3 mb-4">
                <Form.Group as={Col} md={6} controlId="regPassword">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="regConfirm">
                  <Form.Label>Nhập lại mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Row>
              <Button type="submit" className="w-100" disabled={submitting}>
                {submitting ? <Spinner size="sm" animation="border" /> : "Đăng ký"}
              </Button>
            </Form>

            <p className="text-center mt-3 mb-0">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Register;
