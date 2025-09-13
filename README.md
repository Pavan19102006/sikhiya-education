# Sikhiya Offline

**An Offline-First Educational Platform for Rural Schools in Punjab**

---

## 🎯 Mission Statement

Sikhiya Offline is designed to bridge the digital divide for rural schools in Nabha, Punjab, by providing equitable access to quality education. Our platform overcomes infrastructure limitations like poor internet connectivity and low-spec hardware through a flawlessly executed offline-first architecture.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Project Overview

### Core Principle: Offline-First Architecture

This application is architected as **offline-first**, not "offline-compatible." The application's default state of operation is disconnected. Internet connection is treated as a transient resource for data synchronization only.

### Key Features

- **📱 Cross-Platform Mobile & Web App**: Flutter-based with PWA capabilities
- **🔄 Resilient Delta Sync**: Only syncs changes since last connection
- **🎯 Punjabi Language Support**: Bilingual content (English/Punjabi)
- **📊 Teacher Dashboard**: Web-based analytics and progress tracking
- **💾 Offline Storage**: Complete lessons, videos, and quizzes available offline
- **🔧 Low-Spec Hardware Optimized**: Runs smoothly on budget Android devices

## 🏗️ Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Flutter App   │    │  Node.js API    │    │   PostgreSQL    │
│   (Offline-First│◄──►│   (Express)     │◄──►│   Database      │
│   SQLite/Drift) │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                  │
                       ┌─────────────────┐
                       │ Teacher Web     │
                       │ Dashboard       │
                       │ (React/Vue)     │
                       └─────────────────┘
```

### Synchronization Engine

- **Delta Sync**: Only transfers changes since last successful connection
- **Background Processing**: Opportunistic sync using native background capabilities
- **Conflict Resolution**: Last Write Wins (LWW) strategy
- **Data Integrity**: Local data is source of truth until successfully synced

## 🛠️ Tech Stack

### Mobile & Web Client
- **Framework**: Flutter 3.10+
- **State Management**: Riverpod
- **Local Database**: Drift (SQLite)
- **HTTP Client**: Dio
- **Background Tasks**: WorkManager

### Backend API
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 14+
- **Authentication**: JWT
- **File Processing**: Sharp (images), FFmpeg (videos)

### Development Tools
- **Version Control**: Git with GitFlow
- **Testing**: Jest (Backend), Flutter Test (Mobile)
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, Very Good Analysis

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **Flutter** 3.10.0 or higher
- **PostgreSQL** 14.0 or higher
- **Git** 2.30 or higher

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sikhiya-offline
   ```

2. **Set up the backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

3. **Set up the mobile app**
   ```bash
   cd ../mobile
   flutter pub get
   flutter pub run build_runner build
   flutter run
   ```

4. **Access the application**
   - Backend API: http://localhost:3000
   - Mobile app: Run on emulator or physical device

## 💻 Development Setup

### Environment Setup

#### Backend Environment Variables
Copy `backend/.env.example` to `backend/.env` and configure:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/sikhiya_offline

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

#### Database Setup

1. **Create database**
   ```sql
   CREATE DATABASE sikhiya_offline;
   ```

2. **Run migrations**
   ```bash
   cd backend
   npm run db:migrate
   ```

3. **Seed with sample data**
   ```bash
   npm run db:seed
   ```

### Development Commands

#### Backend
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Database operations
npm run db:migrate
npm run db:seed
npm run db:reset
```

#### Mobile
```bash
# Install dependencies
flutter pub get

# Generate code (Drift, Riverpod)
flutter pub run build_runner build --delete-conflicting-outputs

# Run on different platforms
flutter run -d android
flutter run -d ios
flutter run -d chrome  # PWA

