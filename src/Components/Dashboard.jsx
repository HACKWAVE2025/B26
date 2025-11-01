// // import React, { useEffect, useState, useRef } from "react";
// // import "./Dashboard.css";

// // const Dashboard = () => {
// //   const [user, setUser] = useState(null);
// //   const [input, setInput] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [previewUrl, setPreviewUrl] = useState(null);
// //   const [editingIndex, setEditingIndex] = useState(null);
// //   const [isRecording, setIsRecording] = useState(false);
// //   const messagesEndRef = useRef(null);
// //   const recognitionRef = useRef(null);

// //   // Load user from localStorage
// //   useEffect(() => {
// //     const storedUser = localStorage.getItem("agentog_user");
// //     if (storedUser) {
// //       try {
// //         setUser(JSON.parse(storedUser));
// //       } catch (err) {
// //         console.error("Error parsing user:", err);
// //       }
// //     }
// //   }, []);

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   // File upload handler
// //   const handleFileSelect = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setSelectedFile(file);
// //       if (file.type.startsWith("image/")) {
// //         setPreviewUrl(URL.createObjectURL(file));
// //       } else {
// //         setPreviewUrl(null);
// //       }
// //     }
// //   };

// //   const removeFile = () => {
// //     setSelectedFile(null);
// //     setPreviewUrl(null);
// //   };

// //   const handleCopy = async (text) => {
// //     await navigator.clipboard.writeText(text);
// //     alert("Copied to clipboard ✅");
// //   };

// //   const handleEdit = (index) => {
// //     setEditingIndex(index);
// //     setInput(messages[index].text);
// //   };

// //   // Voice input (speech-to-text)
// //   const toggleRecording = () => {
// //     if (!("webkitSpeechRecognition" in window)) {
// //       alert("Speech recognition not supported in this browser");
// //       return;
// //     }

// //     if (isRecording) {
// //       recognitionRef.current.stop();
// //       setIsRecording(false);
// //       return;
// //     }

// //     const recognition = new window.webkitSpeechRecognition();
// //     recognition.lang = "en-US";
// //     recognition.interimResults = false;

// //     recognition.onresult = (event) => {
// //       const transcript = event.results[0][0].transcript;
// //       setInput((prev) => (prev ? prev + " " + transcript : transcript));
// //     };

// //     recognition.onerror = (e) => console.error("Voice error:", e);
// //     recognition.onend = () => setIsRecording(false);

// //     recognitionRef.current = recognition;
// //     recognition.start();
// //     setIsRecording(true);
// //   };

// //   // Send message or file
// //   const handleSend = async () => {
// //     if (!input.trim() && !selectedFile) return;

// //     if (editingIndex !== null) {
// //       const updated = [...messages];
// //       updated[editingIndex].text = input;
// //       setMessages(updated);
// //       setEditingIndex(null);
// //       setInput("");
// //       return;
// //     }

// //     const userMsg = { type: "user", text: input || selectedFile.name };
// //     setMessages((prev) => [...prev, userMsg]);
// //     setInput("");

// //     if (!user?.webhookUrl) {
// //       setMessages((prev) => [
// //         ...prev,
// //         { type: "bot", text: "❌ Webhook URL not found for this user." },
// //       ]);
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       let response;

// //       if (selectedFile) {
// //         const formData = new FormData();
// //         formData.append("file", selectedFile);
// //         formData.append("text", input || selectedFile.name);
// //         formData.append("messageType", "document");
// //         response = await fetch(user.webhookUrl, { method: "POST", body: formData });
// //       } else {
// //         response = await fetch(user.webhookUrl, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ text: input, messageType: "text" }),
// //         });
// //       }

// //       const contentType = response.headers.get("content-type") || "";

// //       if (contentType.includes("application/json")) {
// //         const data = await response.json();
// //         console.log(data)
// //         const replyText = data.output.response  || JSON.stringify(data, null, 2);
// //         setMessages((p) => [...p, { type: "bot", text: replyText }]);
// //       } else if (contentType.startsWith("image/")) {
// //         const blob = await response.blob();
// //         const url = URL.createObjectURL(blob);
// //         setMessages((p) => [...p, { type: "bot", fileType: "image", fileUrl: url }]);
// //       } else if (
// //         contentType.includes("pdf") ||
// //         contentType.includes("officedocument") ||
// //         contentType.includes("octet-stream")
// //       ) {
// //         const blob = await response.blob();
// //         const url = URL.createObjectURL(blob);
// //         setMessages((p) => [...p, { type: "bot", fileType: "document", fileUrl: url }]);
// //       } else {
// //         console.log(response)
// //         const text = await response.text();
// //         setMessages((p) => [...p, { type: "bot", text: text[0].output.response || "🤖 (Empty response)" }]);
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setMessages((p) => [
// //         ...p,
// //         { type: "bot", text: "⚠️ Webhook error. Please check n8n setup." },
// //       ]);
// //     } finally {
// //       setLoading(false);
// //       removeFile();
// //     }
// //   };

// //   if (!user) return <div className="loading-screen">Loading your dashboard...</div>;

// //   return (
// //     <div className="dashboard-container">
// //       {/* Sidebar */}
// //       <div className="sidebar">
// //         <h2>Agent OG</h2>
// //         <ul>
// //           <li className="active">Chat</li>
// //           <li>Workflows</li>
// //           <li>History</li>
// //           <li>Integrations</li>
// //           <li>Settings</li>
// //         </ul>
// //       </div>

// //       {/* Chat Area */}
// //       <div className="chat-area">
// //         <div className="chat-header">
// //           <span>Welcome, {user.name || user.email}</span>
// //         </div>

// //         <div className="chat-window">
// //           {messages.map((msg, i) => (
// //             <div key={i} className={`message ${msg.type}`}>
// //               <div className="message-content fade-in">
// //                 {msg.text && <p>{msg.text}</p>}
// //                 {msg.fileType === "image" && <img src={msg.fileUrl} alt="response" />}
// //                 {msg.fileType === "document" && (
// //                   <a href={msg.fileUrl} target="_blank" rel="noreferrer">
// //                     📄 View Document
// //                   </a>
// //                 )}
// //               </div>
// //               <div className="message-actions">
// //                 {msg.text && <button onClick={() => handleCopy(msg.text)}>📋</button>}
// //                 {msg.type === "user" && <button onClick={() => handleEdit(i)}>✏️</button>}
// //               </div>
// //             </div>
// //           ))}
// //           {loading && <div className="message bot">🤖 Agent OG is thinking...</div>}
// //           <div ref={messagesEndRef} />
// //         </div>

// //         {/* File preview (like ChatGPT) */}
// //         {selectedFile && (
// //           <div className="file-preview fade-in">
// //             {previewUrl && <img src={previewUrl} alt="preview" className="preview-img" />}
// //             <div className="file-info">
// //               <span className="file-name">{selectedFile.name}</span>
// //               <span className="file-size">
// //                 ({(selectedFile.size / 1024).toFixed(1)} KB)
// //               </span>
// //             </div>
// //             <button className="remove-file" onClick={removeFile}>
// //               ❌
// //             </button>
// //           </div>
// //         )}

// //         {/* Input */}
// //         <div className="chat-input">
// //           <button
// //             className={`mic-btn ${isRecording ? "recording" : ""}`}
// //             onClick={toggleRecording}
// //           >
// //             🎤
// //           </button>
// //           <input
// //             type="text"
// //             placeholder="Type or speak..."
// //             value={input}
// //             onChange={(e) => setInput(e.target.value)}
// //             onKeyDown={(e) => e.key === "Enter" && handleSend()}
// //           />
// //           <input type="file" id="file" style={{ display: "none" }} onChange={handleFileSelect} />
// //           <label htmlFor="file" className="file-upload-btn">
// //             📎
// //           </label>
// //           <button onClick={handleSend} disabled={loading}>
// //             ➤
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// // // // // // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // // // // // import "./Dashboard.css";

// // // // // // // // // const Dashboard = () => {
// // // // // // // // //   const [user, setUser] = useState(null);
// // // // // // // // //   const [input, setInput] = useState("");
// // // // // // // // //   const [messages, setMessages] = useState([]);
// // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // //   const [selectedFile, setSelectedFile] = useState(null);
// // // // // // // // //   const [previewUrl, setPreviewUrl] = useState(null);
// // // // // // // // //   const [editingIndex, setEditingIndex] = useState(null);
// // // // // // // // //   const [isRecording, setIsRecording] = useState(false);
// // // // // // // // //   const messagesEndRef = useRef(null);
// // // // // // // // //   const recognitionRef = useRef(null);

// // // // // // // // //   // Load user from localStorage
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const storedUser = localStorage.getItem("agentog_user");
// // // // // // // // //     if (storedUser) {
// // // // // // // // //       try {
// // // // // // // // //         setUser(JSON.parse(storedUser));
// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("Error parsing user:", err);
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   }, []);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // // // // // // //   }, [messages]);

