# 📚 MDM Experiment - Web Development Samples

A comprehensive collection of web development projects showcasing modern technologies and best practices.

## 📁 Project Structure

```
MDM exp/
├── 1. Setup/                          # Git & Repository Setup (This folder)
├── 2. Landing Page (HTML, CSS, Bootstrap)/
│   └── index.html                    # Responsive landing page with Bootstrap
│
├── 3. To-Do List (JS + DOM)/
│   └── index.html                    # Pure JavaScript DOM manipulation with localStorage
│
├── 4. Dynamic Page + jQuery/
│   └── index.html                    # jQuery animations (fade, slide, toggle, chains)
│
├── 5. Weather App (Fetch + AJAX)/
│   └── index.html                    # Real-time weather using Fetch API
│
├── 6. PHP + MySQL CRUD/
│   ├── config.php                    # Database config & classes
│   ├── index.php                     # List & search users
│   ├── create.php                    # Add new user
│   ├── edit.php                      # Update user
│   ├── delete.php                    # Delete user
│   ├── database.sql                  # Database setup
│   └── README.md                     # Setup instructions
│
├── 7. XML + XSLT/
│   ├── books.xml                     # XML data (10 books)
│   ├── books.xsl                     # XSLT transformation template
│   └── index.html                    # Interactive demo with code viewer
│
├── 8. React Counter/
│   └── index.html                    # React hooks (useState, useEffect)
│
├── 9. Search Filter (API)/
│   └── index.html                    # Live search with JSONPlaceholder API
│
└── 10. mini_project/                 # Your mini project (coming soon)
```

## 🚀 Quick Start

### Prerequisites
- XAMPP (Apache + MySQL + PHP)
- Modern Web Browser
- Terminal/Command Line

### Running the Projects

1. **Start XAMPP**
   ```bash
   # macOS
   sudo /Applications/XAMPP/xamppfiles/bin/apachectl start
   sudo /Applications/XAMPP/xamppfiles/bin/mysql.server start
   ```

2. **Access Projects**
   ```
   http://localhost/Sample/MDM%20exp/[Project%20Name]/
   ```

## 📋 Project Descriptions

### 1️⃣ Landing Page (HTML, CSS, Bootstrap)
- Responsive design with Bootstrap framework
- Modern hero section and features
- Mobile-first approach
- Navigation and call-to-action buttons

### 2️⃣ To-Do List (Pure JavaScript)
- Add/edit/delete tasks
- Mark tasks complete
- localStorage persistence
- No frameworks - vanilla JavaScript only

### 3️⃣ Dynamic Page (jQuery)
- Hide/Show/Toggle effects
- Fade animations (fadeIn, fadeOut, fadeToggle)
- Slide animations (slideUp, slideDown, slideToggle)
- Chained and delayed animations
- Custom animation speeds

### 4️⃣ Weather App (Fetch API)
- Real-time weather data from Open-Meteo API
- Search by city name
- Display: temperature, humidity, wind, pressure
- Quick search buttons for popular cities
- Error handling and loading states

### 5️⃣ PHP CRUD User Management
- **C**reate new users
- **R**ead/display users
- **U**pdate user information
- **D**elete users
- Features:
  - Prepared statements (SQL injection prevention)
  - Input validation (email, phone, age, address)
  - Session management (30-min timeout)
  - Remember-me cookies
  - Search functionality
  - Error handling

### 6️⃣ XML + XSLT Transformation
- XML data file (10 books)
- XSLT stylesheet for HTML transformation
- Two viewing methods:
  - Direct XML opening (server-side transform)
  - Interactive demo (client-side JavaScript transform)
- Book details: title, author, price, year, genre, pages

### 7️⃣ React Counter
- React 18 from CDN
- Hooks: useState, useEffect, useRef
- Counter increment/decrement
- Statistics tracking
- Activity logging
- Browser console integration

### 8️⃣ Live Search Filter
- Fetch data from JSONPlaceholder API
- Real-time filtering as you type
- Search by: name, username, email, company
- Filter chips for company selection
- Performance metrics (search time)
- Responsive card layout

---

## 💻 Technologies Used

| Technology | Projects | Purpose |
|-----------|----------|---------|
| **HTML5** | All | Structure |
| **CSS3** | All | Styling & Animations |
| **JavaScript (ES6+)** | 3, 4, 5, 8, 9 | DOM manipulation, API calls |
| **Bootstrap** | 2 | Responsive framework |
| **jQuery** | 4 | DOM effects & animations |
| **React 18** | 8 | Component-based UI |
| **PHP** | 6 | Server-side logic |
| **MySQL** | 6 | Database |
| **XML/XSLT** | 7 | Data transformation |
| **Fetch API** | 5, 9 | Async HTTP requests |

---

## 🔒 Security Features

### PHP CRUD Project
- ✅ **Prepared Statements** - Prevent SQL injection
- ✅ **Input Validation** - Server-side validation
- ✅ **XSS Protection** - HTML entity encoding
- ✅ **Session Security** - 30-minute timeout
- ✅ **Secure Cookies** - HTTP-only flag

### JavaScript Projects
- ✅ **DOM Escaping** - Prevent XSS attacks
- ✅ **Error Handling** - Graceful degradation
- ✅ **API Validation** - Validate responses

