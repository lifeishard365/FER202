import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  deleteFood,
  getCategory,
  getFood,
  getRestaurant,
  updateFood,
} from "../config/api";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  image: "",
  categoryId: "",
  restaurantId: "",
  isAvailable: true,
};

function FoodManagement() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingFood, setEditingFood] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const loadManagementData = async () => {
      try {
        const [foodResponse, categoryResponse, restaurantResponse] =
          await Promise.all([getFood(), getCategory(), getRestaurant()]);

        setFoods(foodResponse.data);
        setCategories(categoryResponse.data);
        setRestaurants(restaurantResponse.data);
      } catch (requestError) {
        setError("Không thể tải danh sách món ăn.");
        console.error("Could not load food management data:", requestError);
      } finally {
        setLoading(false);
      }
    };

    loadManagementData();
  }, []);

  const categoryName = (categoryId) =>
    categories.find((category) => category.id === categoryId)?.name ??
    "Chưa phân loại";
  const restaurantName = (restaurantId) =>
    restaurants.find((restaurant) => restaurant.id === restaurantId)?.name ??
    "Chưa có nhà hàng";

  const openEditModal = (food) => {
    setError("");
    setSuccess("");
    setEditingFood(food);
    setForm({
      name: food.name ?? "",
      price: String(food.price ?? ""),
      description: food.description ?? "",
      image: food.image ?? "",
      categoryId: food.categoryId ?? "",
      restaurantId: food.restaurantId ?? "",
      isAvailable: food.isAvailable ?? true,
    });
  };

  const closeEditModal = () => {
    if (!saving) {
      setEditingFood(null);
      setForm(emptyForm);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const price = Number(form.price);
    if (
      form.price.trim() === "" ||
      !Number.isFinite(price) ||
      !Number.isInteger(price) ||
      price <= 0
    ) {
      setError("Giá món ăn phải là số nguyên lớn hơn 0.");
      return;
    }

    setSaving(true);
    try {
      const updatedFood = {
        ...form,
        price,
      };
      await updateFood(editingFood.id, updatedFood);

      setFoods((currentFoods) =>
        currentFoods.map((food) =>
          food.id === editingFood.id ? { ...food, ...updatedFood } : food
        )
      );
      setEditingFood(null);
      setForm(emptyForm);
      setSuccess("Cập nhật món ăn thành công.");
    } catch (requestError) {
      setError("Không thể cập nhật món ăn. Vui lòng thử lại.");
      console.error("Could not update food:", requestError);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (food) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa món "${food.name}" không?`
    );
    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(food.id);
    try {
      await deleteFood(food.id);
      setFoods((currentFoods) =>
        currentFoods.filter((item) => item.id !== food.id)
      );
      setSuccess(`Đã xóa món "${food.name}".`);
    } catch (requestError) {
      setError("Không thể xóa món ăn. Vui lòng thử lại.");
      console.error("Could not delete food:", requestError);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="py-4 py-md-5">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <p className="text-muted mb-1">QUẢN LÝ THỰC ĐƠN</p>
          <h1 className="h3 mb-0">Danh sách món ăn</h1>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/Food" variant="outline-secondary">
            Về trang chủ
          </Button>
          <Button as={Link} to="/Food/add" variant="primary">
            + Thêm món
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" />
              <p className="text-muted mt-3 mb-0">
                Đang tải danh sách món ăn...
              </p>
            </div>
          ) : foods.length === 0 ? (
            <Alert variant="light" className="text-center mb-0">
              Chưa có món ăn nào.
            </Alert>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Món ăn</th>
                  <th>Danh mục</th>
                  <th>Nhà hàng</th>
                  <th className="text-end">Giá</th>
                  <th>Trạng thái</th>
                  <th className="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {food.image && (
                          <img
                            src={food.image}
                            alt=""
                            width="52"
                            height="44"
                            className="rounded"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                        <div>
                          <div className="fw-semibold">{food.name}</div>
                          <small className="text-muted">{food.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{categoryName(food.categoryId)}</td>
                    <td>{restaurantName(food.restaurantId)}</td>
                    <td className="text-end">
                      {Number(food.price).toLocaleString("vi-VN")} ₫
                    </td>
                    <td>
                      {food.isAvailable ? "Đang bán" : "Tạm hết"}
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openEditModal(food)}
                          disabled={deletingId === food.id}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(food)}
                          disabled={deletingId === food.id}
                        >
                          {deletingId === food.id ? "Đang xóa..." : "Xóa"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(editingFood)} onHide={closeEditModal} centered>
        <Form onSubmit={handleUpdate}>
          <Modal.Header closeButton={!saving}>
            <Modal.Title>Sửa thông tin món ăn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row className="g-3">
              <Form.Group as={Col} md={8} controlId="editFoodName">
                <Form.Label>Tên món</Form.Label>
                <Form.Control
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md={4} controlId="editFoodPrice">
                <Form.Label>Giá (₫)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md={6} controlId="editFoodCategory">
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
              <Form.Group as={Col} md={6} controlId="editFoodRestaurant">
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
              <Form.Group as={Col} xs={12} controlId="editFoodImage">
                <Form.Label>URL hình ảnh</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/food.jpg"
                />
              </Form.Group>
              <Form.Group as={Col} xs={12} controlId="editFoodDescription">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={500}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} xs={12}>
                <Form.Check
                  type="switch"
                  id="editFoodAvailability"
                  name="isAvailable"
                  label="Đang bán"
                  checked={form.isAvailable}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="light"
              onClick={closeEditModal}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
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
                "Lưu thay đổi"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default FoodManagement;
