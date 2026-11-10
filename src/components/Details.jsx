import { Table, Button, Col } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFood, getCategory, getRestaurant } from "../config/api";

function Detail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [category, setCategory] = useState([]);
  const [restaurant, setRestaurant] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resFood, resCategory, resRestaurant] = await Promise.all([
          getFood(),
          getCategory(),
          getRestaurant(),
        ]);

        const selectedFood = resFood.data.find((food) => food.id === id);
        setFood(selectedFood || null);
        setCategory(resCategory.data);
        setRestaurant(resRestaurant.data);
      } catch {
        setError("Unable to load food details.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setError(null);
    loadData();
  }, [id]);

  const categoryName = useMemo(() => {
    if (!food) return " ";
    return category.find((c) => c.id === food.categoryId)?.name || " ";
  }, [food, category]);

  const restaurantName = useMemo(() => {
    if (!food) return " ";
    return restaurant.find((r) => r.id === food.restaurantId)?.name || " ";
  }, [food, restaurant]);

  if (loading) return <p>Loading food details...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!food) return <p>Food not found.</p>;

  return (
    <div>
      <div>
        <Button as={Link} variant="secondary" to={`/Food`}>
          Back to list
        </Button>
      </div>
      <div>
        <h2 className="mb-3" style={{ fontWeight: 700 }}>
          {food.name.toUpperCase()}
        </h2>
      </div>
      <div>
        <div style={{ display: "flex" }}>
          <Col md={6}>
            <img
              src={food.image}
              alt=""
              style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }}
            />
          </Col>
          <Col md={6}>
            <Table className="mb-0" striped bordered>
              <tbody>
                <tr>
                  <th>Category</th>
                  <td>{categoryName}</td>
                </tr>
                <tr>
                  <th>Restaurant</th>
                  <td>{restaurantName}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{food.description}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>
                    <div style={{ textDecoration: "line-through" }}>
                      {" "}
                      {food.originalPrice} VND{" "}
                    </div>
                    <div>{food.price} VND</div>
                  </td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{food.isAvailable ? "Available" : "Not Available"}</td>
                </tr>
                <tr>
                  <th>Rating</th>
                  <td>{food.rating}</td>
                </tr>
                <tr></tr>
              </tbody>
            </Table>
            <br></br>
            <Button
              variant="success"
              onClick={() => {
                onAddToCart(food);
                navigate("/Cart");
              }}
              style={{ marginTop: "10px" ,padding: "10px 20px", fontSize: "16px", fontWeight: "bold" }}
            >
              Add to Cart
            </Button>
          </Col>
        </div>
      </div>
    </div>
  );
}
export default Detail;
