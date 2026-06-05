# Tech Market

Tech Market is a modern marketplace platform that connects **Hirers** and **Developers** to collaborate on technology projects. Hirers can post projects, discover talented developers, and manage project requirements, while developers can showcase their skills, find opportunities, and communicate with clients in real time.

The platform is built using **Next.js**, **Node.js**, **Socket.IO**, **MongoDB**, **Mongoose**, **TypeScript**, **Zod**, and **Cloudinary**.

---

# 🚀 Features

## Authentication & User Management

* Secure authentication and authorization
* Hirer and Developer roles
* User profile management
* Shared user model across services

## Marketplace

* Create and manage project listings
* Discover technology projects
* Connect hirers with developers
* Project collaboration workflow

## Real-Time Communication

* Instant messaging using Socket.IO
* Dedicated live communication server
* Real-time user interactions

## File Management

* Upload images and project-related files
* Cloudinary-powered cloud storage
* Optimized media delivery

## Validation & Type Safety

* End-to-end TypeScript support
* Schema validation with Zod
* Strongly typed shared models

---

# 🛠 Tech Stack

| Category                  | Technology                    |
| ------------------------- | ----------------------------- |
| Main Application          | Next.js                       |
| Live Communication Server | Node.js + Express + Socket.IO |
| Language                  | TypeScript                    |
| Database                  | MongoDB                       |
| ODM                       | Mongoose                      |
| Validation                | Zod                           |
| File Storage              | Cloudinary                    |

---

# 🏗 Architecture

```text
Users
   │
   ▼
Next.js Application
   │
   ├── UI & Pages
   ├── Server Actions
   ├── API Routes
   ├── Authentication
   └── Database Operations
   │
   ▼
MongoDB

Users
   │
   ▼
Socket.IO Client
   │
   ▼
Node.js Live Backend
   │
   ▼
Socket.IO Server

Shared Package
   ├── User Model
   ├── Types
   ├── Schemas
   └── Shared Utilities
```

---

# 📂 Project Structure

```text
tech-market/
│
├── nextjs-app/
│   ├── src/
│   ├── public/
│   ├── app/
│   ├── components/
│   ├── actions/
│   ├── lib/
│   └── package.json
│
├── node-live-backend/
│   ├── src/
│   ├── sockets/
│   ├── controllers/
│   ├── services/
│   └── package.json
│
├── shared/
│   ├── models/
│   │   └── User.ts
│   ├── types/
│   ├── schemas/
│   └── package.json
│
└── README.md
```

---

# 🔄 Monorepo Structure

The project follows a monorepo architecture consisting of three applications/packages:

### Next.js App

The primary application responsible for:

* User interface
* Authentication
* API routes
* Business logic
* Database interactions

### Node Live Backend

A dedicated server responsible for:

* Socket.IO connections
* Real-time messaging
* Presence tracking
* Live communication features

### Shared Package

Contains reusable code shared across both services:

* Mongoose models
* TypeScript types
* Zod schemas
* Shared utilities

This ensures consistency and prevents duplication between the Next.js application and the live backend.

---

# ☁️ Cloudinary

Cloudinary is used for:

* Image uploads
* Project attachments
* Media optimization
* Secure cloud storage

---

# 🗄 Database

MongoDB serves as the primary database, while Mongoose provides schema modeling and database access.

Stored data includes:

* Users
* Projects
* Conversations
* Messages
* Applications
* Uploaded files metadata

---

# ▶️ Getting Started

Install dependencies for each package:

```bash
npm install
```

Run the Next.js application:

```bash
cd nextjs-app
npm run dev
```

Run the live backend:

```bash
cd node-live-backend
npm run dev
```

---

# 🎯 Future Enhancements

* Video and voice calling
* Team collaboration spaces
* Payment integration
* Reviews and ratings
* Project milestones
* AI-powered developer recommendations

---

# 📄 License

This project is licensed under the MIT License.
