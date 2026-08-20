# 🏫 EduERP — Premium School Admin Panel

A modern, full-featured **School ERP Admin Panel** built with React 19, Vite, and Tailwind CSS. Enterprise-grade UI with dark mode, animations, and complete CRUD modules.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/aayuptechnologies010-blip/ERP-SchoolAdmin)

---

## ✨ Features

| Module | Status |
|--------|--------|
| 🔐 Login / Auth with guards | ✅ |
| 📊 Dashboard (Charts, Stats, Activity) | ✅ |
| 🎓 Students — List, Add, Edit, Promote | ✅ |
| 👨‍🏫 Teachers — List, Add, Edit | ✅ |
| 👷 Staff — List, Add, Edit | ✅ |
| 📋 Attendance Marking | ✅ |
| 💰 Fee Collection + Receipt | ✅ |
| 📝 Exam Scheduling | ✅ |
| 🗓️ Interactive Timetable | ✅ |
| 📚 Library Management | ✅ |
| 📈 Reports & Analytics | ✅ |
| ⚙️ Settings (6 tabs) | ✅ |
| 👤 My Profile | ✅ |
| 🌙 Dark Mode | ✅ |
| 📱 Responsive Design | ✅ |

---

## 🚀 Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v3** — Custom design tokens
- **React Router DOM v7** — Lazy-loaded routes
- **Framer Motion** — Page transitions & animations
- **Recharts** — Dashboard charts
- **React Hook Form + Yup** — Form validation
- **SweetAlert2** — Confirmation dialogs
- **React Toastify** — Toast notifications
- **Day.js** — Date formatting
- **React Helmet Async** — SEO meta tags
- **React Icons** — Icon library

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#2563EB` |
| Secondary | `#14B8A6` |
| Accent | `#F59E0B` |
| Success | `#22C55E` |
| Danger | `#EF4444` |
| Fonts | Inter + Plus Jakarta Sans |

---

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Demo Login:**
```
Email:    admin@eduerp.com
Password: admin123
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/       # DataTable, PageHeader, Modal, Tabs
│   └── ui/           # Button, Input, Card, Avatar, Badge...
├── context/          # AuthContext, ThemeContext
├── data/             # Mock data (students, teachers, fees...)
├── hooks/            # useSidebar, useTable, useDebounce
├── layouts/          # MainLayout, Sidebar, Navbar
├── pages/            # All module pages
├── routes/           # AppRouter, Auth guards
└── utils/            # dialog, notify, helpers
```

---

## 🌐 Deploy to Vercel

This project includes a `vercel.json` config for SPA routing.

1. Push to GitHub (done ✅)
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import `ERP-SchoolAdmin` repository
4. Framework: **Vite** (auto-detected)
5. Click **Deploy** 🚀

---

## 📄 License

MIT © 2024 EduERP
