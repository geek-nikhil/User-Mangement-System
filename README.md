# Interview-Ready Machine Test Project

This is a full-stack application built to demonstrate **Clean Architecture**, **Scalability**, and **Performance Optimization**.

## 🚀 Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Custom JWT (Access Tokens stored in Frontend) + Bcrypt
- **Optimization**: SQL Indexing, RPC Functions, React `useMemo`/`useCallback`

---

## 📂 Project Structure
The project follows a **Layered Architecture** to separate concerns:

```
/backend
  /src
    /config       # DB & JWT Config
    /controllers  # Request Handling (Validation -> Service -> Response)
    /services     # Business Logic & DB Interactions
    /routes       # API Routes
    /middleware   # Auth, Role, Error Handling
    /utils        # Reusable helpers (Hash, Response)
```

**Why this structure?**
> "I separated Controllers from Services because **Controllers** should only handle HTTP concerns (request parsing, validation), while **Services** contain the core business logic. This makes the code testable and reusable."

---

## ⚡ Key Features & Explanations

### 1. Authentication (JWT + RBAC)
- **Flow**: User logs in -> Server verifies credentials -> Signs JWT -> Returns Token.
- **Security**: Passwords are hashed using `bcrypt` (Salt rounds = 10).
- **Middleware**: 
  - `auth.middleware.js`: Verifies token signature.
  - `role.middleware.js`: Checks if user has required role (Admin).

### 2. Product Management (Filtering & Sorting)
- Implemented Server-side pagination and filtering.
- **Why?** "Fetching all data at once kills performance. I used database-level filtering (WHERE clauses) to only retrieve what's needed."

### 3. Performance Task (100k Transactions)
- **Problem**: Calculating total revenue from 100k rows in Node.js loop is slow and memory-intensive.
- **Solution**: I used a **Supabase RPC (Postgres Function)** to perform aggregation (`SUM`, `COUNT`) directly in the database.
- **Result**: < 50ms query time vs seconds in JS.

### 4. Frontend Optimizations
- **`useCallback`**: Wrapped `fetchProducts` to prevent function recreation on re-renders.
- **`useMemo`** (in filtered lists if client-side): Prevents expensive recalculations.
- **Context API**: Managed Global Auth State to avoid Prop Drilling.

---

## 🛠️ Setup Instructions

### 1. Backend
1. `cd backend`
2. `npm install`
3. Create `.env` file:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   ```
4. `npm start` (Runs on port 5000)

### 2. Database
1. Run the `schema.sql` (found in `/backend`) in Supabase SQL Editor to create tables and functions.

### 3. Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on localhost:3000)

---

## 🎤 Interview Cheatsheet
- **Why Node.js?** Non-blocking I/O, great for handling concurrent API requests.
- **Why Supabase?** Provides Postgres power with easy API, plus we can write raw SQL/RPC when needed.
- **Why Next.js?** SEO friendly, better performance with App Router/Server Components (though we used Client Components for interactivity here).
