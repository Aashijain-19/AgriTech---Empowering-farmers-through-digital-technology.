import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [f, setF] = useState({ title: "", body: "" });
  const [reply, setReply] = useState({});
  const load = () => api.get("/forum").then((r) => setPosts(r.data));
  useEffect(() => { load(); }, []);
  const post = async (e) => { e.preventDefault(); await api.post("/forum", f); setF({ title: "", body: "" }); load(); };
  const send = async (id) => { if (!reply[id]) return; await api.post(`/forum/${id}/replies`, { body: reply[id] }); setReply({ ...reply, [id]: "" }); load(); };
  const del = async (id) => { await api.delete(`/forum/${id}`); load(); };
  return (
    <>
      <h1>Community Forum</h1>
      <form className="card" onSubmit={post}>
        <input placeholder="Question title" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <textarea placeholder="Share your experience or ask a question..." required value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
        <button className="btn">Post</button>
      </form>
      {posts.map((p) => (
        <div key={p._id} className="card">
          <div className="list-row"><h3>{p.title}</h3>{(p.user?._id === user._id || user.role === "admin") && <button className="btn danger" onClick={() => del(p._id)}>Delete</button>}</div>
          <small className="muted">by {p.user?.name} · {new Date(p.createdAt).toLocaleString()}</small>
          <p>{p.body}</p>
          {p.replies.map((r) => <div key={r._id} className="reply"><b>{r.user?.name}:</b> {r.body}</div>)}
          <div className="row"><input placeholder="Write a reply..." value={reply[p._id] || ""} onChange={(e) => setReply({ ...reply, [p._id]: e.target.value })} /><button className="btn ghost" onClick={() => send(p._id)}>Reply</button></div>
        </div>
      ))}
    </>
  );
}
