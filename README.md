# 🤱 आमा शिशु सेवा (Aama Shishu Sewa)

### Professional Postpartum Care Platform - Bridging Tradition and Modern Healthcare

[![React](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-rose.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Aama Shishu Sewa** is Nepal's premier digital platform connecting new mothers with certified postpartum caregivers ("Sutkeri Susare"), massage therapists, and wellness experts. We seamlessly blend ancient Nepali traditions with modern clinical safety standards to provide comprehensive maternal and infant care.

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Available Scripts](#-available-scripts)
- [Core Functionality](#-core-functionality)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Key Features

### For Families
- 🌐 **Bilingual Platform** - Complete Nepali and English localization
- 📅 **Smart Booking System** - Easy service booking with Nwaran ceremony scheduling
- 👥 **Professional Matching** - AI-powered caregiver matching based on needs
- ⭐ **Rating & Reviews** - Transparent professional leaderboard system
- 📱 **WhatsApp Integration** - Quick inquiry and communication

### For Professionals
- 💼 **Career Portal** - Streamlined application process for caregivers
- 📊 **Dashboard** - Professional dashboard for booking management
- 🏆 **Performance Tracking** - Rating and leaderboard system
- 📋 **Profile Management** - Complete profile and availability control

### Platform Features
- 🔐 **Secure Authentication** - JWT-based auth with Supabase
- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS
- 🔔 **Notification System** - Email notifications via SendGrid/Nodemailer
- 🤖 **AI Integration** - OpenAI-powered care plan recommendations
- 🛡️ **Security First** - Helmet.js, CORS, input validation
- 📱 **Mobile Responsive** - Mobile-first design approach

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2 with Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **Routing**: React Router DOM 7.12
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Database**: Supabase Client

### Backend
- **Runtime**: Node.js with Express 5.2
- **Authentication**: JWT + bcrypt.js
- **Database**: Supabase (PostgreSQL)
- **Email**: SendGrid + Nodemailer
- **AI**: OpenAI API
- **Security**: Helmet, CORS, Express Validator
- **Logging**: Morgan

### DevOps
- **Development**: Nodemon, Vite Dev Server
- **Code Quality**: ESLint
- **Deployment**: Vercel (Frontend)

---

## 📁 Project Structure

```
AamaShishuSewa/
├── client/                    # Frontend React Application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── admin/       # Admin-specific components
│   │   │   ├── booking/     # Booking flow components
│   │   │   └── common/      # Shared UI components
│   │   ├── pages/           # Route pages
│   │   │   └── employee/    # Employee dashboard
│   │   ├── layout/          # Layout components
│   │   ├── context/         # React Context (Auth, Language)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── constants/       # Translation constants
│   │   ├── translations/    # i18n files
│   │   └── utils/           # Utilities, API, validators
│   ├── public/              # Static assets
│   └── package.json
│
├── server/                   # Backend Node.js/Express API
│   └── src/
│       ├── routes/          # API route definitions
│       │   ├── auth.js      # Authentication routes
│       │   ├── bookings.js  # Booking management
│       │   ├── professionals.js
│       │   └── ai.js        # AI care plans
│       ├── controllers/     # Route controllers
│       ├── middleware/      # Auth, error handling
│       ├── services/        # Business logic
│       │   ├── carePlanService.js
│       │   ├── matchingService.js
│       │   └── notificationService.js
│       ├── config/          # Configuration files
│       └── utils/           # Helper functions
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** or **yarn**
- **Supabase** account
- **OpenAI API** key (optional, for AI features)
- **SendGrid** API key (optional, for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/aama-shishu-sewa.git
   cd aama-shishu-sewa
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

---

## 🔧 Environment Setup

### Client Environment Variables
Create a `.env` file in the `client/` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

### Server Environment Variables
Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@aamashishu.com

# Email Service (Nodemailer - Alternative)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Client URL
CLIENT_URL=http://localhost:5173
```

---

## 📜 Available Scripts

### Frontend (client/)
```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend (server/)
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

---

## 💡 Core Functionality

### User Roles
1. **Families/Clients** - Book services, view professionals, manage bookings
2. **Professionals** - Apply for jobs, manage availability, view bookings
3. **Admin** - Manage bookings, professionals, and platform operations
4. **Employees** - Track performance and manage profile

### Main Pages
- **Home** (`/`) - Hero section, features, FAQs
- **Services** (`/services`) - Service packages with pricing
- **Book Service** (`/book`) - Multi-step booking flow
- **Leaderboard** (`/leaderboard`) - Top-rated professionals
- **Careers** (`/careers`) - Job openings
- **Join Us** (`/join_us`) - Professional application form
- **Dashboard** (`/dashboard`) - User/Admin dashboard
- **Employee Dashboard** (`/employee/dashboard`) - Professional portal
- **Login/Register** - Authentication pages

### Service Packages
- **Postpartum Care** (7-45 days)
- **Traditional Massage** (Maalish)
- **Nwaran Ritual Assistance**

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password recovery

### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Professionals
- `GET /api/professionals` - Get all professionals
- `POST /api/professionals` - Create professional profile
- `GET /api/professionals/:id` - Get professional details
- `PUT /api/professionals/:id` - Update professional

### AI Services
- `POST /api/ai/care-plan` - Generate personalized care plan

### Health Check
- `GET /health` - API health status

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Contact

**Aama Shishu Sewa Team**

📍 Lazimpat, Kathmandu, Nepal  
📞 +977 9764651355  
📧 info@aamashishu.com  
🌐 www.aamashishu.com  

---

<div align="center">

**© 2026 आमा शिशु सेवा**  
*Crafted with ❤️ for the mothers of Nepal*

**150+ Happy Families | 30+ Certified Professionals**

</div>