# Build for release
flutter build apk --release
flutter build web --release
```

## 📁 Project Structure

```
sikhiya-offline/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── database/        # DB connection & migrations
│   │   └── utils/           # Helper functions
│   ├── config/              # Configuration files
│   └── tests/               # Backend tests
├── mobile/                  # Flutter application
│   ├── lib/
│   │   ├── core/            # Core functionality
│   │   │   ├── constants/   # App constants
│   │   │   ├── database/    # Local database (Drift)
│   │   │   ├── network/     # HTTP client setup
│   │   │   ├── services/    # Core services
│   │   │   └── sync/        # Synchronization engine
│   │   ├── features/        # Feature modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── content/     # Content management
│   │   │   ├── lessons/     # Lesson player
│   │   │   └── progress/    # Progress tracking
│   │   └── shared/          # Shared components
│   └── test/                # Flutter tests
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
└── deployment/              # Docker & K8s configs
```

## ✨ Features

### For Students
- ✅ Download entire subject modules for offline use
- ✅ Interactive lessons in Punjabi and English
- ✅ Video lessons with resume capability
- ✅ Offline quizzes with instant feedback
- ✅ Progress tracking without internet
- ✅ Automatic sync when connected

### For Teachers
- ✅ Web-based progress dashboard
- ✅ Student analytics and reports
- ✅ Content management interface
- ✅ Real-time sync status monitoring
- ✅ Bulk content distribution

### System Features
- ✅ Offline-first architecture
- ✅ Delta synchronization
- ✅ Background sync processing
- ✅ Compressed media delivery
- ✅ Multi-language support
- ✅ Progressive Web App (PWA)

## 📋 Development Phases

### Phase 1: Foundation & Core Offline MVP ✅
- [x] Basic project structure
- [x] Database schemas (PostgreSQL + SQLite)
- [x] Core Flutter app with offline storage
- [x] Basic Node.js API with authentication
- [ ] Hardcoded lesson pack loading
- [ ] Local progress storage

### Phase 2: Synchronization & Content Pipeline
- [ ] Full background delta synchronization engine
- [ ] Backend admin panel for content management
- [ ] Content pack download functionality
- [ ] Progress upload functionality

### Phase 3: Teacher Dashboard & Pilot Deployment
- [ ] Web-based teacher dashboard
- [ ] Student progress analytics
- [ ] Pilot deployment to 2-3 schools
- [ ] Performance optimization

### Phase 4: Analytics, Refinement & Scale
- [ ] Basic analytics integration
- [ ] User feedback collection
- [ ] Security hardening
- [ ] Full-scale rollout preparation

## 📖 API Documentation

API documentation is available at `/docs/api.md` when running the development server.

### Key Endpoints

```
Authentication:
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh

Content:
GET    /api/v1/content/subjects
GET    /api/v1/content/modules/:subjectId
GET    /api/v1/content/lessons/:moduleId

Progress:
GET    /api/v1/progress/:userId
POST   /api/v1/progress
PUT    /api/v1/progress/:progressId

Sync:
POST   /api/v1/sync/delta
GET    /api/v1/sync/status/:userId
```

## 🚀 Deployment

### Production Deployment

1. **Build the applications**
   ```bash
   # Backend
   cd backend && npm run build
   
   # Mobile
   cd mobile && flutter build web --release
   cd mobile && flutter build apk --release
   ```

2. **Deploy using Docker**
   ```bash
   docker-compose up -d
   ```

3. **Deploy to cloud providers**
   - Backend: Heroku, DigitalOcean, AWS
   - Database: PostgreSQL on cloud providers
   - Mobile: Google Play Store, direct APK distribution

### Environment Requirements

- **Server**: 2GB RAM, 1 CPU core minimum
- **Database**: PostgreSQL 14+ with 10GB storage
- **CDN**: For static asset delivery (optional)

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch** from `develop`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Write tests** for new functionality
5. **Submit a pull request** to `develop` branch

### Coding Standards

- **TypeScript**: Use strict mode, prefer interfaces over types
- **Flutter**: Follow Effective Dart guidelines
- **Testing**: Maintain >80% code coverage
- **Commits**: Use conventional commit format

### Code Review Process

- All PRs require at least one code review
- Automated tests must pass
- Performance impact assessment required

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Rural schools in Nabha, Punjab for inspiration
- Open source community for excellent tools
- Education technology researchers for guidance

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Use GitHub Discussions for questions

---

**Built with ❤️ for education equity in rural Punjab**