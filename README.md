# CodeSync — Real-Time Collaborative Code Editor ⚡💻

[![CI](https://github.com/LAKSHYA-NIGAM/CodeSync/actions/workflows/ci.yml/badge.svg)](https://github.com/LAKSHYA-NIGAM/CodeSync/actions/workflows/ci.yml)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Docker Compose](https://img.shields.io/badge/docker--compose-v3.8-blue.svg)](https://docs.docker.com/compose/)
[![WebSockets](https://img.shields.io/badge/realtime-Socket.io-orange.svg)](https://socket.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

CodeSync is a distributed, full-stack real-time collaborative code editor. Multiple developers can join shared virtual coding rooms, broadcast live code changes simultaneously, chat in real time, and manage room membership with sub-millisecond synchronization powered by **Socket.io**, **Redis**, **MongoDB**, and **Docker**.

---

## 🏗️ Architecture & Real-Time Data Flow

```
[ React 18 Frontend ] (Vite + Tailwind CSS)
         │
         ├─── REST API Requests (JWT Auth, Room CRUD)
         │           ▼
         │   [ Express 5 Gateway ]
         │           ├── Rate Limiter (Redis IP window)
         │           ├── JWT Authentication Middleware
         │           └── MongoDB (Users & Room State)
         │
         └─── WebSocket Connection (ws://)
                     ▼
             [ Socket.io Server ]
                     ├── Handshake Auth Guard (JWT Verification)
                     ├── Room Partitioning (socket.join(roomId))
                     ├── Real-time Code Broadcast (socket.to(roomId).emit("code-change"))
                     └── Live Room Chat (socket.to(roomId).emit("receive-message"))
```

---

## 🌟 Key Features

- **Bidirectional Real-Time Editing:** Synchronizes text and code changes instantly between room participants without race conditions.
- **WebSocket Auth Handshake:** Enforces cryptographically signed JWT tokens on initial WebSocket connection before allowing room join events.
- **Sliding-Window Rate Limiting:** Backed by Redis `INCR` and `EXPIRE` primitives to prevent brute-force attacks and socket flood abuse.
- **Room Lifecycle Management:** Create passwordless UUID-based rooms, track active members, populate user profiles, and gracefully handle disconnects.
- **Background Worker Queue:** Integrated with **BullMQ** on top of Redis for asynchronous transactional notifications.
- **Multi-Container Dockerization:** One-command full-stack containerization encompassing MongoDB, Redis, Express Backend, and React Frontend.

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account & set HTTP cookie | No |
| `POST` | `/api/auth/login` | Authenticate user & return signed JWT | No |

### Room Management
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/room/create` | Create a new collaborative room with random UUID | Yes |
| `POST` | `/api/room/join` | Join an existing room by `roomId` | Yes |
| `GET` | `/api/room/:roomId` | Fetch room details, language, and members list | Yes (Rate Limited) |
| `POST` | `/api/room/leave` | Gracefully leave a room and update member list | Yes |

### System & Health
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Service health status and uptime timestamp | No |

---

## ⚡ WebSocket Events

| Event Name | Direction | Payload | Description |
| :--- | :---: | :--- | :--- |
| `join-room` | Client ➔ Server | `roomId` | Subscribes socket connection to room topic |
| `code-change` | Bidirectional | `{ roomId, code }` | Broadcasts new editor state to all peers in room |
| `send-message` | Client ➔ Server | `{ roomId, message }` | Emits chat message to room participants |
| `receive-message` | Server ➔ Client | `{ username, message }` | Delivers received message payload |

---

## 🚀 Getting Started with Docker (Recommended)

Run the entire distributed environment (MongoDB, Redis, Backend, Frontend) with a single command:

```bash
git clone https://github.com/LAKSHYA-NIGAM/CodeSync.git
cd CodeSync
docker compose up --build
```

- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:3000`
- Redis: `localhost:6380`
- MongoDB: `localhost:27017`

---

## 🛠️ Manual Local Development Setup

### 1. Backend Setup
```bash
cd Backend
npm install
# Ensure local Redis and MongoDB are running
npm run dev
```

### 2. Frontend Setup
```bash
cd ../Frontend
npm install
npm run dev
```

---

## 🧪 Automated Testing

CodeSync includes 15 automated unit and integration tests covering:
- **Room Validation & Membership**: UUID format validation, room payload verification, and duplicate member prevention.
- **Collaborative Code Diff Engine**: Line-level change computation, modification/addition tracking, and patch application.
- **Authentication**: Input sanitation and validation for registration and login credentials.
- **Rate Limiting**: Redis-backed sliding window rate limiter verification.

```bash
cd Backend
npm test
```

---

## 📄 License
This project is licensed under the ISC License.
