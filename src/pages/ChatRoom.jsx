import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MOCK_CHATS = [];

// ── Theme definitions ────────────────────────────────────────────────────────
const themes = {
  dark: {
    root: "bg-slate-950",
    sidebar: "bg-slate-900/60 border-white/[0.06]",
    sidebarHeader: "border-white/[0.06]",
    sidebarFooter: "border-white/[0.06]",
    chatItemActive: "bg-white/[0.06]",
    chatItemHover: "hover:bg-white/[0.04]",
    chatName: "text-white",
    chatLastMsg: "text-slate-500",
    chatTime: "text-slate-600",
    userName: "text-slate-300",
    logoutBtn: "text-slate-600 hover:text-red-400",
    newChatBox: "bg-slate-800/80 border-white/[0.08]",
    newChatTitle: "text-white",
    newChatInput:
      "bg-white/[0.04] border-white/[0.08] text-white placeholder-slate-600 focus:ring-indigo-500/60 focus:border-indigo-500/40",
    cancelBtn:
      "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-slate-400",
    chatArea: "",
    chatHeader: "border-white/[0.06] bg-slate-900/40",
    chatHeaderName: "text-white",
    chatHeaderEmail: "text-slate-500",
    closeBtn:
      "bg-white/[0.04] hover:bg-red-500/20 border-white/[0.08] hover:border-red-500/40",
    closeBtnIcon: "text-slate-500 group-hover:text-red-400",
    messagesArea: "",
    dateSepLine: "bg-white/[0.06]",
    dateSepLabel: "text-slate-500 bg-white/[0.04] border-white/[0.06]",
    emptyIcon: "bg-white/[0.03] border-white/[0.07]",
    emptyIconColor: "text-slate-600",
    emptyTitle: "text-slate-400",
    emptySubtitle: "text-slate-600",
    themBubble: "bg-white/[0.06] border border-white/[0.08] text-slate-200",
    themBubbleTime: "text-slate-500",
    inputBar: "border-white/[0.06] bg-slate-900/40",
    inputWrap:
      "bg-white/[0.04] border-white/[0.08] focus-within:ring-indigo-500/40 focus-within:border-indigo-500/30",
    inputText: "text-white placeholder-slate-600",
    inputHint: "text-slate-700",
    welcomeTitle: "text-slate-300",
    welcomeSub: "text-slate-600",
    appTitle: "text-white",
    themeToggleBg:
      "bg-white/[0.05] border-white/[0.08] hover:bg-indigo-500/20 hover:border-indigo-500/40",
    themeToggleIcon: "text-slate-400 group-hover:text-indigo-400",
    mobileBackBtn: "text-slate-400 hover:text-white",
    mobileBg: "bg-slate-950",
    onlineBorder: "border-slate-900",
    lastSeenText: "text-slate-500",
  },
  light: {
    root: "bg-indigo-50",
    sidebar: "bg-white border-indigo-100 shadow-sm",
    sidebarHeader: "border-indigo-100",
    sidebarFooter: "border-indigo-100",
    chatItemActive: "bg-indigo-100",
    chatItemHover: "hover:bg-indigo-50",
    chatName: "text-slate-900",
    chatLastMsg: "text-slate-500",
    chatTime: "text-indigo-400",
    userName: "text-slate-800",
    logoutBtn: "text-slate-400 hover:text-red-500",
    newChatBox: "bg-indigo-50 border-indigo-200",
    newChatTitle: "text-slate-900",
    newChatInput:
      "bg-white border-indigo-200 text-slate-900 placeholder-slate-400 focus:ring-indigo-400 focus:border-indigo-400",
    cancelBtn: "bg-white hover:bg-slate-100 border-indigo-200 text-slate-600",
    chatArea: "bg-indigo-50",
    chatHeader: "border-indigo-100 bg-white shadow-sm",
    chatHeaderName: "text-slate-900",
    chatHeaderEmail: "text-indigo-400",
    closeBtn:
      "bg-indigo-50 hover:bg-red-50 border-indigo-200 hover:border-red-300",
    closeBtnIcon: "text-slate-400 group-hover:text-red-400",
    messagesArea: "bg-indigo-50",
    dateSepLine: "bg-indigo-200",
    dateSepLabel: "text-indigo-400 bg-white border-indigo-200",
    emptyIcon: "bg-white border-indigo-200 shadow-sm",
    emptyIconColor: "text-indigo-300",
    emptyTitle: "text-slate-600",
    emptySubtitle: "text-slate-400",
    themBubble: "bg-white border border-indigo-100 text-slate-800 shadow-sm",
    themBubbleTime: "text-slate-400",
    inputBar: "border-indigo-100 bg-white shadow-sm",
    inputWrap:
      "bg-indigo-50 border-indigo-200 focus-within:ring-indigo-400 focus-within:border-indigo-400",
    inputText: "text-slate-900 placeholder-slate-400",
    inputHint: "text-indigo-300",
    welcomeTitle: "text-slate-800",
    welcomeSub: "text-slate-500",
    appTitle: "text-slate-900",
    themeToggleBg:
      "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400",
    themeToggleIcon: "text-indigo-400 group-hover:text-indigo-600",
    mobileBackBtn: "text-slate-600 hover:text-slate-900",
    mobileBg: "bg-indigo-50",
    onlineBorder: "border-white",
    lastSeenText: "text-slate-400",
  },
};

