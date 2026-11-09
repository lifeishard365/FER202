import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:9999";
const PAGE_SIZE = 8;

function Home() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const [foodResponse, categoryResponse, restaurantResponse] =
          await Promise.all([
            axios.get(`${API_URL}/foods`),
            axios.get(`${API_URL}/categories`),
            axios.get(`${API_URL}/restaurants`),
          ]);

        setFoods(foodResponse.data);
        setCategories(categoryResponse.data);
        setRestaurants(restaurantResponse.data);
      } catch (requestError) {
        setError(
          "Không thể tải thực đơn. Hãy đảm bảo JSON Server đang chạy với file db.json của project."
        );
        console.error("Could not load menu:", requestError);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const filteredFoods = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("vi");

    return foods
      .filter((food) => {
        const matchesName = food.name
          .toLocaleLowerCase("vi")
          .includes(normalizedSearch);
        const matchesCategory =
          !categoryFilter || food.categoryId === categoryFilter;
        const matchesRestaurant =
          !restaurantFilter || food.restaurantId === restaurantFilter;

        return matchesName && matchesCategory && matchesRestaurant;
      })
      .sort((foodA, foodB) => {
        const dateA = Date.parse(foodA.createdAt);
        const dateB = Date.parse(foodB.createdAt);
        const hasDateA = Number.isFinite(dateA);
        const hasDateB = Number.isFinite(dateB);
        const direction = sortOrder === "newest" ? -1 : 1;

        if (hasDateA !== hasDateB) {
          return hasDateA ? direction : -direction;
        }

        if (hasDateA && dateA !== dateB) {
          return (dateA - dateB) * direction;
        }

        const idA = Number(String(foodA.id).match(/\d+$/)?.[0]);
        const idB = Number(String(foodB.id).match(/\d+$/)?.[0]);
        return Number.isFinite(idA) && Number.isFinite(idB)
          ? (idA - idB) * direction
          : 0;
      });
  }, [foods, search, categoryFilter, restaurantFilter, sortOrder]);

  const pageCount = Math.ceil(filteredFoods.length / PAGE_SIZE);
  const visibleFoods = filteredFoods.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const updateFilter = (setFilter) => (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const categoryName = (categoryId) =>
    categories.find((category) => category.id === categoryId)?.name ??
    "Chưa phân loại";
  const restaurantName = (restaurantId) =>
    restaurants.find((restaurant) => restaurant.id === restaurantId)?.name ??
    "Chưa có nhà hàng";

  return (
    <div className="py-4 py-md-5">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <p className="text-muted mb-1">THỰC ĐƠN NHÀ HÀNG</p>
          <h1 className="h2 mb-0">Khám phá món ngon</h1>
          <p className="text-muted mt-2 mb-0">
            Tìm món ăn yêu thích từ các nhà hàng.
          </p>
        </div>
        <Button as={Link} to="/Food/add" variant="primary">
          + Thêm món ăn
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Form.Group as={Col} md={4} controlId="menuSearch">
              <Form.Label className="visually-hidden">Tìm món ăn</Form.Label>
              <Form.Control
                type="search"
                placeholder="Tìm theo tên món..."
                value={search}
                onChange={updateFilter(setSearch)}
              />
            </Form.Group>
            <Form.Group as={Col} md={4} controlId="menuCategory">
              <Form.Label className="visually-hidden">Lọc danh mục</Form.Label>
              <Form.Select
                value={categoryFilter}
                onChange={updateFilter(setCategoryFilter)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} md={4} controlId="menuRestaurant">
              <Form.Label className="visually-hidden">Lọc nhà hàng</Form.Label>
              <Form.Select
                value={restaurantFilter}
                onChange={updateFilter(setRestaurantFilter)}
              >
                <option value="">Tất cả nhà hàng</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} md={4} controlId="menuSortOrder">
              <Form.Label className="visually-hidden">
                Sắp xếp theo thời gian thêm
              </Form.Label>
              <Form.Select
                value={sortOrder}
                onChange={updateFilter(setSortOrder)}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </Form.Select>
            </Form.Group>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="text-muted mt-3 mb-0">Đang tải thực đơn...</p>
        </div>
      ) : filteredFoods.length === 0 ? (
        <Alert variant="light" className="text-center py-4">
          Không tìm thấy món ăn phù hợp.
        </Alert>
      ) : (
        <>
          <p className="text-muted mb-3">
            Hiển thị {visibleFoods.length} / {filteredFoods.length} món ăn
          </p>
          <Row className="g-4">
            {visibleFoods.map((food) => (
              <Col key={food.id} sm={6} lg={4} xl={3}>
                <Card className="h-100 border-0 shadow-sm overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={food.image}
                    alt={food.name}
                    style={{ height: 190, objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <Badge bg="light" text="dark">
                        {categoryName(food.categoryId)}
                      </Badge>
                      <Badge bg={food.isAvailable ? "success" : "secondary"}>
                        {food.isAvailable ? "Đang bán" : "Tạm hết"}
                      </Badge>
                    </div>
                    <Card.Title className="h5">{food.name}</Card.Title>
                    <Card.Text className="small text-muted mb-2">
                      {restaurantName(food.restaurantId)}
                    </Card.Text>
                    <Card.Text className="text-muted flex-grow-1">
                      {food.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <strong className="text-primary">
                        {Number(food.price).toLocaleString("vi-VN")} ₫
                      </strong>
                      <Button
                        as={Link}
                        to={`/Food/${food.id}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {pageCount > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.First
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                aria-label="Trang đầu"
              />
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                aria-label="Trang trước"
              />
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                )
              )}
              <Pagination.Next
                disabled={currentPage === pageCount}
                onClick={() => setCurrentPage((page) => page + 1)}
                aria-label="Trang sau"
              />
              <Pagination.Last
                disabled={currentPage === pageCount}
                onClick={() => setCurrentPage(pageCount)}
                aria-label="Trang cuối"
              />
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

export default Home;