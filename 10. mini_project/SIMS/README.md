# Smart Inquiry Management System (SIMS)

SIMS is a polished, SaaS-style inquiry and ticket management application built with React, Tailwind CSS, Framer Motion, PHP, and MySQL. It includes a dedicated user portal, a separate admin portal, dark mode, protected routes, toast notifications, ticket filtering, priority tracking, an activity timeline, and email notifications.

## Highlights

- Separate user and admin experiences
- Context-based authentication flow
- Light and dark mode with persistence
- Debounced search plus status and priority filters
- Priority-aware ticket queue with audit timeline
- Animated, responsive UI with Framer Motion
- Modular service, layout, and context structure
- PHP API layer with JSON responses and role-aware guards
- `.env`-based SMTP email configuration

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Context API
- Framer Motion

### Backend
- PHP modular APIs
- MySQL / MariaDB
- Native SMTP email delivery
- `.env` configuration loader

## Project Structure

```text
frontend/src/
├── components/
├── context/
├── hooks/
├── layouts/
├── pages/
├── services/
└── App.jsx

backend/
├── .env
├── config/
│   └── env.php
├── services/
│   └── MailService.php
├── database.sql
└── api/
    ├── db.php
    ├── login.php
    ├── register.php
    ├── create_inquiry.php
    ├── get_user_tickets.php
    ├── get_all_tickets.php
    ├── get_ticket_details.php
    └── update_ticket.php
```

## Local Setup

### 1. MySQL
Start MySQL from XAMPP.

Optional manual import:
```powershell
cmd /c "C:\xampp\mysql\bin\mysql.exe -u root < backend\database.sql"
```

Note: the backend can also bootstrap the core schema and admin seed automatically when the APIs are first hit.

### 2. Backend Email Config
Edit [backend/.env](backend/.env) with your Gmail SMTP values:

```ini
SIMS_MAIL_TRANSPORT=smtp
SIMS_SMTP_HOST=smtp.gmail.com
SIMS_SMTP_PORT=587
SIMS_SMTP_ENCRYPTION=tls
SIMS_SMTP_USERNAME=your-email@gmail.com
SIMS_SMTP_PASSWORD=your-app-password
SIMS_SMTP_FROM_EMAIL=your-email@gmail.com
SIMS_SMTP_FROM_NAME=SIMS Notifications
```

For Gmail, use a Google App Password, not your normal Gmail password.

### 3. Backend
Use XAMPP PHP because it includes `mysqli`:

```powershell
C:\xampp\php\php.exe -S localhost:8000 -t backend
```

### 4. Frontend
```powershell
cd frontend
npm install
npm run dev
```

## Email Behavior

- `create_inquiry.php` sends a “Your inquiry has been received” email with the ticket ID.
- `update_ticket.php` sends an email when the ticket status changes.
- If email delivery fails, the API still returns success and the error is logged to `backend/mail_logs/mail.log`.

## Security Notes

- `.env` is ignored by Git through [.gitignore](.gitignore).
- Keep real Gmail credentials only in `backend/.env` on your machine.
- Do not commit app passwords to GitHub.

## URLs

- User portal: `http://localhost:5173/`
- User login: `http://localhost:5173/login`
- Admin login: `http://localhost:5173/admin/login`
- PHP API base: `http://localhost:8000/api`

## Demo Admin Credentials

- Email: `admin@sims.local`
- Password: `admin123`

## Notes

- If login fails, confirm MySQL is running in XAMPP and start the backend with `C:\xampp\php\php.exe`, not another PHP installation.
- Update `backend/api/db.php` if your MySQL username or password differs from the XAMPP defaults.
- Restart the backend server after changing `backend/.env`.