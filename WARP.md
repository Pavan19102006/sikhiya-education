# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Sikhiya Offline is an **offline-first educational platform** for rural schools in Punjab. The core principle is that the application operates primarily disconnected, treating internet connection as a transient resource for synchronization only.

### Architecture

- **Mobile**: Flutter 3.10+ with Drift (SQLite) for offline storage, Riverpod for state management
- **Backend**: Node.js + Express + TypeScript with PostgreSQL
- **Deployment**: Docker Compose for development, containerized for production
- **Synchronization**: Delta sync engine for offline/online data consistency

## Quick Development Setup

### Using the setup script (recommended):
```bash
./scripts/setup-dev.sh
```

### Manual setup:
```bash
# Start backend and database
docker-compose up -d

# Setup mobile (if Flutter is installed locally)
cd mobile
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
flutter run
```

## Common Development Commands

### Backend Commands
```bash
cd backend

# Development server with hot reload
npm run dev

# Database operations
npm run db:migrate
npm run db:seed  
npm run db:reset

# Testing and quality
npm test
npm run test:coverage
npm run lint
npm run lint:fix

# Build
npm run build
npm start
```

### Mobile Commands
```bash
cd mobile

# Get dependencies and generate code
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs

# Run on different platforms
flutter run -d android
flutter run -d ios
flutter run -d chrome  # PWA

# Testing
flutter test
flutter test --coverage

# Code quality
flutter analyze
flutter format .

# Build releases
flutter build apk --release
flutter build web --release
```

### Docker Commands
```bash
# View all service logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Clean rebuild
docker-compose down -v && docker-compose up --build

# Database shell access
docker-compose exec postgres psql -U sikhiya_user -d sikhiya_offline
```

## Key Architecture Concepts

### Offline-First Design
- **Local Storage**: SQLite (Drift) is the source of truth for mobile app
- **Sync Strategy**: Delta synchronization with `last_sync_at` timestamps
- **Conflict Resolution**: Last Write Wins (LWW) strategy
- **Background Sync**: Opportunistic synchronization when connected

### Database Architecture
- **Server**: PostgreSQL with JSONB for flexible content data
- **Client**: SQLite with TEXT-based JSON storage for complex data
- **Sync Metadata**: All mutable tables include sync tracking fields
- **UUID Consistency**: UUIDs match between server and client for seamless sync

### Flutter App Structure
```
lib/
├── core/                    # Core infrastructure
│   ├── database/           # Drift database (tables.dart, database.dart)
│   ├── network/            # HTTP client and API services
│   ├── services/           # Core business services
│   └── sync/               # Synchronization engine
├── features/               # Feature modules by domain
│   ├── authentication/     # Login/register flows
│   ├── content/           # Content browsing and management
│   ├── lessons/           # Lesson player and interaction
│   └── progress/          # Progress tracking and analytics
└── shared/                # Shared UI components and models
```

### State Management (Riverpod)
Key providers to understand:
- `databaseProvider`: Database instance management
- `authProvider`: User authentication state
- `contentProvider`: Content loading and caching
- `progressProvider`: Offline progress tracking

## Testing Strategy

### Backend Testing
```bash
npm test                    # All tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

### Mobile Testing
```bash
flutter test                # Unit and widget tests
flutter test --coverage     # Generate coverage
flutter test integration_test/  # Integration tests
```

## Development Environment

### Services (via Docker Compose)
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432 (sikhiya_user/sikhiya_password)
- **pgAdmin**: http://localhost:5050 (admin@sikhiya.local/admin123)
- **Redis**: localhost:6379 (for future caching)

### Environment Configuration
- Backend config: `backend/.env` (copy from `.env.example`)
- Database: Auto-configured via Docker Compose
- Mobile: No environment setup needed for basic development

## Code Generation

### Mobile (required after schema changes)
```bash
cd mobile
flutter pub run build_runner build --delete-conflicting-outputs
```

This generates:
- Drift database code from table definitions
- Riverpod provider code
- JSON serialization code

## Database Operations

### Adding New Tables
1. Add table definition in `mobile/lib/core/database/tables.dart`
2. Update `@DriftDatabase` annotation in `database.dart`
3. Run code generation: `flutter pub run build_runner build`
4. Add corresponding PostgreSQL migration in backend

### Schema Migrations
Backend migrations are manual SQL files. Mobile uses Drift's migration system.

## Content Development

### Adding New Lesson Content
Content is stored as JSON in the `lessons` table with `content_type` field:
- `video`: Video lessons with resume capability
- `text`: Text-based lessons with rich content
- `interactive`: Interactive content (games, simulations)
- `quiz`: Quiz lessons with multiple question types

### Bilingual Support
- All user-facing content has `_punjabi` variants
- Language switching handled at the UI level
- Content API serves both languages simultaneously

## Performance Considerations

### Mobile Targets
- App launch: <3s on low-end Android
- Lesson loading: <2s for cached content
- Database queries: <100ms
- Memory usage: <200MB average

### Offline Storage
- ~100MB per subject module
- Compressed media delivery
- Background content downloads
- Intelligent cache management

## Project Phases

Currently in **Phase 1** (Foundation & Core Offline MVP):
- ✅ Basic project structure and database schemas
- ✅ Core Flutter app with offline storage  
- ✅ Basic Node.js API with authentication
- 🔄 Hardcoded lesson pack loading (in progress)
- 🔄 Local progress storage (in progress)

**Phase 2** will add full synchronization and content pipeline.

## Common Troubleshooting

### Database Issues
```bash
# Reset database completely
docker-compose down -v
docker-compose up -d postgres
# Wait, then restart backend
docker-compose up -d backend
```

### Flutter Code Generation Issues
```bash
cd mobile
flutter clean
flutter pub get
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs
```

### Backend API Issues
```bash
# Check backend logs
docker-compose logs backend

# Verify database connection
docker-compose exec backend npm run db:migrate
```