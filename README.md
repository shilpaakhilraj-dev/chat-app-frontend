# Chat App Frontend (React)

A modern **real-time chat application frontend** built using **React**, designed to work seamlessly with a FastAPI + WebSocket backend.

---

## Features

* 🔐 User Authentication (Login / Register)
* 💬 Real-time messaging via WebSockets
* 👥 One-to-one chat interface
* 🟢 Online / Offline user status
* ⏱ Last seen indicator
* 📩 Message read receipts
* ⚡ Responsive and clean UI

---

## Tech Stack

* **Frontend**: React
* **State Management**: Context API / Hooks
* **Realtime Communication**: WebSockets
* **API Calls**: Axios
* **Styling**: Tailwind
* **Routing**: React Router

---

## Project Structure

```id="s1h8x2"
.
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages (Chat, Login, Register)
│   ├── services/        # API & WebSocket services
│   ├── context/         # Global state management
│   ├── utils/           # Helper functions
│   ├── App.js           # Root component
│   └── index.js         # Entry point
├── public/
├── package.json
└── README.md

---

## WebSocket Flow

1. User connects to WebSocket
2. Sends/receives messages in real-time
3. Presence updates (online/offline)
4. Messages broadcast to participants instantly

---

## Key Functionalities

### Authentication

* JWT-based login/register
* Token stored in local storage/session

### Chat System

* Create or open conversations
* Send & receive messages instantly
* View chat history

### Presence Tracking

* Shows online users in real-time
* Displays last seen when offline

### Read Receipts

* Messages marked as read when opened

---

## UI Highlights

* Clean chat interface
* Responsive layout (mobile + desktop)
* User-friendly navigation
* Real-time updates without refresh


---

## Author

Developed by **Shilpa K**

---

## 📄 License

This project is open-source and available under the MIT License.

---
