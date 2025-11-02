import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMicrophone,
  FaPaperclip,
  FaArrowLeft,
  FaCog,
  FaPlus,
  FaCopy,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import "./Dashboard.css";

const AutoTextarea = ({ value, onChange, onKeyDown, placeholder }) => {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      className="auto-textarea"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  );
};

const formatBytes = (bytes) => {
  if (!bytes) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', type:'text'|'image'|'document', content, name, fileUrl }
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // rotating tips while thinking
  const tips = [
    "Tip: try asking Agent OG to summarize the emails.",
    "Agent OG can extract data from your personal drive",
    "Short prompts get faster replies. Add details for accuracy.",
    "It makes some time when query is too large",
    "You can press ⏎ to send, Shift+Enter for a newline.",
  ];
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("agentog_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse agentog_user", err);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    let t;
    if (loading) {
      t = setInterval(() => {
        setTipIndex((i) => (i + 1) % tips.length);
      }, 4000);
    }
    return () => clearInterval(t);
  }, [loading]);

  // Speech to text
  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (ev) => {
      const transcript = ev.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onerror = (e) => {
      console.error("Speech error", e);
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  // File select
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const showCopyToast = (text = "Copied") => {
    const toast = document.createElement("div");
    toast.className = "copy-toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showCopyToast("Copied ✅");
    } catch {
      showCopyToast("Copy failed");
    }
  };

  const handleEdit = (idx) => {
    const msg = messages[idx];
    if (!msg || msg.type !== "text") return;
    setEditingIndex(idx);
    setInput(msg.content);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const sendToWebhook = async ({ text, file }) => {
    // follows your sample code: if file => FormData (messageType=document), else JSON with messageType=text
    if (!user?.webhookUrl) {
      throw new Error("Webhook URL not configured for this user.");
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("text", text || file.name);
      formData.append("messageType", "document");
      return fetch(user.webhookUrl, { method: "POST", body: formData });
    } else {
      return fetch(user.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text || "", messageType: "text" }),
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    // editing existing user message
    if (editingIndex !== null) {
      const copy = [...messages];
      copy[editingIndex] = {
        ...copy[editingIndex],
        content: input,
      };
      setMessages(copy);
      setEditingIndex(null);
      setInput("");
      return;
    }

    // Append user message (text or a file as message)
    if (selectedFile) {
      const fileType = selectedFile.type.startsWith("image/")
        ? "image"
        : "document";
      const fileUrl = previewUrl || URL.createObjectURL(selectedFile);
      setMessages((p) => [
        ...p,
        {
          role: "user",
          type: fileType,
          content: selectedFile.name,
          fileUrl,
          name: selectedFile.name,
          size: selectedFile.size,
        },
      ]);
    } else {
      setMessages((p) => [
        ...p,
        { role: "user", type: "text", content: input },
      ]);
    }

    // reset input / preview
    const textToSend = input;
    setInput("");
    setLoading(true);

    // add assistant thinking placeholder
    setMessages((p) => [
      ...p,
      { role: "assistant", type: "typing", content: "Agent OG is thinking..." },
    ]);

    try {
      const res = await sendToWebhook({
        text: textToSend,
        file: selectedFile || null,
      });

      const ct = res.headers.get("content-type") || "";

      // remove assistant typing placeholder before adding actual response
      setMessages((p) => p.filter((m) => m.type !== "typing"));

      if (ct.includes("application/json")) {
        const data = await res.json();
        // try common fields
        const replyText =
          data.output?.response ||
          data.output?.text ||
          data.response ||
          data.text ||
          JSON.stringify(data, null, 2);
        setMessages((p) => [
          ...p,
          { role: "assistant", type: "text", content: replyText },
        ]);
      } else if (ct.startsWith("image/")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setMessages((p) => [
          ...p,
          { role: "assistant", type: "image", content: "image", fileUrl: url },
        ]);
      } else if (
        ct.includes("pdf") ||
        ct.includes("officedocument") ||
        ct.includes("octet-stream") ||
        ct.includes("application/")
      ) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setMessages((p) => [
          ...p,
          {
            role: "assistant",
            type: "document",
            content: "document",
            fileUrl: url,
            name: `response${Date.now()}`,
          },
        ]);
      } else {
        const text = await res.text();
        // some webhook responses may be JSON text — try to parse common shapes
        let reply = text;
        try {
          const maybe = JSON.parse(text);
          reply =
            maybe.output?.response ||
            maybe.response ||
            maybe.text ||
            JSON.stringify(maybe, null, 2);
        } catch {
          // keep text as-is
        }
        setMessages((p) => [
          ...p,
          { role: "assistant", type: "text", content: reply },
        ]);
      }
    } catch (err) {
      console.error("Webhook error", err);
      // remove typing placeholder
      setMessages((p) => p.filter((m) => m.type !== "typing"));
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          type: "text",
          content: "⚠️ Resource not found.",
        },
      ]);
    } finally {
      setLoading(false);
      removeFile();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <button className="back-btn" onClick={() => navigate("/")}>
            <FaArrowLeft />
          </button>
          <div className="brand">Agent OG</div>
        </div>

        <div className="new-chat">
          <button
            className="new-chat-btn"
            onClick={() => {
              setMessages([]);
              setInput("");
              setSelectedFile(null);
            }}
          >
            <FaPlus />
            <span>New chat</span>
            <span className="plus">+</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <button
            className="settings-btn"
            title="Settings"
            onClick={() => {
              /* placeholder for settings navigation */
              console.log("open settings");
            }}
          >
            <FaCog />
          </button>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="chat-area">
        <header className="chat-header">
          <div className="header-left">
            <h3>Agent OG</h3>
            <div className="header-sub">Your personal assistant</div>
          </div>
        </header>

        <section className="messages-area">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`message-row ${
                m.role === "user" ? "user" : "assistant"
              }`}
            >
              {/* avatar */}
              <div className="msg-avatar">
                {m.role === "user" ? (
                  <div className="avatar-user">U</div>
                ) : (
                  <div className="avatar-bot">A</div>
                )}
              </div>

              <div className="msg-bubble-wrapper">
                <div
                  className={`msg-bubble ${
                    m.role === "user" ? "bubble-user" : "bubble-assistant"
                  }`}
                >
                  {/* message content types */}
                  {m.type === "text" && (
                    <div className="msg-text">{m.content}</div>
                  )}

                  {m.type === "typing" && (
                    <div className="typing-block">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div className="typing-text">
                        <strong>Agent OG is thinking</strong>
                        <div className="typing-tip">{tips[tipIndex]}</div>
                      </div>
                    </div>
                  )}

                  {m.type === "image" && (
                    <img
                      className="response-image"
                      src={m.fileUrl}
                      alt={m.name || "image"}
                    />
                  )}

                  {m.type === "document" && (
                    <div className="attached-file">
                      <div className="file-icon">📄</div>
                      <div className="file-meta">
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="file-name"
                        >
                          {m.name || m.content}
                        </a>
                        {m.size && (
                          <div className="file-size">{formatBytes(m.size)}</div>
                        )}
                      </div>
                      <a
                        className="file-download"
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>

                {/* message actions (copy/edit) */}
                <div className="msg-actions">
                  {m.type === "text" && (
                    <>
                      <button
                        className="action-btn"
                        onClick={() => handleCopy(m.content)}
                      >
                        <FaCopy />
                        <span>Copy</span>
                      </button>
                      {m.role === "user" && (
                        <button
                          className="action-btn"
                          onClick={() => handleEdit(idx)}
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="thinking-footer">
              <div className="small-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="thinking-text">
                Agent OG is thinking... {tips[tipIndex]}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        {/* file preview (chatgpt-like attachment view) */}
        {selectedFile && (
          <div className="file-preview">
            <div className="fp-left">
              <div className="fp-icon">
                {selectedFile.type.startsWith("image/") ? "🖼️" : "📎"}
              </div>
              <div className="fp-meta">
                <div className="fp-name">{selectedFile.name}</div>
                <div className="fp-size">{formatBytes(selectedFile.size)}</div>
              </div>
            </div>
            <button className="fp-remove" onClick={removeFile}>
              <FaTimes />
            </button>
          </div>
        )}

        {/* Input area */}
        <footer className="chat-input">
          <label
            htmlFor="file-input"
            className="input-icon attach-icon"
            title="Attach file"
          >
            <FaPaperclip />
          </label>
          <input
            id="file-input"
            type="file"
            hidden
            onChange={handleFileSelect}
          />

          <button
            className={`input-icon mic-icon ${isRecording ? "recording" : ""}`}
            onClick={toggleRecording}
            title="Speak"
          >
            <FaMicrophone />
          </button>

          <AutoTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or upload a file"
          />

          <button className="send-btn" onClick={handleSend} disabled={loading}>
            ➤
          </button>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