// // // // // // // // //   // File handling
// // // // // // // // //   const handleFileSelect = (e) => {
// // // // // // // // //     const file = e.target.files[0];
// // // // // // // // //     if (file) {
// // // // // // // // //       setSelectedFile(file);
// // // // // // // // //       if (file.type.startsWith("image/")) {
// // // // // // // // //         setPreviewUrl(URL.createObjectURL(file));
// // // // // // // // //       } else {
// // // // // // // // //         setPreviewUrl(null);
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const removeFile = () => {
// // // // // // // // //     setSelectedFile(null);
// // // // // // // // //     setPreviewUrl(null);
// // // // // // // // //   };

// // // // // // // // //   // Copy message text
// // // // // // // // //   const handleCopy = async (text) => {
// // // // // // // // //     await navigator.clipboard.writeText(text);
// // // // // // // // //     alert("Copied to clipboard ✅");
// // // // // // // // //   };

// // // // // // // // //   // Edit user message
// // // // // // // // //   const handleEdit = (index) => {
// // // // // // // // //     setEditingIndex(index);
// // // // // // // // //     setInput(messages[index].text);
// // // // // // // // //   };

// // // // // // // // //   // Speech-to-text
// // // // // // // // //   const toggleRecording = () => {
// // // // // // // // //     if (!("webkitSpeechRecognition" in window)) {
// // // // // // // // //       alert("Speech recognition not supported in this browser");
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     if (isRecording) {
// // // // // // // // //       recognitionRef.current.stop();
// // // // // // // // //       setIsRecording(false);
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     const recognition = new window.webkitSpeechRecognition();
// // // // // // // // //     recognition.lang = "en-US";
// // // // // // // // //     recognition.interimResults = false;

// // // // // // // // //     recognition.onresult = (event) => {
// // // // // // // // //       const transcript = event.results[0][0].transcript;
// // // // // // // // //       setInput((prev) => (prev ? prev + " " + transcript : transcript));
// // // // // // // // //     };

// // // // // // // // //     recognition.onerror = (e) => console.error("Voice error:", e);
// // // // // // // // //     recognition.onend = () => setIsRecording(false);

// // // // // // // // //     recognitionRef.current = recognition;
// // // // // // // // //     recognition.start();
// // // // // // // // //     setIsRecording(true);
// // // // // // // // //   };

// // // // // // // // //   // Send message to webhook
// // // // // // // // //   const handleSend = async () => {
// // // // // // // // //     if (!input.trim() && !selectedFile) return;

// // // // // // // // //     if (editingIndex !== null) {
// // // // // // // // //       const updated = [...messages];
// // // // // // // // //       updated[editingIndex].text = input;
// // // // // // // // //       setMessages(updated);
// // // // // // // // //       setEditingIndex(null);
// // // // // // // // //       setInput("");
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     const userMsg = { type: "user", text: input || selectedFile.name };
// // // // // // // // //     setMessages((prev) => [...prev, userMsg]);
// // // // // // // // //     setInput("");

// // // // // // // // //     if (!user?.webhookUrl) {
// // // // // // // // //       setMessages((prev) => [
// // // // // // // // //         ...prev,
// // // // // // // // //         { type: "bot", text: "❌ Webhook URL not found for this user." },
// // // // // // // // //       ]);
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     try {
// // // // // // // // //       setLoading(true);
// // // // // // // // //       let response;

// // // // // // // // //       if (selectedFile) {
// // // // // // // // //         const formData = new FormData();
// // // // // // // // //         formData.append("file", selectedFile);
// // // // // // // // //         formData.append("text", input || selectedFile.name);
// // // // // // // // //         formData.append("messageType", "document");
// // // // // // // // //         response = await fetch(user.webhookUrl, { method: "POST", body: formData });
// // // // // // // // //       } else {
// // // // // // // // //         response = await fetch(user.webhookUrl, {
// // // // // // // // //           method: "POST",
// // // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // // //           body: JSON.stringify({ text: input, messageType: "text" }),
// // // // // // // // //         });
// // // // // // // // //       }

// // // // // // // // //       const contentType = response.headers.get("content-type") || "";

// // // // // // // // //       if (contentType.includes("application/json")) {
// // // // // // // // //         const data = await response.json();
// // // // // // // // //         const replyText = data.output?.response || JSON.stringify(data, null, 2);
// // // // // // // // //         setMessages((p) => [...p, { type: "bot", text: replyText }]);
// // // // // // // // //       } else if (contentType.startsWith("image/")) {
// // // // // // // // //         const blob = await response.blob();
// // // // // // // // //         const url = URL.createObjectURL(blob);
// // // // // // // // //         setMessages((p) => [...p, { type: "bot", fileType: "image", fileUrl: url }]);
// // // // // // // // //       } else {
// // // // // // // // //         const text = await response.text();
// // // // // // // // //         setMessages((p) => [...p, { type: "bot", text }]);
// // // // // // // // //       }
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error(err);
// // // // // // // // //       setMessages((p) => [
// // // // // // // // //         ...p,
// // // // // // // // //         { type: "bot", text: "⚠️ Webhook error. Please check n8n setup." },
// // // // // // // // //       ]);
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //       removeFile();
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   if (!user) return <div className="loading-screen">Loading your dashboard...</div>;

// // // // // // // // //   return (
// // // // // // // // //     <div className="dashboard-container">
// // // // // // // // //       {/* Sidebar */}
// // // // // // // // //       <div className="sidebar">
// // // // // // // // //         <button className="new-chat-btn">+ New Chat</button>
// // // // // // // // //         <ul>
// // // // // // // // //           <li className="active">Chat</li>
// // // // // // // // //           <li>Workflows</li>
// // // // // // // // //           <li>History</li>
// // // // // // // // //           <li>Integrations</li>
// // // // // // // // //           <li>Settings</li>
// // // // // // // // //         </ul>
// // // // // // // // //       </div>

// // // // // // // // //       {/* Chat Area */}
// // // // // // // // //       <div className="chat-area">
// // // // // // // // //         <div className="chat-header">
// // // // // // // // //           <span>Welcome, {user.name || user.email}</span>
// // // // // // // // //         </div>

// // // // // // // // //         <div className="chat-window">
// // // // // // // // //           {messages.map((msg, i) => (
// // // // // // // // //             <div key={i} className={`message ${msg.type}`}>
// // // // // // // // //               <div className="message-content fade-in">
// // // // // // // // //                 {msg.text && <p>{msg.text}</p>}
// // // // // // // // //                 {msg.fileType === "image" && <img src={msg.fileUrl} alt="response" />}
// // // // // // // // //                 {msg.fileType === "document" && (
// // // // // // // // //                   <a href={msg.fileUrl} target="_blank" rel="noreferrer">
// // // // // // // // //                     📄 View Document
// // // // // // // // //                   </a>
// // // // // // // // //                 )}
// // // // // // // // //               </div>
// // // // // // // // //               <div className="message-actions">
// // // // // // // // //                 {msg.text && <button onClick={() => handleCopy(msg.text)}>📋</button>}
// // // // // // // // //                 {msg.type === "user" && <button onClick={() => handleEdit(i)}>✏️</button>}
// // // // // // // // //               </div>
// // // // // // // // //             </div>
// // // // // // // // //           ))}

// // // // // // // // //           {loading && <div className="message bot">🤖 Agent OG is thinking...</div>}
// // // // // // // // //           <div ref={messagesEndRef} />
// // // // // // // // //         </div>

// // // // // // // // //         {/* File Preview */}
// // // // // // // // //         {selectedFile && (
// // // // // // // // //           <div className="file-preview fade-in">
// // // // // // // // //             {previewUrl && <img src={previewUrl} alt="preview" className="preview-img" />}
// // // // // // // // //             <div className="file-info">
// // // // // // // // //               <span className="file-name">{selectedFile.name}</span>
// // // // // // // // //               <span className="file-size">
// // // // // // // // //                 ({(selectedFile.size / 1024).toFixed(1)} KB)
// // // // // // // // //               </span>
// // // // // // // // //             </div>
// // // // // // // // //             <button className="remove-file" onClick={removeFile}>
// // // // // // // // //               ❌
// // // // // // // // //             </button>
// // // // // // // // //           </div>
// // // // // // // // //         )}

// // // // // // // // //         {/* Chat Input */}
// // // // // // // // //         <div className="chat-input">
// // // // // // // // //           <button
// // // // // // // // //             className={`mic-btn ${isRecording ? "recording" : ""}`}
// // // // // // // // //             onClick={toggleRecording}
// // // // // // // // //           >
// // // // // // // // //             🎤
// // // // // // // // //           </button>
// // // // // // // // //           <input
// // // // // // // // //             type="text"
// // // // // // // // //             placeholder="Type or speak..."
// // // // // // // // //             value={input}
// // // // // // // // //             onChange={(e) => setInput(e.target.value)}
// // // // // // // // //             onKeyDown={(e) => e.key === "Enter" && handleSend()}
// // // // // // // // //           />
// // // // // // // // //           <input type="file" id="file" style={{ display: "none" }} onChange={handleFileSelect} />
// // // // // // // // //           <label htmlFor="file" className="file-upload-btn">
// // // // // // // // //             📎
// // // // // // // // //           </label>
// // // // // // // // //           <button onClick={handleSend} disabled={loading}>
// // // // // // // // //             ➤
// // // // // // // // //           </button>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default Dashboard
// // // // // // // // // ;

// // // // // // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // // // // // import "./Dashboard.css"; // We will replace this file's content
// // // // // // // // // import TextareaAutosize from "react-textarea-autosize";
// // // // // // // // // import ReactMarkdown from "react-markdown";
// // // // // // // // // import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

// // // // // // // // // // ✅ CORRECT (Default Import)
// // // // // // // // // import tomorrow from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow";
// // // // // // // // // // Markdown renderer component to handle code blocks
// // // // // // // // // const MarkdownRenderer = ({ text }) => {
// // // // // // // // //   return (
// // // // // // // // //     <ReactMarkdown
// // // // // // // // //       children={text}
// // // // // // // // //       components={{
// // // // // // // // //         code({ node, inline, className, children, ...props }) {
// // // // // // // // //           const match = /language-(\w+)/.exec(className || "");
// // // // // // // // //           return !inline && match ? (
// // // // // // // // //             <SyntaxHighlighter
// // // // // // // // //               children={String(children).replace(/\n$/, "")}
// // // // // // // // //               style={tomorrow} // Using 'tomorrow' dark theme for code
// // // // // // // // //               language={match[1]}
// // // // // // // // //               PreTag="div"
// // // // // // // // //               {...props}
// // // // // // // // //             />
// // // // // // // // //           ) : (
// // // // // // // // //             <code className={className} {...props}>
// // // // // // // // //               {children}
// // // // // // // // //             </code>
// // // // // // // // //           );
// // // // // // // // //         },
// // // // // // // // //       }}
// // // // // // // // //     />
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const Dashboard = () => {
// // // // // // // // //   const [user, setUser] = useState(null);
// // // // // // // // //   const [input, setInput] = useState("");
// // // // // // // // //   const [messages, setMessages] = useState([]);
// // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // //   const [selectedFile, setSelectedFile] = useState(null);
// // // // // // // // //   const [previewUrl, setPreviewUrl] = useState(null);
// // // // // // // // //   const [editingIndex, setEditingIndex] = useState(null);
// // // // // // // // //   const [isRecording, setIsRecording] = useState(false);
// // // // // // // // //   const messagesEndRef = useRef(null);
// // // // // // // // //   const recognitionRef = useRef(null);

// // // // // // // // //   // Load user
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const storedUser = localStorage.getItem("agentog_user");
// // // // // // // // //     if (storedUser) {
// // // // // // // // //       try {
// // // // // // // // //         setUser(JSON.parse(storedUser));
// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("Error parsing user:", err);
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   }, []);

// // // // // // // // //   // Scroll to bottom
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // // // // // // //   }, [messages]);

// // // // // // // // //   const handleFileSelect = (e) => {
// // // // // // // // //     const file = e.target.files[0];
// // // // // // // // //     if (file) {
// // // // // // // // //       setSelectedFile(file);
// // // // // // // // //       if (file.type.startsWith("image/")) {
// // // // // // // // //         setPreviewUrl(URL.createObjectURL(file));
// // // // // // // // //       } else {
// // // // // // // // //         setPreviewUrl(null);
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const removeFile = () => {
// // // // // // // // //     setSelectedFile(null);
// // // // // // // // //     setPreviewUrl(null);
// // // // // // // // //   };

// // // // // // // // //   const handleCopy = async (text) => {
// // // // // // // // //     await navigator.clipboard.writeText(text);
// // // // // // // // //     alert("Copied ✅");
// // // // // // // // //   };

// // // // // // // // //   const handleEdit = (index) => {
// // // // // // // // //     setEditingIndex(index);
// // // // // // // // //     setInput(messages[index].text);
// // // // // // // // //   };

// // // // // // // // //   const toggleRecording = () => {
// // // // // // // // //     if (!("webkitSpeechRecognition" in window)) {
// // // // // // // // //       alert("Speech recognition not supported in this browser");
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     if (isRecording) {
// // // // // // // // //       recognitionRef.current.stop();
// // // // // // // // //       setIsRecording(false);
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     const recognition = new window.webkitSpeechRecognition();
// // // // // // // // //     recognition.lang = "en-US";
// // // // // // // // //     recognition.interimResults = false;

// // // // // // // // //     recognition.onresult = (event) => {
// // // // // // // // //       const transcript = event.results[0][0].transcript;
// // // // // // // // //       setInput((prev) => (prev ? prev + " " + transcript : transcript));
// // // // // // // // //     };

// // // // // // // // //     recognition.onerror = (e) => console.error("Voice error:", e);
// // // // // // // // //     recognition.onend = () => setIsRecording(false);

// // // // // // // // //     recognitionRef.current = recognition;
// // // // // // // // //     recognition.start();
// // // // // // // // //     setIsRecording(true);
// // // // // // // // //   };

// // // // // // // // //   const handleSend = async () => {
// // // // // // // // //     if (!input.trim() && !selectedFile) return;

// // // // // // // // //     if (editingIndex !== null) {
// // // // // // // // //       const updated = [...messages];
// // // // // // // // //       updated[editingIndex].text = input;
// // // // // // // // //       setMessages(updated);
// // // // // // // // //       setEditingIndex(null);
// // // // // // // // //       setInput("");
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     const userMsg = { type: "user", text: input || selectedFile.name };
// // // // // // // // //     setMessages((prev) => [...prev, userMsg]);
// // // // // // // // //     setInput("");

// // // // // // // // //     if (!user?.webhookUrl) {
// // // // // // // // //       setMessages((prev) => [
// // // // // // // // //         ...prev,
// // // // // // // // //         { type: "bot", text: "❌ Webhook URL not found for this user." },
// // // // // // // // //       ]);
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     try {
// // // // // // // // //       setLoading(true);
// // // // // // // // //       let response;

// // // // // // // // //       if (selectedFile) {
// // // // // // // // //         const formData = new FormData();
// // // // // // // // //         formData.append("file", selectedFile);
// // // // // // // // //         formData.append("text", input || selectedFile.name);
// // // // // // // // //         formData.append("messageType", "document");
// // // // // // // // //         response = await fetch(user.webhookUrl, { method: "POST", body: formData });
// // // // // // // // //       } else {
// // // // // // // // //         response = await fetch(user.webhookUrl, {
// // // // // // // // //           method: "POST",
// // // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // // //           body: JSON.stringify({ text: input, messageType: "text" }),
// // // // // // // // //         });
// // // // // // // // //       }

// // // // // // // // //       const contentType = response.headers.get("content-type") || "";

// // // // // // // // //       if (contentType.includes("application/json")) {
// // // // // // // // //         const data = await response.json();
// // // // // // // // //         const replyText = data.output?.response || JSON.stringify(data, null, 2);
// // // // // // // // //         setMessages((p) => [...p, { type: "bot", text: replyText }]);
// // // // // // // // //       } else if (contentType.startsWith("image/")) {
// // // // // // // // //         const blob = await response.blob();
// // // // // // // // //         const url = URL.createObjectURL(blob);
// // // // // // // // //         setMessages((p) => [...p, { type: "bot", fileType: "image", fileUrl: url }]);
// // // // // // // // //       } else {
// // // // // // // // //         const text = await response.text();
// // // // // // // // //         setMessages((p) => [...p, { type: "bot", text }]);
// // // // // // // // //       }
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error(err);
// // // // // // // // //       setMessages((p) => [
// // // // // // // // //         ...p,
// // // // // // // // //         { type: "bot", text: "⚠️ Webhook error. Please check n8n setup." },
// // // // // // // // //       ]);
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //       removeFile();
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Handle Enter (Send) and Shift+Enter (New Line)
// // // // // // // // //   const handleKeyDown = (e) => {
// // // // // // // // //     if (e.key === "Enter" && !e.shiftKey) {
// // // // // // // // //       e.preventDefault();
// // // // // // // // //       handleSend();
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   if (!user) return <div className="loading-screen">Loading your dashboard...</div>;

// // // // // // // // //   return (
// // // // // // // // //     <div className="chat-container">
// // // // // // // // //       {/* Sidebar */}
// // // // // // // // //       <div className="sidebar">
// // // // // // // // //         <h2 className="sidebar-title">Agent OG</h2>
// // // // // // // // //         <button className="new-chat-btn">+ New Chat</button>
// // // // // // // // //         <ul className="chat-menu">
// // // // // // // // //           <li>💬 Last Conversation</li>
// // // // // // // // //           <li>📂 Uploaded Files</li>
// // // // // // // // //           <li>📥 Downloads</li>
// // // // // // // // //           <li>📅 Reminders</li>
// // // // // // // // //         </ul>
// // // // // // // // //         <div className="sidebar-footer">
// // // // // // // // //           <div className="user-email">{user?.email || "User"}</div>
// // // // // // // // //           <div className="settings">⚙️ Settings</div>
// // // // // // // // //         </div>
// // // // // // // // //       </div>

// // // // // // // // //       {/* Chat Main Area */}
// // // // // // // // //       <div className="chat-main">
// // // // // // // // //         <div className="chat-content-wrapper">
// // // // // // // // //           <div className="messages">
// // // // // // // // //             {messages.map((msg, i) => (
// // // // // // // // //               <div key={i} className={`message-wrapper ${msg.type}`}>
// // // // // // // // //                 <div className="message-icon">
// // // // // // // // //                   {msg.type === "user" ? "👤" : "🤖"}
// // // // // // // // //                 </div>
// // // // // // // // //                 <div className="message-bubble">
// // // // // // // // //                   {msg.text && <MarkdownRenderer text={msg.text} />}
// // // // // // // // //                   {msg.fileType === "image" && (
// // // // // // // // //                     <img src={msg.fileUrl} alt="response" className="response-image" />
// // // // // // // // //                   )}
// // // // // // // // //                   <div className="msg-actions">
// // // // // // // // //                     {msg.text && (
// // // // // // // // //                       <button onClick={() => handleCopy(msg.text)}>📋</button>
// // // // // // // // //                     )}
// // // // // // // // //                     {msg.type === "user" && (
// // // // // // // // //                       <button onClick={() => handleEdit(i)}>✏️</button>
// // // // // // // // //                     )}
// // // // // // // // //                   </div>
// // // // // // // // //                 </div>
// // // // // // // // //               </div>
// // // // // // // // //             ))}
// // // // // // // // //             {loading && (
// // // // // // // // //               <div className="message-wrapper bot">
// // // // // // // // //                 <div className="message-icon">🤖</div>
// // // // // // // // //                 <div className="message-bubble thinking">
// // // // // // // // //                   <div className="typing">
// // // // // // // // //                     <span></span>
// // // // // // // // //                     <span></span>
// // // // // // // // //                     <span></span>
// // // // // // // // //                   </div>
// // // // // // // // //                 </div>
// // // // // // // // //               </div>
// // // // // // // // //             )}
// // // // // // // // //             <div ref={messagesEndRef} />
// // // // // // // // //           </div>
// // // // // // // // //         </div>

// // // // // // // // //         {/* Input Bar Area */}
// // // // // // // // //         <div className="chat-input-area">
// // // // // // // // //           <div className="chat-input-wrapper">
// // // // // // // // //             {selectedFile && (
// // // // // // // // //               <div className="file-preview">
// // // // // // // // //                 {previewUrl && <img src={previewUrl} alt="preview" />}
// // // // // // // // //                 <div className="file-details">
// // // // // // // // //                   <span>{selectedFile.name}</span>
// // // // // // // // //                   <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
// // // // // // // // //                 </div>
// // // // // // // // //                 <button className="remove-file" onClick={removeFile}>
// // // // // // // // //                   ❌
// // // // // // // // //                 </button>
// // // // // // // // //               </div>
// // // // // // // // //             )}
// // // // // // // // //             <div className="chat-input-bar">
// // // // // // // // //               <input
// // // // // // // // //                 type="file"
// // // // // // // // //                 id="file"
// // // // // // // // //                 style={{ display: "none" }}
// // // // // // // // //                 onChange={handleFileSelect}
// // // // // // // // //               />
// // // // // // // // //               <label htmlFor="file" className="chat-btn attach-btn">
// // // // // // // // //                 📎
// // // // // // // // //               </label>
// // // // // // // // //               <button
// // // // // // // // //                 className={`chat-btn mic-btn ${isRecording ? "recording" : ""}`}
// // // // // // // // //                 onClick={toggleRecording}
// // // // // // // // //               >
// // // // // // // // //                 🎤
// // // // // // // // //               </button>
// // // // // // // // //               <TextareaAutosize
// // // // // // // // //                 minRows={1}
// // // // // // // // //                 maxRows={8}
// // // // // // // // //                 placeholder="Type your message..."
// // // // // // // // //                 value={input}
// // // // // // // // //                 onChange={(e) => setInput(e.target.value)}
// // // // // // // // //                 onKeyDown={handleKeyDown}
// // // // // // // // //               />
// // // // // // // // //               <button
// // // // // // // // //                 onClick={handleSend}
// // // // // // // // //                 disabled={loading || (!input.trim() && !selectedFile)}
// // // // // // // // //                 className="chat-btn send-btn"
// // // // // // // // //               >
// // // // // // // // //                 ➤
// // // // // // // // //               </button>
// // // // // // // // //             </div>
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default Dashboard;

// // // // // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // // // // import "./Dashboard.css";
// // // // // // // // import TextareaAutosize from "react-textarea-autosize";
// // // // // // // // import ReactMarkdown from "react-markdown";
// // // // // // // // import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// // // // // // // // import tomorrow from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow";

// // // // // // // // const MarkdownRenderer = ({ text }) => {
// // // // // // // //   return (
// // // // // // // //     <ReactMarkdown
// // // // // // // //       children={text}
// // // // // // // //       components={{
// // // // // // // //         code({ node, inline, className, children, ...props }) {
// // // // // // // //           const match = /language-(\w+)/.exec(className || "");
// // // // // // // //           return !inline && match ? (
// // // // // // // //             <SyntaxHighlighter
// // // // // // // //               style={tomorrow}
// // // // // // // //               language={match[1]}
// // // // // // // //               PreTag="div"
// // // // // // // //               children={String(children).replace(/\n$/, "")}
// // // // // // // //               {...props}
// // // // // // // //             />
// // // // // // // //           ) : (
// // // // // // // //             <code className={className} {...props}>
// // // // // // // //               {children}
// // // // // // // //             </code>
// // // // // // // //           );
// // // // // // // //         },
// // // // // // // //       }}
// // // // // // // //     />
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const Dashboard = () => {
// // // // // // // //   const [user, setUser] = useState(null);
// // // // // // // //   const [input, setInput] = useState("");
// // // // // // // //   const [messages, setMessages] = useState([]);
// // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // //   const [selectedFile, setSelectedFile] = useState(null);
// // // // // // // //   const [previewUrl, setPreviewUrl] = useState(null);
// // // // // // // //   const [isRecording, setIsRecording] = useState(false);
// // // // // // // //   const [editingIndex, setEditingIndex] = useState(null);
// // // // // // // //   const messagesEndRef = useRef(null);
// // // // // // // //   const recognitionRef = useRef(null);

// // // // // // // //   useEffect(() => {
// // // // // // // //     const storedUser = localStorage.getItem("agentog_user");
// // // // // // // //     if (storedUser) {
// // // // // // // //       try {
// // // // // // // //         setUser(JSON.parse(storedUser));
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error("Error parsing user:", err);
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //   }, []);

// // // // // // // //   useEffect(() => {
// // // // // // // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // // // // // //   }, [messages]);

// // // // // // // //   const handleFileSelect = (e) => {
// // // // // // // //     const file = e.target.files[0];
// // // // // // // //     if (file) {
// // // // // // // //       setSelectedFile(file);
// // // // // // // //       if (file.type.startsWith("image/")) {
// // // // // // // //         setPreviewUrl(URL.createObjectURL(file));
// // // // // // // //       } else {
// // // // // // // //         setPreviewUrl(null);
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const removeFile = () => {
// // // // // // // //     setSelectedFile(null);
// // // // // // // //     setPreviewUrl(null);
// // // // // // // //   };

// // // // // // // //   const handleCopy = async (text) => {
// // // // // // // //     await navigator.clipboard.writeText(text);
// // // // // // // //     alert("Copied ✅");
// // // // // // // //   };

// // // // // // // //   const handleEdit = (index) => {
// // // // // // // //     setEditingIndex(index);
// // // // // // // //     setInput(messages[index].text);
// // // // // // // //   };

// // // // // // // //   const toggleRecording = () => {
// // // // // // // //     if (!("webkitSpeechRecognition" in window)) {
// // // // // // // //       alert("Speech recognition not supported in this browser");
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     if (isRecording) {
// // // // // // // //       recognitionRef.current.stop();
// // // // // // // //       setIsRecording(false);
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     const recognition = new window.webkitSpeechRecognition();
// // // // // // // //     recognition.lang = "en-US";
// // // // // // // //     recognition.interimResults = false;

// // // // // // // //     recognition.onresult = (event) => {
// // // // // // // //       const transcript = event.results[0][0].transcript;
// // // // // // // //       setInput((prev) => (prev ? prev + " " + transcript : transcript));
// // // // // // // //     };

// // // // // // // //     recognition.onerror = (e) => console.error("Voice error:", e);
// // // // // // // //     recognition.onend = () => setIsRecording(false);

// // // // // // // //     recognitionRef.current = recognition;
// // // // // // // //     recognition.start();
// // // // // // // //     setIsRecording(true);
// // // // // // // //   };

// // // // // // // //   const handleSend = async () => {
// // // // // // // //     if (!input.trim() && !selectedFile) return;

// // // // // // // //     if (editingIndex !== null) {
// // // // // // // //       const updated = [...messages];
// // // // // // // //       updated[editingIndex].text = input;
// // // // // // // //       setMessages(updated);
// // // // // // // //       setEditingIndex(null);
// // // // // // // //       setInput("");
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     const userMsg = { type: "user", text: input || selectedFile.name };
// // // // // // // //     setMessages((prev) => [...prev, userMsg]);
// // // // // // // //     setInput("");

// // // // // // // //     if (!user?.webhookUrl) {
// // // // // // // //       setMessages((prev) => [
// // // // // // // //         ...prev,
// // // // // // // //         { type: "bot", text: "❌ Webhook URL not found for this user." },
// // // // // // // //       ]);
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       let response;

// // // // // // // //       if (selectedFile) {
// // // // // // // //         const formData = new FormData();
// // // // // // // //         formData.append("file", selectedFile);
// // // // // // // //         formData.append("text", input || selectedFile.name);
// // // // // // // //         response = await fetch(user.webhookUrl, { method: "POST", body: formData });
// // // // // // // //       } else {
// // // // // // // //         response = await fetch(user.webhookUrl, {
// // // // // // // //           method: "POST",
// // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // //           body: JSON.stringify({ text: input, messageType: "text" }),
// // // // // // // //         });
// // // // // // // //       }

// // // // // // // //       const contentType = response.headers.get("content-type") || "";

// // // // // // // //       if (contentType.includes("application/json")) {
// // // // // // // //         const data = await response.json();
// // // // // // // //         const replyText = data.output?.response || JSON.stringify(data, null, 2);
// // // // // // // //         setMessages((p) => [...p, { type: "bot", text: replyText }]);
// // // // // // // //       } else {
// // // // // // // //         const text = await response.text();
// // // // // // // //         setMessages((p) => [...p, { type: "bot", text }]);
// // // // // // // //       }
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error(err);
// // // // // // // //       setMessages((p) => [
// // // // // // // //         ...p,
// // // // // // // //         { type: "bot", text: "⚠️ Webhook error. Please check n8n setup." },
// // // // // // // //       ]);
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //       removeFile();
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleKeyDown = (e) => {
// // // // // // // //     if (e.key === "Enter" && !e.shiftKey) {
// // // // // // // //       e.preventDefault();
// // // // // // // //       handleSend();
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   if (!user) return <div className="loading-screen">Loading your dashboard...</div>;

// // // // // // // //   return (
// // // // // // // //     <div className="chatgpt-container">
// // // // // // // //       <div className="chatgpt-messages">
// // // // // // // //         {messages.map((msg, i) => (
// // // // // // // //           <div key={i} className={`chatgpt-message ${msg.type}`}>
// // // // // // // //             <div className="avatar">{msg.type === "user" ? "🧑‍💻" : "🤖"}</div>
// // // // // // // //             <div className="bubble">
// // // // // // // //               <MarkdownRenderer text={msg.text} />
// // // // // // // //               {msg.text && (
// // // // // // // //                 <div className="msg-actions">
// // // // // // // //                   <button onClick={() => handleCopy(msg.text)}>📋</button>
// // // // // // // //                   {msg.type === "user" && <button onClick={() => handleEdit(i)}>✏️</button>}
// // // // // // // //                 </div>
// // // // // // // //               )}
// // // // // // // //             </div>
// // // // // // // //           </div>
// // // // // // // //         ))}

// // // // // // // //         {loading && (
// // // // // // // //           <div className="chatgpt-message bot thinking">
// // // // // // // //             <div className="avatar">🤖</div>
// // // // // // // //             <div className="bubble">
// // // // // // // //               <div className="typing">
// // // // // // // //                 <span></span><span></span><span></span>
// // // // // // // //               </div>
// // // // // // // //             </div>
// // // // // // // //           </div>
// // // // // // // //         )}
// // // // // // // //         <div ref={messagesEndRef} />
// // // // // // // //       </div>

// // // // // // // //       <div className="chatgpt-input-area">
// // // // // // // //         {selectedFile && (
// // // // // // // //           <div className="file-preview">
// // // // // // // //             {previewUrl && <img src={previewUrl} alt="preview" />}
// // // // // // // //             <span>{selectedFile.name}</span>
// // // // // // // //             <button onClick={removeFile}>❌</button>
// // // // // // // //           </div>
// // // // // // // //         )}

// // // // // // // //         <div className="chatgpt-input">
// // // // // // // //           <label htmlFor="file" className="attach">📎</label>
// // // // // // // //           <input type="file" id="file" style={{ display: "none" }} onChange={handleFileSelect} />
// // // // // // // //           <button
// // // // // // // //             className={`mic ${isRecording ? "recording" : ""}`}
// // // // // // // //             onClick={toggleRecording}
// // // // // // // //           >
// // // // // // // //             🎤
// // // // // // // //           </button>
// // // // // // // //           <TextareaAutosize
// // // // // // // //             minRows={1}
// // // // // // // //             maxRows={6}
// // // // // // // //             placeholder="Message Agent OG..."
// // // // // // // //             value={input}
// // // // // // // //             onChange={(e) => setInput(e.target.value)}
// // // // // // // //             onKeyDown={handleKeyDown}
// // // // // // // //           />
// // // // // // // //           <button className="send" onClick={handleSend} disabled={!input && !selectedFile}>
// // // // // // // //             ➤
// // // // // // // //           </button>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default Dashboard;

// // // // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // // // import "./Dashboard.css";
// // // // // // // import TextareaAutosize from "react-textarea-autosize";
// // // // // // // import ReactMarkdown from "react-markdown";
// // // // // // // import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// // // // // // // import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // ✅ Correct import

// // // // // // // // Markdown renderer
// // // // // // // const MarkdownRenderer = ({ text }) => {
// // // // // // //   return (
// // // // // // //     <ReactMarkdown
// // // // // // //       children={text}
// // // // // // //       components={{
// // // // // // //         code({ node, inline, className, children, ...props }) {
// // // // // // //           const match = /language-(\w+)/.exec(className || "");
// // // // // // //           return !inline && match ? (
// // // // // // //             <SyntaxHighlighter
// // // // // // //               style={oneDark}
// // // // // // //               language={match[1]}
// // // // // // //               PreTag="div"
// // // // // // //               {...props}
// // // // // // //             >
// // // // // // //               {String(children).replace(/\n$/, "")}
// // // // // // //             </SyntaxHighlighter>
// // // // // // //           ) : (
// // // // // // //             <code className={className} {...props}>
// // // // // // //               {children}
// // // // // // //             </code>
// // // // // // //           );
// // // // // // //         },
// // // // // // //       }}
// // // // // // //     />
// // // // // // //   );
// // // // // // // };

// // // // // // // const Dashboard = () => {
// // // // // // //   const [user, setUser] = useState(null);
// // // // // // //   const [input, setInput] = useState("");
// // // // // // //   const [messages, setMessages] = useState([]);
// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const [selectedFile, setSelectedFile] = useState(null);
// // // // // // //   const [previewUrl, setPreviewUrl] = useState(null);
// // // // // // //   const [editingIndex, setEditingIndex] = useState(null);
// // // // // // //   const [isRecording, setIsRecording] = useState(false);
// // // // // // //   const messagesEndRef = useRef(null);
// // // // // // //   const recognitionRef = useRef(null);

// // // // // // //   // Load user
// // // // // // //   useEffect(() => {
// // // // // // //     const storedUser = localStorage.getItem("agentog_user");
// // // // // // //     if (storedUser) {
// // // // // // //       try {
// // // // // // //         setUser(JSON.parse(storedUser));
// // // // // // //       } catch (err) {
// // // // // // //         console.error("Error parsing user:", err);
// // // // // // //       }
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   // Scroll to bottom
// // // // // // //   useEffect(() => {
// // // // // // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // // // // //   }, [messages]);

// // // // // // //   // File selection
// // // // // // //   const handleFileSelect = (e) => {
// // // // // // //     const file = e.target.files[0];
// // // // // // //     if (file) {
// // // // // // //       setSelectedFile(file);
// // // // // // //       if (file.type.startsWith("image/")) {
// // // // // // //         setPreviewUrl(URL.createObjectURL(file));
// // // // // // //       } else {
// // // // // // //         setPreviewUrl(null);
// // // // // // //       }
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const removeFile = () => {
// // // // // // //     setSelectedFile(null);
// // // // // // //     setPreviewUrl(null);
// // // // // // //   };

// // // // // // //   const handleCopy = async (text) => {
// // // // // // //     await navigator.clipboard.writeText(text);
// // // // // // //     alert("Copied ✅");
// // // // // // //   };

// // // // // // //   const handleEdit = (index) => {
// // // // // // //     setEditingIndex(index);
// // // // // // //     setInput(messages[index].text);
// // // // // // //   };

// // // // // // //   // Speech recognition
// // // // // // //   const toggleRecording = () => {
// // // // // // //     if (!("webkitSpeechRecognition" in window)) {
// // // // // // //       alert("Speech recognition not supported");
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     if (isRecording) {
// // // // // // //       recognitionRef.current.stop();
// // // // // // //       setIsRecording(false);
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const recognition = new window.webkitSpeechRecognition();
// // // // // // //     recognition.lang = "en-US";
// // // // // // //     recognition.interimResults = false;

// // // // // // //     recognition.onresult = (event) => {
// // // // // // //       const transcript = event.results[0][0].transcript;
// // // // // // //       setInput((prev) => (prev ? prev + " " + transcript : transcript));
// // // // // // //     };

// // // // // // //     recognition.onerror = (e) => console.error("Voice error:", e);
// // // // // // //     recognition.onend = () => setIsRecording(false);

// // // // // // //     recognitionRef.current = recognition;
// // // // // // //     recognition.start();
// // // // // // //     setIsRecording(true);
// // // // // // //   };

// // // // // // //   // Send message
// // // // // // //   const handleSend = async () => {
// // // // // // //     if (!input.trim() && !selectedFile) return;

// // // // // // //     if (editingIndex !== null) {
// // // // // // //       const updated = [...messages];
// // // // // // //       updated[editingIndex].text = input;
// // // // // // //       setMessages(updated);
// // // // // // //       setEditingIndex(null);
// // // // // // //       setInput("");
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const userMsg = { type: "user", text: input || selectedFile.name };
// // // // // // //     setMessages((prev) => [...prev, userMsg]);
// // // // // // //     setInput("");

// // // // // // //     if (!user?.webhookUrl) {
// // // // // // //       setMessages((prev) => [
// // // // // // //         ...prev,
// // // // // // //         { type: "bot", text: "❌ Webhook URL not found for this user." },
// // // // // // //       ]);
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       let response;

// // // // // // //       if (selectedFile) {
// // // // // // //         const formData = new FormData();
// // // // // // //         formData.append("file", selectedFile);
// // // // // // //         formData.append("text", input || selectedFile.name);
// // // // // // //         formData.append("messageType", "document");
// // // // // // //         response = await fetch(user.webhookUrl, { method: "POST", body: formData });
// // // // // // //       } else {
// // // // // // //         response = await fetch(user.webhookUrl, {
// // // // // // //           method: "POST",
// // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // //           body: JSON.stringify({ text: input, messageType: "text" }),
// // // // // // //         });
// // // // // // //       }

// // // // // // //       const contentType = response.headers.get("content-type") || "";

// // // // // // //       if (contentType.includes("application/json")) {
// // // // // // //         const data = await response.json();
// // // // // // //         const replyText = data.output?.response || JSON.stringify(data, null, 2);
// // // // // // //         setMessages((p) => [...p, { type: "bot", text: replyText }]);
// // // // // // //       } else if (contentType.startsWith("image/")) {
// // // // // // //         const blob = await response.blob();
// // // // // // //         const url = URL.createObjectURL(blob);
// // // // // // //         setMessages((p) => [...p, { type: "bot", fileType: "image", fileUrl: url }]);
// // // // // // //       } else {
// // // // // // //         const text = await response.text();
// // // // // // //         setMessages((p) => [...p, { type: "bot", text }]);
// // // // // // //       }
// // // // // // //     } catch (err) {
// // // // // // //       console.error(err);
// // // // // // //       setMessages((p) => [
// // // // // // //         ...p,
// // // // // // //         { type: "bot", text: "⚠️ Webhook error. Please check n8n setup." },
// // // // // // //       ]);
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //       removeFile();
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleKeyDown = (e) => {
// // // // // // //     if (e.key === "Enter" && !e.shiftKey) {
// // // // // // //       e.preventDefault();
// // // // // // //       handleSend();
// // // // // // //     }
// // // // // // //   };

// // // // // // //   if (!user) return <div className="loading-screen">Loading your dashboard...</div>;

// // // // // // //   return (
// // // // // // //     <div className="chat-container">
// // // // // // //       {/* Sidebar */}
// // // // // // //       <div className="sidebar">
// // // // // // //         <h2 className="sidebar-title">Agent OG</h2>
// // // // // // //         <button className="new-chat-btn">+ New Chat</button>
// // // // // // //         <ul className="chat-menu">
// // // // // // //           <li>💬 Last Conversation</li>
// // // // // // //           <li>📂 Uploaded Files</li>
// // // // // // //           <li>📥 Downloads</li>
// // // // // // //           <li>📅 Reminders</li>
// // // // // // //         </ul>
// // // // // // //         <div className="sidebar-footer">
// // // // // // //           <div className="user-email">{user?.email || "User"}</div>
// // // // // // //           <div className="settings">⚙️ Settings</div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Chat Main */}
// // // // // // //       <div className="chat-main">
// // // // // // //         <div className="messages">
// // // // // // //           {messages.map((msg, i) => (
// // // // // // //             <div key={i} className={`message-wrapper ${msg.type}`}>
// // // // // // //               <div className="message-icon">
// // // // // // //                 {msg.type === "user" ? "🧑" : "🤖"}
// // // // // // //               </div>
// // // // // // //               <div className="message-bubble">
// // // // // // //                 {msg.text && <MarkdownRenderer text={msg.text} />}
// // // // // // //                 {msg.fileType === "image" && (
// // // // // // //                   <img src={msg.fileUrl} alt="response" className="response-image" />
// // // // // // //                 )}
// // // // // // //                 <div className="msg-actions">
// // // // // // //                   {msg.text && <button onClick={() => handleCopy(msg.text)}>📋</button>}
// // // // // // //                   {msg.type === "user" && <button onClick={() => handleEdit(i)}>✏️</button>}
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           ))}

// // // // // // //           {loading && (
// // // // // // //             <div className="message-wrapper bot">
// // // // // // //               <div className="message-icon">🤖</div>
// // // // // // //               <div className="message-bubble thinking">
// // // // // // //                 <div className="typing">
// // // // // // //                   <span></span>
// // // // // // //                   <span></span>
// // // // // // //                   <span></span>
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //           <div ref={messagesEndRef} />
// // // // // // //         </div>

// // // // // // //         {/* Input Bar */}
// // // // // // //         <div className="chat-input-area">
// // // // // // //           {selectedFile && (
// // // // // // //             <div className="file-preview">
// // // // // // //               {previewUrl && <img src={previewUrl} alt="preview" />}
// // // // // // //               <div className="file-details">
// // // // // // //                 <span>{selectedFile.name}</span>
// // // // // // //                 <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
// // // // // // //               </div>
// // // // // // //               <button className="remove-file" onClick={removeFile}>❌</button>
// // // // // // //             </div>
// // // // // // //           )}

// // // // // // //           <div className="chat-input-bar">
// // // // // // //             <input type="file" id="file" style={{ display: "none" }} onChange={handleFileSelect} />
// // // // // // //             <label htmlFor="file" className="chat-btn attach-btn">📎</label>
// // // // // // //             <button className={`chat-btn mic-btn ${isRecording ? "recording" : ""}`} onClick={toggleRecording}>
// // // // // // //               🎤
// // // // // // //             </button>
// // // // // // //             <TextareaAutosize
// // // // // // //               minRows={1}
// // // // // // //               maxRows={8}
// // // // // // //               placeholder="Type your message..."
// // // // // // //               value={input}
// // // // // // //               onChange={(e) => setInput(e.target.value)}
// // // // // // //               onKeyDown={handleKeyDown}
// // // // // // //             />
// // // // // // //             <button onClick={handleSend} disabled={loading || (!input.trim() && !selectedFile)} className="chat-btn send-btn">
// // // // // // //               ➤
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default Dashboard;

// // // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // // import "./Dashboard.css";
// // // // // // import ExpandingTextArea from "react-expanding-textarea";

// // // // // // import ReactMarkdown from "react-markdown";
// // // // // // import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// // // // // // import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// // // // // // const Dashboard = () => {
// // // // // //   const [input, setInput] = useState("");
// // // // // //   const [messages, setMessages] = useState([]);
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const messagesEndRef = useRef(null);

// // // // // //   useEffect(() => {
// // // // // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // // // //   }, [messages]);

// // // // // //   const handleSend = async () => {
// // // // // //     if (!input.trim()) return;

// // // // // //     const newMessage = { role: "user", text: input };
// // // // // //     setMessages((prev) => [...prev, newMessage]);
// // // // // //     setInput("");
// // // // // //     setLoading(true);

// // // // // //     try {
// // // // // //       // Simulated AI response
// // // // // //       const response = {
// // // // // //         role: "assistant",
// // // // // //         text: `You said: **${input}**\n\n\`\`\`js\nconsole.log("Example code block");\n\`\`\``,
// // // // // //       };

// // // // // //       // Simulate delay
// // // // // //       setTimeout(() => {
// // // // // //         setMessages((prev) => [...prev, response]);
// // // // // //         setLoading(false);
// // // // // //       }, 1000);
// // // // // //     } catch (error) {
// // // // // //       console.error(error);
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleKeyPress = (e) => {
// // // // // //     if (e.key === "Enter" && !e.shiftKey) {
// // // // // //       e.preventDefault();
// // // // // //       handleSend();
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="dashboard-container">
// // // // // //       <div className="chat-window">
// // // // // //         <div className="messages">
// // // // // //           {messages.map((msg, idx) => (
// // // // // //             <div
// // // // // //               key={idx}
// // // // // //               className={`message ${msg.role === "user" ? "user" : "assistant"}`}
// // // // // //             >
// // // // // //               <ReactMarkdown
// // // // // //                 children={msg.text}
// // // // // //                 components={{
// // // // // //                   code({ inline, className, children, ...props }) {
// // // // // //                     const match = /language-(\w+)/.exec(className || "");
// // // // // //                     return !inline && match ? (
// // // // // //                       <SyntaxHighlighter
// // // // // //                         style={oneDark}
// // // // // //                         language={match[1]}
// // // // // //                         PreTag="div"
// // // // // //                         {...props}
// // // // // //                       >
// // // // // //                         {String(children).replace(/\n$/, "")}
// // // // // //                       </SyntaxHighlighter>
// // // // // //                     ) : (
// // // // // //                       <code className={className} {...props}>
// // // // // //                         {children}
// // // // // //                       </code>
// // // // // //                     );
// // // // // //                   },
// // // // // //                 }}
// // // // // //               />
// // // // // //             </div>
// // // // // //           ))}
// // // // // //           {loading && <div className="loading">Thinking...</div>}
// // // // // //           <div ref={messagesEndRef} />
// // // // // //         </div>

// // // // // //         <div className="input-area">
// // // // // //           <TextareaAutosize
// // // // // //             minRows={1}
// // // // // //             maxRows={6}
// // // // // //             value={input}
// // // // // //             onChange={(e) => setInput(e.target.value)}
// // // // // //             onKeyDown={handleKeyPress}
// // // // // //             placeholder="Type a message..."
// // // // // //             className="input-box"
// // // // // //           />
// // // // // //           <button onClick={handleSend} className="send-btn">
// // // // // //             Send
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default Dashboard;

// // // // // import React, { useEffect, useState, useRef } from "react";
// // // // // import "./Dashboard.css";
// // // // // import ReactMarkdown from "react-markdown";
// // // // // import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// // // // // import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// // // // // // ✅ Markdown renderer (with syntax highlighting)
// // // // // const MarkdownRenderer = ({ text }) => (
// // // // //   <ReactMarkdown
// // // // //     children={text}
// // // // //     components={{
// // // // //       code({ inline, className, children, ...props }) {
// // // // //         const match = /language-(\w+)/.exec(className || "");
// // // // //         return !inline && match ? (
// // // // //           <SyntaxHighlighter
// // // // //             style={oneDark}
// // // // //             language={match[1]}
// // // // //             PreTag="div"
// // // // //             {...props}
// // // // //           >
// // // // //             {String(children).replace(/\n$/, "")}
// // // // //           </SyntaxHighlighter>
// // // // //         ) : (
// // // // //           <code className={className} {...props}>
// // // // //             {children}
// // // // //           </code>
// // // // //         );
// // // // //       },
// // // // //     }}
// // // // //   />
// // // // // );

// // // // // // ✅ Custom Auto-resizing textarea (React 19 compatible)
// // // // // const AutoTextarea = ({ value, onChange, onKeyDown, placeholder }) => {
// // // // //   const ref = useRef();

// // // // //   useEffect(() => {
// // // // //     if (ref.current) {
// // // // //       ref.current.style.height = "auto";
// // // // //       ref.current.style.height = ref.current.scrollHeight + "px";
// // // // //     }
// // // // //   }, [value]);

// // // // //   return (
// // // // //     <textarea
// // // // //       ref={ref}
// // // // //       rows={1}
// // // // //       value={value}
// // // // //       onChange={onChange}
// // // // //       onKeyDown={onKeyDown}
// // // // //       placeholder={placeholder}
// // // // //       className="auto-textarea"
// // // // //     />
// // // // //   );
// // // // // };

// // // // // const Dashboard = () => {
// // // // //   const [user, setUser] = useState(null);
// // // // //   const [input, setInput] = useState("");
// // // // //   const [messages, setMessages] = useState([]);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [selectedFile, setSelectedFile] = useState(null);
// // // // //   const [previewUrl, setPreviewUrl] = useState(null);
// // // // //   const [isRecording, setIsRecording] = useState(false);
// // // // //   const messagesEndRef = useRef(null);
// // // // //   const recognitionRef = useRef(null);

// // // // //   // ✅ Load user
// // // // //   useEffect(() => {
// // // // //     const storedUser = localStorage.getItem("agentog_user");
// // // // //     if (storedUser) {
// // // // //       try {
// // // // //         setUser(JSON.parse(storedUser));
// // // // //       } catch (err) {
// // // // //         console.error("Error parsing user:", err);
// // // // //       }
// // // // //     }
// // // // //   }, []);

// // // // //   // ✅ Auto scroll to bottom
// // // // //   useEffect(() => {
// // // // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // // //   }, [messages]);

// // // // //   const handleFileSelect = (e) => {
// // // // //     const file = e.target.files[0];
// // // // //     if (file) {
// // // // //       setSelectedFile(file);
// // // // //       if (file.type.startsWith("image/")) {
// // // // //         setPreviewUrl(URL.createObjectURL(file));
// // // // //       } else {
// // // // //         setPreviewUrl(null);
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   const removeFile = () => {
// // // // //     setSelectedFile(null);
// // // // //     setPreviewUrl(null);
// // // // //   };

// // // // //   const handleSend = async () => {
// // // // //     if (!input.trim() && !selectedFile) return;

// // // // //     const userMsg = { type: "user", text: input || selectedFile?.name };
// // // // //     setMessages((prev) => [...prev, userMsg]);
// // // // //     setInput("");

// // // // //     if (!user?.webhookUrl) {
// // // // //       setMessages((prev) => [
// // // // //         ...prev,
// // // // //         { type: "bot", text: "❌ Webhook URL not found for this user." },
// // // // //       ]);
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       setLoading(true);
// // // // //       let response;

// // // // //       if (selectedFile) {
// // // // //         const formData = new FormData();
// // // // //         formData.append("file", selectedFile);
// // // // //         formData.append("text", input || selectedFile.name);
// // // // //         formData.append("messageType", "document");
// // // // //         response = await fetch(user.webhookUrl, { method: "POST", body: formData });
// // // // //       } else {
// // // // //         response = await fetch(user.webhookUrl, {
// // // // //           method: "POST",
// // // // //           headers: { "Content-Type": "application/json" },
// // // // //           body: JSON.stringify({ text: input, messageType: "text" }),
// // // // //         });
// // // // //       }

// // // // //       const contentType = response.headers.get("content-type") || "";
// // // // //       if (contentType.includes("application/json")) {
// // // // //         const data = await response.json();
// // // // //         const replyText = data.output?.response || JSON.stringify(data, null, 2);
// // // // //         setMessages((p) => [...p, { type: "bot", text: replyText }]);
// // // // //       } else if (contentType.startsWith("image/")) {
// // // // //         const blob = await response.blob();
// // // // //         const url = URL.createObjectURL(blob);
// // // // //         setMessages((p) => [...p, { type: "bot", fileType: "image", fileUrl: url }]);
// // // // //       } else {
// // // // //         const text = await response.text();
// // // // //         setMessages((p) => [...p, { type: "bot", text }]);
// // // // //       }
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       setMessages((p) => [
// // // // //         ...p,
// // // // //         { type: "bot", text: "⚠️ Webhook error. Please check n8n setup." },
// // // // //       ]);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //       removeFile();
// // // // //     }
// // // // //   };

// // // // //   const handleKeyDown = (e) => {
// // // // //     if (e.key === "Enter" && !e.shiftKey) {
// // // // //       e.preventDefault();
// // // // //       handleSend();
// // // // //     }
// // // // //   };

// // // // //   if (!user) return <div className="loading-screen">Loading your dashboard...</div>;

// // // // //   return (
// // // // //     <div className="chat-container">
// // // // //       {/* Sidebar */}
// // // // //       <div className="sidebar">
// // // // //         <h2 className="sidebar-title">Agent OG</h2>
// // // // //         <button className="new-chat-btn">+ New Chat</button>
// // // // //         <ul className="chat-menu">
// // // // //           <li>💬 Last Conversation</li>
// // // // //           <li>📂 Uploaded Files</li>
// // // // //           <li>📥 Downloads</li>
// // // // //           <li>📅 Reminders</li>
// // // // //         </ul>
// // // // //         <div className="sidebar-footer">
// // // // //           <div className="user-email">{user?.email || "User"}</div>
// // // // //           <div className="settings">⚙️ Settings</div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Chat Area */}
// // // // //       <div className="chat-main">
// // // // //         <div className="messages">
// // // // //           {messages.map((msg, i) => (
// // // // //             <div key={i} className={`message ${msg.type}`}>
// // // // //               {msg.type === "bot" && <div className="avatar">🤖</div>}
// // // // //               {msg.type === "user" && <div className="avatar user">👤</div>}
// // // // //               <div className="bubble">
// // // // //                 {msg.text && <MarkdownRenderer text={msg.text} />}
// // // // //                 {msg.fileType === "image" && (
// // // // //                   <img src={msg.fileUrl} alt="response" className="response-image" />
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>
// // // // //           ))}

// // // // //           {loading && (
// // // // //             <div className="message bot">
// // // // //               <div className="avatar">🤖</div>
// // // // //               <div className="bubble thinking">
// // // // //                 <div className="typing">
// // // // //                   <span></span>
// // // // //                   <span></span>
// // // // //                   <span></span>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}
// // // // //           <div ref={messagesEndRef} />
// // // // //         </div>

// // // // //         {/* Input */}
// // // // //         <div className="chat-input-area">
// // // // //           {selectedFile && (
// // // // //             <div className="file-preview">
// // // // //               {previewUrl && <img src={previewUrl} alt="preview" />}
// // // // //               <span>{selectedFile.name}</span>
// // // // //               <button onClick={removeFile}>❌</button>
// // // // //             </div>
// // // // //           )}

// // // // //           <div className="input-row">
// // // // //             <input
// // // // //               type="file"
// // // // //               id="file"
// // // // //               style={{ display: "none" }}
// // // // //               onChange={handleFileSelect}
// // // // //             />
// // // // //             <label htmlFor="file" className="chat-btn">📎</label>

// // // // //             <AutoTextarea
// // // // //               value={input}
// // // // //               onChange={(e) => setInput(e.target.value)}
// // // // //               onKeyDown={handleKeyDown}
// // // // //               placeholder="Type your message..."
// // // // //             />

// // // // //             <button
// // // // //               onClick={handleSend}
// // // // //               disabled={loading || (!input.trim() && !selectedFile)}
// // // // //               className="chat-btn send-btn"
// // // // //             >
// // // // //               ➤
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Dashboard;

// // // // import React, { useState, useEffect, useRef } from "react";
// // // // import "./Dashboard.css";

// // // // // Custom auto-resizing textarea (React 19 compatible)
// // // // const AutoTextarea = ({ value, onChange, onKeyDown, placeholder }) => {
// // // //   const ref = useRef();

// // // //   useEffect(() => {
// // // //     if (ref.current) {
// // // //       ref.current.style.height = "auto";
// // // //       ref.current.style.height = ref.current.scrollHeight + "px";
// // // //     }
// // // //   }, [value]);

// // // //   return (
// // // //     <textarea
// // // //       ref={ref}
// // // //       rows={1}
// // // //       style={{
// // // //         resize: "none",
// // // //         overflow: "hidden",
// // // //         width: "100%",
// // // //         fontSize: "16px",
// // // //         lineHeight: "1.5",
// // // //         border: "none",
// // // //         outline: "none",
// // // //         background: "transparent",
// // // //         color: "#fff",
// // // //       }}
// // // //       value={value}
// // // //       onChange={onChange}
// // // //       onKeyDown={onKeyDown}
// // // //       placeholder={placeholder}
// // // //     />
// // // //   );
// // // // };

// // // // const Dashboard = () => {
// // // //   const [messages, setMessages] = useState([]);
// // // //   const [input, setInput] = useState("");
// // // //   const [listening, setListening] = useState(false);
// // // //   const recognitionRef = useRef(null);
// // // //   const chatEndRef = useRef(null);

// // // //   useEffect(() => {
// // // //     if ("webkitSpeechRecognition" in window) {
// // // //       const recognition = new window.webkitSpeechRecognition();
// // // //       recognition.continuous = false;
// // // //       recognition.interimResults = false;
// // // //       recognition.lang = "en-US";

// // // //       recognition.onstart = () => setListening(true);
// // // //       recognition.onend = () => setListening(false);
// // // //       recognition.onresult = (event) => {
// // // //         const transcript = event.results[0][0].transcript;
// // // //         setInput((prev) => (prev ? prev + " " + transcript : transcript));
// // // //       };

// // // //       recognitionRef.current = recognition;
// // // //     }
// // // //   }, []);

// // // //   const handleSend = () => {
// // // //     if (!input.trim()) return;
// // // //     const newMsg = { role: "user", content: input };
// // // //     setMessages((prev) => [...prev, newMsg]);

// // // //     // Fake bot reply (replace with your API/webhook)
// // // //     setTimeout(() => {
// // // //       setMessages((prev) => [
// // // //         ...prev,
// // // //         { role: "assistant", content: `Echo: ${input}` },
// // // //       ]);
// // // //     }, 800);

// // // //     setInput("");
// // // //   };

// // // //   const handleKeyDown = (e) => {
// // // //     if (e.key === "Enter" && !e.shiftKey) {
// // // //       e.preventDefault();
// // // //       handleSend();
// // // //     }
// // // //   };

// // // //   const startListening = () => {
// // // //     if (recognitionRef.current && !listening) {
// // // //       recognitionRef.current.start();
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // //   }, [messages]);

// // // //   return (
// // // //     <div className="dashboard-container">
// // // //       {/* Sidebar */}
// // // //       <div className="sidebar">
// // // //         <div className="sidebar-top">
// // // //           <h2 className="logo">🤖 AI Chat</h2>
// // // //           <button
// // // //             className="sidebar-btn"
// // // //             onClick={() => setMessages([])}
// // // //             title="Start a new chat"
// // // //           >
// // // //             ➕ New Chat
// // // //           </button>
// // // //         </div>
// // // //         <div className="sidebar-bottom">
// // // //           <button className="sidebar-btn">⚙️ Settings</button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Chat Section */}
// // // //       <div className="chat-section">
// // // //         <div className="chat-messages">
// // // //           {messages.map((msg, i) => (
// // // //             <div
// // // //               key={i}
// // // //               className={`chat-bubble ${
// // // //                 msg.role === "user" ? "user-msg" : "bot-msg"
// // // //               }`}
// // // //             >
// // // //               {msg.content}
// // // //             </div>
// // // //           ))}
// // // //           <div ref={chatEndRef} />
// // // //         </div>

// // // //         {/* Input Area */}
// // // //         <div className="chat-input">
// // // //           <AutoTextarea
// // // //             value={input}
// // // //             onChange={(e) => setInput(e.target.value)}
// // // //             onKeyDown={handleKeyDown}
// // // //             placeholder="Type or speak your message..."
// // // //           />
// // // //           <div className="chat-controls">
// // // //             <button
// // // //               className={`mic-btn ${listening ? "listening" : ""}`}
// // // //               onClick={startListening}
// // // //               title="Speak"
// // // //             >
// // // //               🎤
// // // //             </button>
// // // //             <button className="send-btn" onClick={handleSend}>
// // // //               ➤
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Dashboard;

// // // import React, { useState, useEffect, useRef } from "react";
// // // import "./Dashboard.css";

// // // // ✅ Custom auto-resizing textarea (React 19 compatible)
// // // const AutoTextarea = ({ value, onChange, onKeyDown, placeholder }) => {
// // //   const ref = useRef();
// // //   useEffect(() => {
// // //     if (ref.current) {
// // //       ref.current.style.height = "auto";
// // //       ref.current.style.height = ref.current.scrollHeight + "px";
// // //     }
// // //   }, [value]);

// // //   return (
// // //     <textarea
// // //       ref={ref}
// // //       rows={1}
// // //       style={{
// // //         resize: "none",
// // //         overflow: "hidden",
// // //         width: "100%",
// // //         fontSize: "16px",
// // //         lineHeight: "1.5",
// // //         border: "none",
// // //         outline: "none",
// // //         background: "transparent",
// // //         color: "#fff",
// // //       }}
// // //       value={value}
// // //       onChange={onChange}
// // //       onKeyDown={onKeyDown}
// // //       placeholder={placeholder}
// // //     />
// // //   );
// // // };

// // // const Dashboard = () => {
// // //   const [messages, setMessages] = useState([]);
// // //   const [input, setInput] = useState("");
// // //   const [editingIndex, setEditingIndex] = useState(null);
// // //   const [listening, setListening] = useState(false);
// // //   const recognitionRef = useRef(null);
// // //   const chatEndRef = useRef(null);

// // //   // 🧠 Initialize Speech Recognition
// // //   useEffect(() => {
// // //     if ("webkitSpeechRecognition" in window) {
// // //       const recognition = new window.webkitSpeechRecognition();
// // //       recognition.continuous = false;
// // //       recognition.interimResults = false;
// // //       recognition.lang = "en-US";

// // //       recognition.onstart = () => setListening(true);
// // //       recognition.onend = () => setListening(false);
// // //       recognition.onresult = (event) => {
// // //         const transcript = event.results[0][0].transcript;
// // //         setInput((prev) => (prev ? prev + " " + transcript : transcript));
// // //       };

// // //       recognitionRef.current = recognition;
// // //     }
// // //   }, []);

// // //   const handleSend = () => {
// // //     if (!input.trim()) return;

// // //     if (editingIndex !== null) {
// // //       // Update edited user message
// // //       const updatedMessages = [...messages];
// // //       updatedMessages[editingIndex].content = input;
// // //       setMessages(updatedMessages);
// // //       setEditingIndex(null);
// // //       setInput("");
// // //       return;
// // //     }

// // //     const newMsg = { role: "user", content: input };
// // //     setMessages((prev) => [...prev, newMsg]);

// // //     // Simulated bot response (replace with API call)
// // //     setTimeout(() => {
// // //       setMessages((prev) => [
// // //         ...prev,
// // //         { role: "assistant", content: `Echo: ${input}` },
// // //       ]);
// // //     }, 800);

// // //     setInput("");
// // //   };

// // //   const handleKeyDown = (e) => {
// // //     if (e.key === "Enter" && !e.shiftKey) {
// // //       e.preventDefault();
// // //       handleSend();
// // //     }
// // //   };

// // //   const startListening = () => {
// // //     if (recognitionRef.current && !listening) {
// // //       recognitionRef.current.start();
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [messages]);

// // //   // 🧩 Copy message to clipboard
// // //   const handleCopy = async (text) => {
// // //     try {
// // //       await navigator.clipboard.writeText(text);
// // //       alert("Copied to clipboard!");
// // //     } catch {
// // //       alert("Failed to copy!");
// // //     }
// // //   };

// // //   // ✏️ Edit user message
// // //   const handleEdit = (index, text) => {
// // //     setInput(text);
// // //     setEditingIndex(index);
// // //   };

// // //   return (
// // //     <div className="dashboard-container">
// // //       {/* Sidebar */}
// // //       <div className="sidebar">
// // //         <div className="sidebar-top">
// // //           <h2 className="logo">🤖 AI Chat</h2>
// // //           <button
// // //             className="sidebar-btn"
// // //             onClick={() => {
// // //               setMessages([]);
// // //               setInput("");
// // //             }}
// // //             title="Start a new chat"
// // //           >
// // //             ➕ New Chat
// // //           </button>
// // //         </div>
// // //         <div className="sidebar-bottom">
// // //           <button className="sidebar-btn">⚙️ Settings</button>
// // //         </div>
// // //       </div>

// // //       {/* Chat Section */}
// // //       <div className="chat-section">
// // //         <div className="chat-messages">
// // //           {messages.map((msg, i) => (
// // //             <div
// // //               key={i}
// // //               className={`chat-bubble-wrapper ${
// // //                 msg.role === "user" ? "user-wrapper" : "bot-wrapper"
// // //               }`}
// // //             >
// // //               <div
// // //                 className={`chat-bubble ${
// // //                   msg.role === "user" ? "user-msg" : "bot-msg"
// // //                 }`}
// // //               >
// // //                 {msg.content}
// // //               </div>

// // //               <div className="msg-actions">
// // //                 <button onClick={() => handleCopy(msg.content)}>📋</button>
// // //                 {msg.role === "user" && (
// // //                   <button onClick={() => handleEdit(i, msg.content)}>✏️</button>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           ))}
// // //           <div ref={chatEndRef} />
// // //         </div>

// // //         {/* Input Area */}
// // //         <div className="chat-input">
// // //           <AutoTextarea
// // //             value={input}
// // //             onChange={(e) => setInput(e.target.value)}
// // //             onKeyDown={handleKeyDown}
// // //             placeholder="Type or speak your message..."
// // //           />
// // //           <div className="chat-controls">
// // //             <button
// // //               className={`mic-btn ${listening ? "listening" : ""}`}
// // //               onClick={startListening}
// // //               title="Speak"
// // //             >
// // //               🎤
// // //             </button>
// // //             <button className="send-btn" onClick={handleSend}>
// // //               ➤
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // import React, { useState, useEffect, useRef } from "react";
// // import "./Dashboard.css";

// // const AutoTextarea = ({ value, onChange, onKeyDown, placeholder }) => {
// //   const ref = useRef();
// //   useEffect(() => {
// //     if (ref.current) {
// //       ref.current.style.height = "auto";
// //       ref.current.style.height = ref.current.scrollHeight + "px";
// //     }
// //   }, [value]);

// //   return (
// //     <textarea
// //       ref={ref}
// //       rows={1}
// //       className="auto-textarea"
// //       value={value}
// //       onChange={onChange}
// //       onKeyDown={onKeyDown}
// //       placeholder={placeholder}
// //     />
// //   );
// // };

// // const Dashboard = () => {
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState("");
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [editingIndex, setEditingIndex] = useState(null);
// //   const [listening, setListening] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const recognitionRef = useRef(null);
// //   const chatEndRef = useRef(null);

// //   // 🧠 Load user from localStorage (must contain webhookUrl)
// //   const [user, setUser] = useState(null);
// //   useEffect(() => {
// //     const stored = localStorage.getItem("agentog_user");
// //     if (stored) setUser(JSON.parse(stored));
// //   }, []);

// //   // 🧠 Scroll chat to bottom
// //   useEffect(() => {
// //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages, loading]);

// //   // 🧠 Initialize Voice Recognition
// //   useEffect(() => {
// //     if ("webkitSpeechRecognition" in window) {
// //       const recognition = new window.webkitSpeechRecognition();
// //       recognition.lang = "en-US";
// //       recognition.continuous = false;
// //       recognition.interimResults = false;

// //       recognition.onstart = () => setListening(true);
// //       recognition.onend = () => setListening(false);
// //       recognition.onresult = (event) => {
// //         const transcript = event.results[0][0].transcript;
// //         setInput((prev) => (prev ? prev + " " + transcript : transcript));
// //       };

// //       recognitionRef.current = recognition;
// //     }
// //   }, []);

// //   const handleFileSelect = (e) => {
// //     const file = e.target.files[0];
// //     if (file) setSelectedFile(file);
// //   };

// //   const removeFile = () => setSelectedFile(null);

// //   const handleCopy = async (text) => {
// //     try {
// //       await navigator.clipboard.writeText(text);
// //       alert("Copied ✅");
// //     } catch {
// //       alert("Copy failed ❌");
// //     }
// //   };

// //   const handleEdit = (index, text) => {
// //     setInput(text);
// //     setEditingIndex(index);
// //   };

// //   const startListening = () => {
// //     if (recognitionRef.current && !listening) recognitionRef.current.start();
// //   };

// //   // ✅ MAIN SEND FUNCTION (Webhook integration)
// //   const handleSend = async () => {
// //     if (!input.trim() && !selectedFile) return;
// //     if (!user?.webhookUrl) {
// //       alert("Webhook URL not found in user object.");
// //       return;
// //     }

// //     if (editingIndex !== null) {
// //       const updated = [...messages];
// //       updated[editingIndex].content = input;
// //       setMessages(updated);
// //       setEditingIndex(null);
// //       setInput("");
// //       return;
// //     }

// //     const userMsg = {
// //       role: "user",
// //       content: input || selectedFile?.name || "📎 File Uploaded",
// //       file: selectedFile || null,
// //     };
// //     setMessages((prev) => [...prev, userMsg]);
// //     setInput("");

// //     try {
// //       setLoading(true);

// //       let response;
// //       if (selectedFile) {
// //         // File upload
// //         const formData = new FormData();
// //         formData.append("file", selectedFile);
// //         formData.append("text", input || selectedFile.name);
// //         formData.append("messageType", "document");

// //         response = await fetch(user.webhookUrl, {
// //           method: "POST",
// //           body: formData,
// //         });
// //       } else {
// //         // Text message
// //         response = await fetch(user.webhookUrl, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ text: input, messageType: "text" }),
// //         });
// //       }

// //       const contentType = response.headers.get("content-type") || "";
// //       if (contentType.includes("application/json")) {
// //         const data = await response.json();
// //         const replyText = data.output?.response || JSON.stringify(data, null, 2);
// //         setMessages((p) => [...p, { role: "assistant", content: replyText }]);
// //       } else if (contentType.startsWith("image/")) {
// //         const blob = await response.blob();
// //         const url = URL.createObjectURL(blob);
// //         setMessages((p) => [...p, { role: "assistant", fileUrl: url, fileType: "image" }]);
// //       } else if (contentType.includes("application")) {
// //         // For documents like PDF/DOCX
// //         const blob = await response.blob();
// //         const url = URL.createObjectURL(blob);
// //         setMessages((p) => [
// //           ...p,
// //           { role: "assistant", fileUrl: url, fileType: "document" },
// //         ]);
// //       } else {
// //         const text = await response.text();
// //         setMessages((p) => [...p, { role: "assistant", content: text }]);
// //       }
// //     } catch (err) {
// //       console.error("Webhook error:", err);
// //       setMessages((p) => [
// //         ...p,
// //         { role: "assistant", content: "⚠️ Webhook Error. Check n8n setup." },
// //       ]);
// //     } finally {
// //       setLoading(false);
// //       setSelectedFile(null);
// //     }
// //   };

// //   const handleKeyDown = (e) => {
// //     if (e.key === "Enter" && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSend();
// //     }
// //   };

// //   if (!user) return <div className="loading-screen">Loading your dashboard...</div>;

// //   return (
// //     <div className="dashboard-container">
// //       {/* Sidebar */}
// //       <div className="sidebar">
// //         <div className="sidebar-top">
// //           <h2 className="logo">🤖 Agent OG</h2>
// //           <button
// //             className="sidebar-btn"
// //             onClick={() => {
// //               setMessages([]);
// //               setInput("");
// //               setSelectedFile(null);
// //             }}
// //           >
// //             ➕ New Chat
// //           </button>
// //         </div>
// //         <div className="sidebar-bottom">
// //           <button className="sidebar-btn">⚙️ Settings</button>
// //         </div>
// //       </div>

// //       {/* Chat Section */}
// //       <div className="chat-section">
// //         <div className="chat-messages">
// //           {messages.map((msg, i) => (
// //             <div
// //               key={i}
// //               className={`chat-bubble-wrapper ${
// //                 msg.role === "user" ? "user-wrapper" : "bot-wrapper"
// //               }`}
// //             >
// //               <div
// //                 className={`chat-bubble ${
// //                   msg.role === "user" ? "user-msg" : "bot-msg"
// //                 }`}
// //               >
// //                 {msg.fileType === "image" ? (
// //                   <img src={msg.fileUrl} alt="bot-response" className="response-image" />
// //                 ) : msg.fileType === "document" ? (
// //                   <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="file-link">
// //                     📄 Download File
// //                   </a>
// //                 ) : (
// //                   msg.content
// //                 )}
// //               </div>
// //               <div className="msg-actions">
// //                 {msg.content && <button onClick={() => handleCopy(msg.content)}>📋</button>}
// //                 {msg.role === "user" && (
// //                   <button onClick={() => handleEdit(i, msg.content)}>✏️</button>
// //                 )}
// //               </div>
// //             </div>
// //           ))}
// //           {loading && (
// //             <div className="loading-msg">🤖 Thinking<span className="dots">...</span></div>
// //           )}
// //           <div ref={chatEndRef} />
// //         </div>

// //         {/* Input Area */}
// //         <div className="chat-input">
// //           {selectedFile && (
// //             <div className="file-preview">
// //               <span>{selectedFile.name}</span>
// //               <button onClick={removeFile}>❌</button>
// //             </div>
// //           )}
// //           <div className="input-bar">
// //             <label htmlFor="file" className="chat-btn attach-btn">📎</label>
// //             <input
// //               type="file"
// //               id="file"
// //               style={{ display: "none" }}
// //               onChange={handleFileSelect}
// //             />
// //             <AutoTextarea
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //               onKeyDown={handleKeyDown}
// //               placeholder="Type your message..."
// //             />
// //             <button
// //               className={`mic-btn ${listening ? "listening" : ""}`}
// //               onClick={startListening}
// //               title="Speak"
// //             >
// //               🎤
// //             </button>
// //             <button className="send-btn" onClick={handleSend} disabled={loading}>
// //               ➤
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaMicrophone,
//   FaPaperclip,
//   FaArrowLeft,
//   FaCog,
//   FaPlus,
//   FaCopy,
//   FaEdit,
// } from "react-icons/fa";
// import "./Dashboard.css";

// const AutoTextarea = ({ value, onChange, onKeyDown, placeholder }) => {
//   const ref = useRef();
//   useEffect(() => {
//     if (ref.current) {
//       ref.current.style.height = "auto";
//       ref.current.style.height = ref.current.scrollHeight + "px";
//     }
//   }, [value]);
//   return (
//     <textarea
//       ref={ref}
//       rows={1}
//       className="auto-textarea"
//       value={value}
//       onChange={onChange}
//       onKeyDown={onKeyDown}
//       placeholder={placeholder}
//     />
//   );
// };

// const Dashboard = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(false);
//   const recognitionRef = useRef(null);
//   const navigate = useNavigate();

//   // Speech-to-text
//   const startListening = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Speech recognition not supported in this browser.");
//       return;
//     }
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setInput((prev) => prev + " " + transcript);
//     };
//     recognition.onend = () => setListening(false);
//     recognition.start();
//     recognitionRef.current = recognition;
//     setListening(true);
//   };

//   // Send message handler
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMsg = { role: "user", content: input, type: "text" };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);

//     // Simulate AI response with animation
//     const fakeResponse =
//       "This is a simulated ChatGPT-style typing animation response with full formatting.";
//     simulateTyping(fakeResponse);
//   };

//   // Typing animation simulation
//   const simulateTyping = (text) => {
//     let index = 0;
//     let content = "";
//     const interval = setInterval(() => {
//       if (index < text.length) {
//         content += text[index];
//         setMessages((prev) => {
//           const updated = [...prev];
//           if (updated[updated.length - 1]?.role === "assistant-temp") {
//             updated[updated.length - 1].content = content;
//           } else {
//             updated.push({
//               role: "assistant-temp",
//               content,
//               type: "text",
//             });
//           }
//           return updated;
//         });
//         index++;
//       } else {
//         clearInterval(interval);
//         setMessages((prev) => {
//           const updated = [...prev];
//           updated[updated.length - 1].role = "assistant";
//           return updated;
//         });
//         setLoading(false);
//       }
//     }, 30);
//   };

//   // File upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const fileType = file.type.startsWith("image/")
//       ? "image"
//       : file.type.includes("pdf") ||
//         file.type.includes("document") ||
//         file.type.includes("text")
//       ? "document"
//       : "unknown";

//     const fileUrl = URL.createObjectURL(file);

//     setMessages((prev) => [
//       ...prev,
//       { role: "user", content: fileUrl, type: fileType, name: file.name },
//     ]);

//     // Simulate AI acknowledging
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: `Received your ${fileType}: ${file.name}`,
//           type: "text",
//         },
//       ]);
//     }, 1000);
//   };

//   // Copy message
//   const handleCopy = (content) => {
//     navigator.clipboard.writeText(content);
//   };

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div className="top-icons">
//           <button className="icon-btn" onClick={() => navigate("/")}>
//             <FaArrowLeft />
//           </button>
//           <button className="icon-btn">
//             <FaPlus /> <span>New Chat</span>
//           </button>
//         </div>
//         <div className="bottom-icons">
//           <button className="icon-btn">
//             <FaCog />
//           </button>
//         </div>
//       </div>

//       {/* Main Chat */}
//       <div className="chat-container">
//         <div className="chat-header">
//           <h3>Agent OG</h3>
//         </div>

//         <div className="messages">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`message ${
//                 msg.role === "user" ? "user" : "assistant"
//               }`}
//             >
//               {msg.type === "text" && <p>{msg.content}</p>}
//               {msg.type === "image" && (
//                 <img src={msg.content} alt="Uploaded" className="uploaded-img" />
//               )}
//               {msg.type === "document" && (
//                 <a href={msg.content} target="_blank" rel="noreferrer">
//                   📄 {msg.name}
//                 </a>
//               )}

//               <div className="message-actions">
//                 <button onClick={() => handleCopy(msg.content)}>
//                   <FaCopy />
//                 </button>
//                 <button>
//                   <FaEdit />
//                 </button>
//               </div>
//             </div>
//           ))}
//           {loading && (
//             <div className="typing-indicator">
//               <span></span>
//               <span></span>
//               <span></span>
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className="input-area">
//           <label htmlFor="file-upload" className="upload-btn">
//             <FaPaperclip />
//           </label>
//           <input
//             type="file"
//             id="file-upload"
//             hidden
//             onChange={handleFileUpload}
//           />

//           <AutoTextarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
//             placeholder="Message Agent OG..."
//           />
//           <button className="mic-btn" onClick={startListening}>
//             <FaMicrophone color={listening ? "#00ffcc" : "#ccc"} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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
