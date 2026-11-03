import { Table, Button } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getFood, getCategory, getRestaurant } from "../config/api";

function Detail() {
  const { id } = useParams();
  const [food,setFood] = useState([]);
  const [category,setCategory] = useState([]);
  const [restaurant,setRestaurant] = useState([]);
}
export default Detail;
