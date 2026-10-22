import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./components/Home";
import About from "./components/About";
import Product from "./components/Product";
import Footer from "./components/Footer";
import Movies from "./components/Movies";

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/movies-showtimes" element={<Movies />} />
        </Routes>
        <Footer />
      </Container>
    </BrowserRouter>
  );
}

export default App;
