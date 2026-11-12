import { useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UserBar from "./components/UserBar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import AddFood from "./components/AddFood";
import FoodManagement from "./components/FoodManagement";
import Detail from "./components/Details";
import Cart from "./components/Cart";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food) => {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === food.id);

      if (existingItem) {
        return items.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { ...food, quantity: 1 }];
    });
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Container>
          <UserBar onLogout={() => setCartItems([])} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Food" element={<Home/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/Cart"
              element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
            />
            <Route path="/Food/:id" element={<Detail onAddToCart={addToCart} />}/>

            <Route
              path="/Food/manage"
              element={<ProtectedRoute adminOnly><FoodManagement /></ProtectedRoute>}
            />
            <Route
              path="/Food/add"
              element={<ProtectedRoute adminOnly><AddFood/></ProtectedRoute>}
            />

            <Route
              path="/OrderList"
              element={<ProtectedRoute><OrderList/></ProtectedRoute>}
            />
            <Route
              path="/OrderList/:id"
              element={<ProtectedRoute><OrderDetails/></ProtectedRoute>}
            />
          </Routes>
          <br></br>
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
