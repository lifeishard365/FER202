import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:9999";

function AddFood() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    categoryId: "",
    restaurantId: "",
  });
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [categoryResponse, restaurantResponse, optionResponse] =
          await Promise.all([
            axios.get(`${API_URL}/categories`),
            axios.get(`${API_URL}/restaurants`),
            axios.get(`${API_URL}/foodOptions`),
          ]);

        setCategories(categoryResponse.data);
        setRestaurants(restaurantResponse.data);
        setFoodOptions(optionResponse.data);
      } catch (requestError) {
        setError(
          "Không thể tải danh mục."
        );
        console.error("Could not load food form data:", requestError);
      } finally {
        setLoadingData(false);
      }
    };

    loadFormData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleOptionChange = (optionId) => {
    setSelectedOptions((currentOptions) =>
      currentOptions.includes(optionId)
        ? currentOptions.filter((id) => id !== optionId)
        : [...currentOptions, optionId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    if (
      form.price.trim() === "" ||
      !Number.isFinite(price) ||
      !Number.isInteger(price) ||
      price <= 0
    ) {
      setError("Vui lòng nhập giá món ăn là số nguyên lớn hơn 0.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/foods`, {
        ...form,
        price,
        originalPrice: price,
        optionIds: selectedOptions,
        isAvailable: true,
        rating: 0,
        soldCount: 0,
        createdAt: new Date().toISOString(),
      });

      window.alert("Thêm món ăn thành công!");
      navigate("/foods");
    } catch (requestError) {
      setError("Không thể thêm món ăn. Vui lòng thử lại sau.");
      console.error("Could not add food:", requestError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col lg={9} xl={8}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <p className="text-muted mb-1">QUẢN LÝ THỰC ĐƠN</p>
              <h1 className="h3 mb-0">Thêm món ăn mới</h1>
            </div>
            <Button as={Link} to="/foods" variant="outline-secondary">
              Quay lại menu
            </Button>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              {loadingData ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" />
                  <p className="text-muted mt-3 mb-0">
                    Đang tải dữ liệu biểu mẫu...
                  </p>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Form.Group as={Col} md={8} controlId="foodName">
                      <Form.Label>Tên món ăn</Form.Label>
                      <Form.Control
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ví dụ: Burger bò phô mai"
                        maxLength={100}
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={4} controlId="foodPrice">
                      <Form.Label>Giá bán (₫)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Ví dụ: 50000"
                        min="1"
                        step="1"
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={6} controlId="foodCategory">
                      <Form.Label>Danh mục</Form.Label>
                      <Form.Select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} md={6} controlId="foodRestaurant">
                      <Form.Label>Nhà hàng</Form.Label>
                      <Form.Select
                        name="restaurantId"
                        value={form.restaurantId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Chọn nhà hàng</option>
                        {restaurants.map((restaurant) => (
                          <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} controlId="foodImage">
                      <Form.Label>Đường dẫn hình ảnh</Form.Label>
                      <Form.Control
                        type="url"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://example.com/food.jpg"
                        required
                      />
                      <Form.Text className="text-muted">
                        Dán URL ảnh món ăn để hiển thị trên thực đơn.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group as={Col} xs={12} controlId="foodDescription">
                      <Form.Label>Mô tả món ăn</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Mô tả thành phần hoặc hương vị của món ăn..."
                        maxLength={500}
                        required
                      />
                    </Form.Group>

                    {foodOptions.length > 0 && (
                      <Form.Group as={Col} xs={12}>
                        <Form.Label className="mb-2">
                          Tùy chọn món ăn kèm
                        </Form.Label>
                        <Row className="g-3">
                          {foodOptions.map((option) => (
                            <Col sm={6} key={option.id}>
                              <Form.Check
                                type="checkbox"
                                id={`food-option-${option.id}`}
                                label={option.name}
                                checked={selectedOptions.includes(option.id)}
                                onChange={() => handleOptionChange(option.id)}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Form.Group>
                    )}
                  </Row>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button
                      as={Link}
                      to="/foods"
                      variant="light"
                      disabled={submitting}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" variant="primary" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Đang lưu...
                        </>
                      ) : (
                        "Thêm món ăn"
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddFood;
