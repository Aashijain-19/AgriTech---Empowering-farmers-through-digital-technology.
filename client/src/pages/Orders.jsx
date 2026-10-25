import { useEffect, useState } from "react";
import api, { errMsg } from "../api";

export default function Orders() {
  const [list, setList] = useState([]);
  const load = () => api.get("/bookings/mine").then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const cancel = async (id) => { try { await api.put(`/bookings/${id}/cancel`); load(); } catch (e) { alert(errMsg(e)); } };
  return (
    <>
      <h1>My Orders & Bookings</h1>
      <div className="card">
        <table>
          <thead><tr><th>Item</th><th>Qty</th><th>Booked on</th><th>Service date</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {list.map((b) => (
              <tr key={b._id}>
                <td>{b.product?.name || "Removed product"}</td>
                <td>{b.quantity}</td>
                <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                <td>{b.serviceDate ? new Date(b.serviceDate).toLocaleDateString() : "-"}</td>
                <td>₹{b.totalAmount}</td>
                <td><span className={`tag ${b.status}`}>{b.status}</span></td>
                <td>{b.status === "pending" && <button className="btn danger" onClick={() => cancel(b._id)}>Cancel</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted">No orders yet.</p>}
      </div>
    </>
  );
}