const ChatRoom = () => {
  const { user, logout, API } = useAuth();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(true);
  const t = isDark ? themes.dark : themes.light;

  const [chats, setChats] = useState(MOCK_CHATS);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [lastSeenMap, setLastSeenMap] = useState({});
  const [input, setInput] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newChatLoading, setNewChatLoading] = useState(false);
  const [newChatError, setNewChatError] = useState("");
  const messagesEndRef = useRef(null);
  const retryCountRef = useRef({});
  const wsMapRef = useRef({});
  const reconnectTimers = useRef({});
  const connectWSRef = useRef(null);
  const activeChatIdRef = useRef(null);
  // Stable ref so polling interval always reads latest chats without restarting
  const chatsRef = useRef([]);

  // ── Keep chatsRef in sync with chats state ────────────────────────────────
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  // ── Detect mobile ─────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Keep activeChatIdRef in sync ──────────────────────────────────────────
  useEffect(() => {
    activeChatIdRef.current = activeChat?.id || null;
  }, [activeChat]);

  // ── Mobile: browser back closes chat ─────────────────────────────────────
  useEffect(() => {
    if (!isMobile) return;
    if (activeChat) window.history.pushState({ chat: activeChat.id }, "");
    const handlePopState = () => setActiveChat(null);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeChat, isMobile]);

  // ── Auto-scroll to latest message ────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // ── Poll online status + last_seen every 30s ──────────────────────────────
  // KEY FIX: depends only on [user], not [chats.length].
  // Uses chatsRef so it always sees latest chats without restarting the interval.
  useEffect(() => {
    if (!user) return;

    const fetchStatuses = async () => {
      const current = chatsRef.current.filter((c) => c.participantId);
      if (current.length === 0) return;

      const results = await Promise.allSettled(
        current.map((c) =>
          API.get(`/users/${c.participantId}/status`).then((r) => ({
            id: c.participantId,
            online: r.data.online,
            last_seen: r.data.last_seen,
            lastTime: c.lastTime, // conversation's last message time as fallback
          }))
        )
      );

      const onlineSet = new Set();
      const mergedLastSeen = {};
      results.forEach((r) => {
        if (r.status !== "fulfilled") return;
        const { id, online, last_seen, lastTime } = r.value;
        if (online) {
          onlineSet.add(id);
        } else {
          // Prefer API last_seen, fall back to last message time
          const ls = last_seen || lastTime;
          if (ls) mergedLastSeen[id] = ls;
        }
      });

      setOnlineUsers(onlineSet);
      // Merge — never wipe out previously known last_seen values
      setLastSeenMap((prev) => ({ ...prev, ...mergedLastSeen }));
    };

    fetchStatuses();
    const interval = setInterval(fetchStatuses, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // ← only [user], not chats.length — this is intentional

  // ── Date label for message separators ────────────────────────────────────
  const getDateLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ── Smart time for sidebar ────────────────────────────────────────────────
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return d.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  // ── Time for message bubbles ──────────────────────────────────────────────
  const formatBubbleTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Last seen formatter ───────────────────────────────────────────────────
  const formatLastSeen = (isoString) => {
    if (!isoString) return null;
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (d.toDateString() === today.toDateString()) {
      return `Last seen today at ${time}`;
    } else if (d.toDateString() === yesterday.toDateString()) {
      return `Last seen yesterday at ${time}`;
    } else {
      return `Last seen ${d.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
      })} at ${time}`;
    }
  };

  const connectWS = useCallback(
    (chat) => {
      if (!user || !chat.id || !user.id) return;
      const existing = wsMapRef.current[chat.id];
      if (
        existing &&
        (existing.readyState === WebSocket.OPEN ||
          existing.readyState === WebSocket.CONNECTING)
      )
        return;

      const ws = new WebSocket(`ws://localhost:8000/ws/${chat.id}/${user.id}`);

      ws.onopen = () => {
        retryCountRef.current[chat.id] = 0;
        if (reconnectTimers.current[chat.id]) {
          clearTimeout(reconnectTimers.current[chat.id]);
          delete reconnectTimers.current[chat.id];
        }
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        // ── Presence update ───────────────────────────────────────────────
        if (msg.type === "presence") {
          setOnlineUsers((prev) => {
            const next = new Set(prev);
            msg.online ? next.add(msg.user_id) : next.delete(msg.user_id);
            return next;
          });
          if (!msg.online && msg.last_seen) {
            setLastSeenMap((prev) => ({
              ...prev,
              [msg.user_id]: msg.last_seen,
            }));
          }
          return;
        }

        // ── Regular chat message ──────────────────────────────────────────
        if (msg.sender_id === user.id) return;
        const newMsg = {
          id: msg._id,
          text: msg.text,
          sender: "them",
          time: new Date(msg.timestamp),
        };
        const arrivedAt = new Date();
        const isOpen = activeChatIdRef.current === chat.id;
        if (!isOpen) {
          setUnreadCounts((counts) => ({
            ...counts,
            [chat.id]: (counts[chat.id] || 0) + 1,
          }));
        }
        setActiveChat((prev) =>
          prev?.id === chat.id
            ? { ...prev, messages: [...prev.messages, newMsg] }
            : prev
        );
        setChats((prev) => {
          const updated = prev.map((c) =>
            c.id === chat.id
              ? {
                  ...c,
                  messages: [...c.messages, newMsg],
                  lastMessage: msg.text,
                  lastTime: arrivedAt,
                }
              : c
          );
          return [...updated].sort(
            (a, b) => new Date(b.lastTime) - new Date(a.lastTime)
          );
        });
      };

      ws.onerror = (err) => console.error("WS error:", chat.id, err);

      ws.onclose = () => {
        delete wsMapRef.current[chat.id];
        const retries = retryCountRef.current[chat.id] || 0;
        if (retries >= 5) {
          retryCountRef.current[chat.id] = 0;
          return;
        }
        retryCountRef.current[chat.id] = retries + 1;
        reconnectTimers.current[chat.id] = setTimeout(
          () => connectWS(chat),
          2000
        );
      };

      wsMapRef.current[chat.id] = ws;
    },
    [user]
  );

  useEffect(() => {
    connectWSRef.current = connectWS;
  }, [connectWS]);

  // ── User-level WS: listens for new conversations ──────────────────────────
  useEffect(() => {
    if (!user) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/user/${user.id}`);
    ws.onopen = () => console.log("User-level WS connected:", user.id);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_conversation") {
          const conv = data.conversation;
          const other = conv.participants.find((p) => p.id !== user.id);
          const newChat = {
            id: conv._id,
            name: other?.name || "Unknown",
            email: other?.email || "",
            participantId: other?.id || "",
            avatar: other?.name?.[0]?.toUpperCase() || "?",
            messages: [],
            lastMessage: conv.lastMessage || "",
            lastTime: conv.lastTime ? new Date(conv.lastTime) : new Date(),
          };
          setChats((prev) => {
            if (prev.find((c) => c.id === newChat.id)) return prev;
            return [newChat, ...prev];
          });
          connectWSRef.current?.(newChat);
        }
      } catch (err) {
        console.error("User-level WS parse error:", err);
      }
    };
    ws.onerror = (err) => console.error("User-level WS error:", err);
    ws.onclose = () => console.log("User-level WS closed:", user.id);
    return () => ws.close();
  }, [user]);

  const ensureOpenAndSend = useCallback((chatId, payload) => {
    const ws = wsMapRef.current[chatId];
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }, []);

  // ── Load conversations on mount ───────────────────────────────────────────
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      try {
        const res = await API.get(`/conversations?user_id=${user.id}`);
        const loaded = await Promise.all(
          res.data.map(async (conv) => {
            const other = conv.participants.find((p) => p.id !== user.id);
            const msgRes = await API.get(`/conversations/${conv._id}/messages`);
            const messages = msgRes.data.map((m) => ({
              id: m._id,
              text: m.text,
              sender: m.sender_id === user.id ? "me" : "them",
              time: new Date(m.timestamp),
              isRead: m.is_read || false
            }));
            const unread = messages.filter((m) => m.sender === "them" && !m.isRead).length;
            return {
              id: conv._id,
              name: other?.name || "Unknown",
              email: other?.email || "",
              participantId: other?.id || "",
              avatar: other?.name?.[0]?.toUpperCase() || "?",
              messages,
              lastMessage: conv.lastMessage || "",
              lastTime: conv.lastTime ? new Date(conv.lastTime) : new Date(),
              unread,
            };
          })
        );

        const initialUnread = {};
        loaded.forEach((c) => {
          if (c.unread > 0) initialUnread[c.id] = c.unread;
        });
        setUnreadCounts(initialUnread);
        setChats(
          [...loaded].sort(
            (a, b) => new Date(b.lastTime) - new Date(a.lastTime)
          )
        );

        // Fetch status once for all on load — polling takes over after this
        const statusResults = await Promise.allSettled(
          loaded
            .filter((c) => c.participantId)
            .map((c) =>
              API.get(`/users/${c.participantId}/status`).then((r) => ({
                id: c.participantId,
                online: r.data.online,
                last_seen: r.data.last_seen,
                lastTime: c.lastTime,
              }))
            )
        );
        const seededLastSeen = {};
        const seededOnline = new Set();
        statusResults.forEach((r) => {
          if (r.status !== "fulfilled") return;
          const { id, online, last_seen, lastTime } = r.value;
          if (online) {
            seededOnline.add(id);
          } else {
            const ls = last_seen || lastTime;
            if (ls) seededLastSeen[id] = ls;
          }
        });
        setLastSeenMap(seededLastSeen);
        setOnlineUsers(seededOnline);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!user || chats.length === 0) return;
    chats.forEach((chat) => connectWS(chat));
    return () => {
      Object.values(wsMapRef.current).forEach((ws) => ws.close());
      wsMapRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats.length, user]);

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    const text = input.trim();
    const sent = ensureOpenAndSend(activeChat.id, { text });
    if (!sent) {
      const chat = chats.find((c) => c.id === activeChat.id);
      if (chat) connectWS(chat);
      setTimeout(() => {
        if (ensureOpenAndSend(activeChat.id, { text })) {
          const msg = { id: Date.now(), text, sender: "me", time: new Date() };
          setChats((prev) =>
            prev.map((c) =>
              c.id === activeChat.id
                ? {
                    ...c,
                    messages: [...c.messages, msg],
                    lastMessage: text,
                    lastTime: new Date(),
                  }
                : c
            )
          );
          setActiveChat((prev) => ({
            ...prev,
            messages: [...prev.messages, msg],
          }));
          setInput("");
        }
      }, 500);
      return;
    }
    const msg = { id: Date.now(), text, sender: "me", time: new Date() };
    setChats((prev) => {
      const updated = prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastMessage: text,
              lastTime: new Date(),
            }
          : c
      );
      return [...updated].sort(
        (a, b) => new Date(b.lastTime) - new Date(a.lastTime)
      );
    });
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
      const res = await API.get(
        `/users/find?email=${encodeURIComponent(newEmail.trim())}&requester_id=${user.id}`
      );
      const foundUser = res.data.user;
      if (!foundUser) {
        setNewChatError("User not found with that email.");
        return;
      }
      if (foundUser.id === user.id) {
        setNewChatError("You can't chat with yourself.");
        return;
      }
      const existing = chats.find(
        (c) =>
          c.email?.toLowerCase() === foundUser.email?.toLowerCase() ||
          (foundUser.conversation_id && c.id === foundUser.conversation_id)
      );
      if (existing || foundUser.already_chatting) {
        const target =
          existing || chats.find((c) => c.id === foundUser.conversation_id);
        setNewChatError(`You already have a chat with ${foundUser.name}.`);
        setTimeout(() => {
          if (target) openChat(target);
          setShowNewChat(false);
          setNewEmail("");
          setNewChatError("");
        }, 1200);
        return;
      }
      const convRes = await API.post("/conversations", {
        participants: [
          { id: user.id, name: user.name, email: user.email },
          { id: foundUser.id, name: foundUser.name, email: foundUser.email },
        ],
      });
      const existingById = chats.find((c) => c.id === convRes.data._id);
      if (existingById) {
        openChat(existingById);
        setShowNewChat(false);
        setNewEmail("");
        return;
      }
      const newChat = {
        id: convRes.data._id,
        name: foundUser.name,
        email: foundUser.email,
        participantId: foundUser.id,
        avatar: foundUser.name?.[0]?.toUpperCase() || "?",
        messages: [],
        lastMessage: "",
        lastTime: new Date(),
      };
      setChats((prev) => {
        if (prev.find((c) => c.id === newChat.id)) return prev;
        return [newChat, ...prev];
      });
      connectWS(newChat);
      openChat(newChat);
      setShowNewChat(false);
      setNewEmail("");
    } catch (err) {
      setNewChatError(
        err.response?.data?.detail || "User not found with that email."
      );
    } finally {
      setNewChatLoading(false);
    }
  };

  // ── Open chat: fetch latest messages + clear unread ───────────────────────
  const openChat = useCallback(
    async (chat) => {
      setActiveChat(chat);
      setUnreadCounts((counts) => ({ ...counts, [chat.id]: 0 }));
      try {
        await API.put(`/conversations/${chat.id}/read`, { user_id: user.id });
        const msgRes = await API.get(`/conversations/${chat.id}/messages`);
        const messages = msgRes.data.map((m) => ({
          id: m._id,
          text: m.text,
          sender: m.sender_id === user.id ? "me" : "them",
          time: new Date(m.timestamp),
          isRead: true
        }));
        setActiveChat((prev) =>
          prev?.id === chat.id ? { ...prev, messages } : prev
        );
        setChats((prev) =>
          prev.map((c) => (c.id === chat.id ? { ...c, messages } : c))
        );
      } catch (err) {
        console.error("Failed to reload messages:", err);
      }
    },
    [API, user]
  );

  // ── Online dot component ──────────────────────────────────────────────────
  const OnlineDot = () => (
    <span
      className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 ${t.onlineBorder}`}
    />
  );

  // ── Derived: is active chat's participant online ───────────────────────────
  const isActiveChatOnline =
    activeChat && onlineUsers.has(activeChat.participantId);

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const SidebarContent = (
    <div
      className={`flex flex-col h-full border-r transition-colors duration-300 ${t.sidebar} ${
        isMobile ? "w-full" : "w-[300px] flex-shrink-0"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-5 py-4 border-b ${t.sidebarHeader}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              />
            </svg>
          </div>
          <span className={`font-semibold text-sm tracking-tight ${t.appTitle}`}>
            Go Chat
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark((d) => !d)}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 group ${t.themeToggleBg}`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg
                className={`w-4 h-4 transition-colors ${t.themeToggleIcon}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z"
                />
              </svg>
            ) : (
              <svg
                className={`w-4 h-4 transition-colors ${t.themeToggleIcon}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              setShowNewChat(true);
              setNewChatError("");
              setNewEmail("");
            }}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 group ${t.themeToggleBg}`}
            title="New chat"
          >
            <svg
              className={`w-4 h-4 transition-colors ${t.themeToggleIcon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* New Chat Box */}
      {showNewChat && (
        <div className={`mx-3 mt-3 border rounded-2xl p-4 ${t.newChatBox}`}>
          <p className={`text-sm font-semibold mb-3 ${t.newChatTitle}`}>
            Start a new chat
          </p>
          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="w-3.5 h-3.5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setNewChatError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleStartChat()}
              placeholder="Enter email address"
              className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 transition-all duration-200 ${t.newChatInput}`}
            />
          </div>
          {newChatError && (
            <p className="text-red-400 text-xs mb-2 flex items-center gap-1.5">
              <svg
                className="w-3 h-3 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Searching...
                </span>
              ) : (
                "Start chat"
              )}
            </button>
            <button
              onClick={() => {
                setShowNewChat(false);
                setNewChatError("");
                setNewEmail("");
              }}
              className={`px-3 border text-xs rounded-xl transition-all duration-200 ${t.cancelBtn}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-2 chat-scrollbar">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${t.emptyIcon}`}
            >
              <svg
                className={`w-5 h-5 ${t.emptyIconColor}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-medium ${t.emptyTitle}`}>
                No chats yet
              </p>
              <p className={`text-xs mt-1 ${t.emptySubtitle}`}>
                Press + to start a conversation
              </p>
            </div>
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => openChat(chat)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 text-left ${
                t.chatItemHover
              } ${activeChat?.id === chat.id ? t.chatItemActive : ""}`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-white/[0.08] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {chat.avatar}
                  </span>
                </div>
                {onlineUsers.has(chat.participantId) && <OnlineDot />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={`text-sm font-medium truncate ${t.chatName}`}>
                    {chat.name}
                  </p>
                  <span className={`text-[10px] flex-shrink-0 ml-2 ${t.chatTime}`}>
                    {formatTime(chat.lastTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-xs truncate ${t.chatLastMsg}`}>
                    {chat.lastMessage || "No messages yet"}
                  </p>
                  {unreadCounts[chat.id] > 0 && activeChat?.id !== chat.id && (
                    <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCounts[chat.id] > 99 ? "99+" : unreadCounts[chat.id]}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* User footer */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-t ${t.sidebarFooter}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/40 to-violet-500/40 border border-white/[0.1] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <p className={`text-sm font-medium truncate ${t.userName}`}>
            {user?.name || "User"}
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className={`flex items-center gap-1.5 transition-colors text-xs ${t.logoutBtn}`}
          title="Logout"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );

  // ── Chat Window ───────────────────────────────────────────────────────────
  const ChatWindow = activeChat ? (
    <div
      className={`flex-1 flex flex-col min-w-0 transition-colors duration-300 ${
        isMobile
          ? `w-full h-full absolute inset-0 z-10 ${t.mobileBg}`
          : t.chatArea
      }`}
    >
      {/* Chat Header */}
      <div
        className={`flex items-center gap-3 px-4 py-4 border-b ${t.chatHeader}`}
      >
        {isMobile && (
          <button
            onClick={() => window.history.back()}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${t.mobileBackBtn}`}
            title="Back"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Avatar with online dot */}
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-white/[0.08] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {activeChat.avatar}
            </span>
          </div>
          {isActiveChatOnline && <OnlineDot />}
        </div>

        {/* Name + Online / Last seen */}
        <div className="flex-1">
          <p className={`text-sm font-semibold ${t.chatHeaderName}`}>
            {activeChat.name}
          </p>
          {isActiveChatOnline ? (
            <p className="text-xs text-emerald-400">Online</p>
          ) : (
            <p className={`text-xs ${t.lastSeenText}`}>
              {/* Try lastSeenMap first, then fall back to the conversation's lastTime */}
              {formatLastSeen(lastSeenMap[activeChat.participantId]) ??
                formatLastSeen(activeChat.lastTime) ??
                "Last seen: unknown"}
            </p>
          )}
        </div>

        {!isMobile && (
          <button
            onClick={() => setActiveChat(null)}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 group ${t.closeBtn}`}
            title="Close chat"
          >
            <svg
              className={`w-4 h-4 transition-colors ${t.closeBtnIcon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        className={`flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 chat-scrollbar ${t.messagesArea}`}
      >
        {activeChat.messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${t.emptyIcon}`}
            >
              <svg
                className={`w-6 h-6 ${t.emptyIconColor}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-medium ${t.emptyTitle}`}>
                No messages yet
              </p>
              <p className={`text-xs mt-1 ${t.emptySubtitle}`}>
                Say hello to {activeChat.name}!
              </p>
            </div>
          </div>
        ) : (
          (() => {
            let lastLabel = null;
            return activeChat.messages.map((msg) => {
              const label = getDateLabel(msg.time);
              const showLabel = label !== lastLabel;
              lastLabel = label;
              const isMe = msg.sender === "me";
              return (
                <React.Fragment key={msg.id}>
                  {showLabel && (
                    <div className="flex items-center gap-3 my-2">
                      <div className={`flex-1 h-px ${t.dateSepLine}`} />
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${t.dateSepLabel}`}
                      >
                        {label}
                      </span>
                      <div className={`flex-1 h-px ${t.dateSepLine}`} />
                    </div>
                  )}
                  <div
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm"
                          : `${t.themBubble} rounded-bl-sm`
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isMe ? "text-indigo-200/70 text-right" : t.themBubbleTime
                        }`}
                      >
                        {formatBubbleTime(msg.time)}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              );
            });
          })()
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`px-4 py-4 border-t ${t.inputBar}`}>
        <div
          className={`flex items-center gap-3 border rounded-2xl px-4 py-2 focus-within:ring-1 transition-all duration-200 ${t.inputWrap}`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${activeChat.name}...`}
            className={`flex-1 bg-transparent text-sm focus:outline-none py-1 ${t.inputText}`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 flex-shrink-0"
          >
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        {!isMobile && (
          <p className={`text-[10px] mt-1.5 text-center ${t.inputHint}`}>
            Press Enter to send
          </p>
        )}
      </div>
    </div>
  ) : (
    !isMobile && (
      <div
        className={`flex-1 flex flex-col items-center justify-center gap-4 relative overflow-hidden ${t.chatArea}`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div
          className={`relative w-16 h-16 rounded-2xl border flex items-center justify-center ${t.emptyIcon}`}
        >
          <svg
            className={`w-7 h-7 ${t.emptyIconColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            />
          </svg>
        </div>
        <div className="relative text-center">
          <p className={`text-base font-semibold ${t.welcomeTitle}`}>
            Your messages
          </p>
          <p className={`text-sm mt-1 ${t.welcomeSub}`}>
            Select a chat or start a new conversation
          </p>
        </div>
        <button
          onClick={() => {
            setShowNewChat(true);
            setNewChatError("");
            setNewEmail("");
          }}
          className="relative mt-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New conversation
        </button>
      </div>
    )
  );

  return (
    <div
      className={`h-screen flex overflow-hidden relative transition-colors duration-300 ${t.root}`}
    >
      {SidebarContent}
      {ChatWindow}
    </div>
  );
};

export default ChatRoom;