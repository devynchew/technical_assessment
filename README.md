# Smart CSV Viewer (Technical Assessment)

A full-stack web application designed to efficiently upload, parse, and visualize large CSV datasets. Built with a 3-tier architecture using React, Node.js and PostgreSQL, fully containerized with Docker.

## Tech Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS
- Axios

**Backend:**
- Node.js & Express
- Prisma ORM (PostgreSQL)
- Multer (File Handling)
- Zod (Validation)
- CSV-Parser (Streaming)

**DevOps & Testing:**
- Docker & Docker Compose
- Vitest (Frontend Testing)
- Supertest & Jest (Backend Integration Testing)

---

## Prerequisites

- **Docker Desktop** (Make sure it is running)
- **Node.js 18+** (If running locally without Docker)

---

## Getting Started

The entire application (Frontend, Backend, Database) is containerized.

1. **Clone the repository**
    ```bash
    git clone https://github.com/devynchew/technical_assessment.git
    cd technical_assessment

2. **Start the application**
    ```bash
    docker-compose up --build

3. **Access the App**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Database: Runs on port 5432 internally.

## Running Tests

1. **Frontend Tests (Vitest)**
    ```bash
    cd frontend
    npm install
    npm test

2. **Backend Tests (Vitest)**
    ```bash
    cd backend
    npm install
    npm test

## Project Structure

```text
technical_assessment/
├── backend/                  # Node.js API (Port 3000)
│   ├── prisma/               # Database Schema & Migrations
│   ├── src/
│   │   ├── controllers/      # Business Logic (Upload, Search)
│   │   ├── routes/           # API Route Definitions
│   │   └── index.ts          # Server Entry Point
│   ├── __tests__/            # Backend Integration Tests
│   ├── Dockerfile
│   ├── jest.config.js        # Jest Testing Configuration
│   ├── package.json
│   └── tsconfig.json         # TypeScript Configuration
│
├── frontend/                 # React Application (Port 5173)
│   ├── public/               # Static assets (images, favicon)
│   ├── src/
│   │   ├── components/       # Reusable UI (HighlightText, FileUpload)
│   │   ├── test/             # Test Setup (setup.ts)
│   │   ├── App.tsx           # Main Dashboard Logic
│   │   ├── App.test.tsx      # Integration Tests
│   │   ├── index.css         # Global Styles (Tailwind directives)
│   │   └── main.tsx          # React DOM Entry Point
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts        # Vite & Vitest Configuration
│
├── docker-compose.yml        # Orchestration config for App + DB
├── .gitignore                # Git ignore rules
└── README.md                 # Project Documentation

