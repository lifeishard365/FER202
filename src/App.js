import { useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AddFood from "./components/AddFood";
import Detail from "./components/Details";
import Cart from "./components/Cart";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";
import Footer from "./components/Footer";

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
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Food" element={<Home/>}/>
          <Route
            path="/Cart"
            element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
          />
          <Route path="/Food/add" element={<AddFood/>}/>
          <Route path="/Food/:id" element={<Detail onAddToCart={addToCart} />}/>
          <Route path="/OrderList" element={<OrderList/>}/>
          <Route path="/OrderList/:id" element={<OrderDetails/>}/>
          <Route path="/Footer" element={<AddFood/>}/>
        </Routes>
        <Footer />
      </Container>
    </BrowserRouter>
  );
}

export default App;
