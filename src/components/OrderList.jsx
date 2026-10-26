import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/orders")
      .then((res) => setOrders(res.data))
      .catch((error) => console.log(error.message));
  }, []);

  return (
    <div className="container mt-4">
      <h3>Danh sách đơn hàng</h3>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.totalAmount}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default OrderList;
