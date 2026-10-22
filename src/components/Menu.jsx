import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

function Menu() {
  return (
    <Nav className="d-flex flex-row">
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? "red" : "black",
          textDecoration: "none",
          fontSize: "30px",
        })}
      >
        Trang chủ
      </NavLink>

      <NavLink
        to="/about"
        style={({ isActive }) => ({
          color: isActive ? "red" : "black",
          textDecoration: "none",
          fontSize: "30px",
        })}
      >
        Giới thiệu
      </NavLink>

      <NavLink
        to="/product"
        style={({ isActive }) => ({
          color: isActive ? "red" : "black",
          textDecoration: "none",
          fontSize: "30px",
        })}
      >
        Sản phẩm
      </NavLink>
    </Nav>
  );
}

export default Menu;