---

## 📚 Learning Outcomes

After completing these projects, you'll understand:

1. **Frontend Fundamentals**
   - HTML semantic structure
   - CSS layouts and animations
   - Responsive design

2. **Vanilla JavaScript**
   - DOM manipulation
   - Event handling
   - localStorage API
   - Async/await
   - Fetch API

3. **Libraries & Frameworks**
   - jQuery for DOM effects
   - React hooks and state management
   - Bootstrap responsive grid

4. **Backend Development**
   - PHP server-side logic
   - MySQL database design
   - CRUD operations
   - Form validation
   - Session management

5. **Data Formats**
   - JSON handling
   - XML structure
   - XSLT transformations

6. **Version Control**
   - Git initialization
   - Branching and merging
   - Commit history

---

## 🛠️ Setup Instructions

### PHP + MySQL Project Setup

1. **Create Database**
   ```bash
   mysql -u root -p < 6.\ PHP\ +\ MySQL\ CRUD/database.sql
   ```

2. **Configure Connection** (if needed)
   - Edit: `6. PHP + MySQL CRUD/config.php`
   - Update DB credentials

3. **Access Application**
   ```
   http://localhost/Sample/MDM%20exp/6.%20PHP%20+%20MySQL%20CRUD/
   ```

### XML + XSLT Project

1. **View Direct Transformation**
   ```
   http://localhost/Sample/MDM%20exp/7.%20XML%20+%20XSLT/books.xml
   ```

2. **View Interactive Demo**
   ```
   http://localhost/Sample/MDM%20exp/7.%20XML%20+%20XSLT/index.html
   ```

---

## 📖 Git & Version Control Guide

This project is initialized as a Git repository. Here are essential commands:

### Basic Commands

```bash
# Check repository status
git status

# View commit history
git log --oneline
git log --graph --all

# Add files to staging
git add .
git add filename.txt

# Commit changes
git commit -m "Description of changes"

# View changes
git diff
git diff --staged

# Undo changes
git restore filename.txt
git restore --staged filename.txt
```

### Branching & Merging

```bash
# Create new branch
git branch feature/new-feature
git checkout -b bugfix/issue-123

# Switch branches
git checkout main
git switch develop

# List branches
git branch -a

# Merge branches
git merge feature/new-feature
git merge --no-ff bugfix/issue-123

# Delete branch
git branch -d feature/new-feature
```

### Advanced

```bash
# View branch structure
git log --graph --all --decorate --oneline

# Stash changes temporarily
git stash
git stash pop

# Rebase (alternative to merge)
git rebase main

# Cherry-pick specific commits
git cherry-pick abc123
```

---

## 🎯 Common Workflows

### Feature Development

```bash
# Create feature branch
git checkout -b feature/user-dashboard

# Make changes
git add .
git commit -m "Add user dashboard page"

# Switch back to main
git checkout main

# Merge feature
git merge feature/user-dashboard

# Clean up
git branch -d feature/user-dashboard
```

### Bug Fixing

```bash
# Create bugfix branch
git checkout -b bugfix/login-issue

# Fix the bug
git add src/auth.js
git commit -m "Fix login validation error"

# Merge to main
git checkout main
git merge bugfix/login-issue
```

### Collaboration

```bash
# Clone repository
git clone <repository-url>

# Pull latest changes
git pull origin main

# Push changes
git push origin feature/new-feature

# Create pull request (GitHub/GitLab)
# Merge after review
```

---

## 🔍 Project Statistics

| Project | Type | Technologies | Features |
|---------|------|--------------|----------|
| Landing Page | Frontend | HTML, CSS, Bootstrap | Responsive, Mobile-first |
| To-Do List | Frontend | JavaScript, DOM, localStorage | CRUD, Persistence |
| jQuery Effects | Frontend | jQuery, CSS | Animations, Effects |
| Weather App | Frontend | JavaScript, Fetch API | Real-time data |
| PHP CRUD | Full Stack | PHP, MySQL | Authentication, Validation |
| XML Transform | Data | XML, XSLT | Server & Client-side |
| React Counter | Frontend | React, Hooks | State Management |
| Search Filter | Frontend | JavaScript, API | Real-time filtering |

---

## 📝 Notes

- All projects are self-contained and can run independently
- No build tools required (except PHP/MySQL)
- Uses free public APIs (JSONPlaceholder, Open-Meteo)
- Responsive design for all screen sizes
- Modern browser features (ES6+, Fetch, LocalStorage)

---

## 🤝 Contributing

To contribute to this project:

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to repository
5. Create a pull request

---

## 📞 Support

For issues or questions:
1. Check project-specific README files
2. Review inline code comments
3. Check browser console (F12) for errors
4. Verify database setup for PHP project

---

## 📄 License

Educational project - Free to use and modify

---

## ✅ Checklist

- [x] HTML/CSS Projects
- [x] JavaScript DOM Manipulation
- [x] jQuery Animations
- [x] Fetch API Integration
- [x] PHP Backend
- [x] MySQL Database
- [x] XML/XSLT
- [x] React Hooks
- [x] Live Search
- [ ] Mini Project (Your turn!)

---

**Happy Coding! 🚀**

*Last Updated: April 14, 2026*
