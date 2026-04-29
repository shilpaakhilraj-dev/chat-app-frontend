import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// ── Mock data for demonstration ──
const MOCK_CHATS = [];

const ChatRoom = () => {
  const { user, logout, API } = useAuth();

  const [chats, setChats] = useState(MOCK_CHATS);
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newChatLoading, setNewChatLoading] = useState(false);
  const [newChatError, setNewChatError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    const msg = { id: Date.now(), text: input.trim(), sender: "me", time: new Date() };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? { ...c, messages: [...c.messages, msg], lastMessage: input.trim(), lastTime: new Date() }
          : c
      )
    );
    setActiveChat((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartChat = async () => {
    if (!newEmail.trim()) return;
    setNewChatLoading(true);
    setNewChatError("");

    try {
      // API call to find user by email
      const res = await API.get(`/users/find?email=${encodeURIComponent(newEmail.trim())}`);
      const foundUser = res.data;

      // Check if chat already exists
      const existing = chats.find((c) => c.email === foundUser.email);
      if (existing) {
        setActiveChat(existing);
        setShowNewChat(false);
        setNewEmail("");
        setNewChatLoading(false);
        return;
      }

      const newChat = {
        id: Date.now(),
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.name?.[0]?.toUpperCase() || "?",
        messages: [],
        lastMessage: "",
        lastTime: new Date(),
      };

      setChats((prev) => [newChat, ...prev]);
      setActiveChat(newChat);
      setShowNewChat(false);
      setNewEmail("");
    } catch (err) {
      setNewChatError(err.response?.data?.message || "User not found with that email.");
    } finally {
      setNewChatLoading(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen bg-slate-950 flex overflow-hidden">

      {/* ── SIDEBAR ── */}
      <div className="w-[300px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-slate-900/60">

        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">Go Chat</span>
          </div>
          {/* New Chat Button */}
          <button
            onClick={() => { setShowNewChat(true); setNewChatError(""); setNewEmail(""); }}
            className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-indigo-500/20 border border-white/[0.08] hover:border-indigo-500/40 flex items-center justify-center transition-all duration-200 group"
            title="New chat"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* New Chat Modal inline */}
        {showNewChat && (
          <div className="mx-3 mt-3 bg-slate-800/80 border border-white/[0.08] rounded-2xl p-4">
            <p className="text-white text-sm font-semibold mb-3">Start a new chat</p>
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => { setNewEmail(e.target.value); setNewChatError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleStartChat()}
                placeholder="Enter email address"
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all duration-200"
              />
            </div>
            {newChatError && (
              <p className="text-red-400 text-xs mb-2 flex items-center gap-1.5">
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {newChatError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleStartChat}
                disabled={newChatLoading || !newEmail.trim()}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl py-2 transition-all duration-200"
              >
                {newChatLoading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Searching...
                  </span>
                ) : "Start chat"}
              </button>
              <button
                onClick={() => { setShowNewChat(false); setNewChatError(""); setNewEmail(""); }}
                className="px-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 text-xs rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto py-2">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">No chats yet</p>
                <p className="text-slate-600 text-xs mt-1">Press + to start a conversation</p>
              </div>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors duration-150 text-left ${activeChat?.id === chat.id ? "bg-white/[0.06]" : ""}`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">{chat.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-white text-sm font-medium truncate">{chat.name}</p>
                    <span className="text-slate-600 text-[10px] flex-shrink-0 ml-2">{formatTime(chat.lastTime)}</span>
                  </div>
                  <p className="text-slate-500 text-xs truncate">{chat.lastMessage || "No messages yet"}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* User footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/40 to-violet-500/40 border border-white/[0.1] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase() || "U"}</span>
            </div>
            <p className="text-slate-300 text-sm font-medium truncate">{user?.name || "User"}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-slate-600 hover:text-red-400 transition-colors text-xs"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-slate-900/40">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-white/[0.08] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{activeChat.avatar}</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{activeChat.name}</p>
                <p className="text-slate-500 text-xs">{activeChat.email}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
              {activeChat.messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">No messages yet</p>
                    <p className="text-slate-600 text-xs mt-1">Say hello to {activeChat.name}!</p>
                  </div>
                </div>
              ) : (
                activeChat.messages.map((msg) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm"
                          : "bg-white/[0.06] border border-white/[0.08] text-slate-200 rounded-bl-sm"
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? "text-indigo-200/70 text-right" : "text-slate-500"}`}>
                          {formatTime(msg.time)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/[0.06] bg-slate-900/40">
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2 focus-within:ring-1 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/30 transition-all duration-200">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${activeChat.name}...`}
                  className="flex-1 bg-transparent text-white placeholder-slate-600 text-sm focus:outline-none py-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-700 text-[10px] mt-1.5 text-center">Press Enter to send</p>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
            {/* Background atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="relative w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
              <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="relative text-center">
              <p className="text-slate-300 text-base font-semibold">Your messages</p>
              <p className="text-slate-600 text-sm mt-1">Select a chat or start a new conversation</p>
            </div>
            <button
              onClick={() => { setShowNewChat(true); setNewChatError(""); setNewEmail(""); }}
              className="relative mt-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;