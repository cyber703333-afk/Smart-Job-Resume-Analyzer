import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function ChatbotWidget() {
  const { sendChatMessage, currentUser } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me how to apply, post a job, save jobs, or check your application status." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setSending(true);
    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "bot", text: "Sorry, I couldn't respond right now." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: "1.25rem", right: "1.25rem", zIndex: 1000 }}>
      {open && (
        <div
          className="card"
          style={{
            width: 300, height: 400, display: "flex", flexDirection: "column",
            padding: 0, overflow: "hidden", marginBottom: "0.75rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ background: "var(--color-primary)", color: "#fff", padding: "0.75rem 1rem", fontWeight: 700, fontSize: "0.9rem" }}>
            🤖 Assistant {currentUser ? `· ${currentUser.name.split(" ")[0]}` : ""}
          </div>
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  background: m.from === "user" ? "var(--color-primary)" : "var(--color-surface)",
                  color: m.from === "user" ? "#fff" : "var(--color-text)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.82rem",
                  maxWidth: "85%",
                  whiteSpace: "pre-line",
                }}
              >
                {m.text}
              </div>
            ))}
            {sending && <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Typing…</div>}
          </div>
          <form onSubmit={handleSend} style={{ display: "flex", borderTop: "1px solid var(--color-border)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              style={{ flex: 1, border: "none", padding: "0.6rem 0.75rem", fontSize: "0.85rem", outline: "none" }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: 0 }} disabled={sending}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chatbot"
        style={{
          width: 54, height: 54, borderRadius: "50%", border: "none",
          background: "var(--color-primary)", color: "#fff", fontSize: "1.4rem",
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)", cursor: "pointer",
        }}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
