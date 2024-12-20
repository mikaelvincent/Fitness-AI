# React Application

This project is a React-based web application that includes a structured layout with separate components for `Home`,
`Login`, and `NotFound` pages. The root (`/`) page is set to display the `Home` by default.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Install dependencies:**:

```bash
npm install
```

```bash
npm install react-router-dom
```

2. **Environment Configuration (Frontend)**

Duplicate the example environment configuration file:

```bash
cp .env.example .env
```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

This will launch the application, and you can access it at [http://localhost:5173](http://localhost:5173) (if using
Vite).

## Core Folder Structure

```bash
frontend/
└── src/
    ├── components/
    ├── context/
    ├── features/
    ├── hooks/
    ├── layout/
    ├── pages/
    ├── services/
    ├── utils/
    ├── App.tsx
    ├── index.css
    └── main.tsx
└── tailwind.config.cjs
```
