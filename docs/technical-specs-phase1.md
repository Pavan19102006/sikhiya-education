# Technical Specifications - Phase 1

**Project**: Sikhiya Offline - Foundation & Core Offline MVP  
**Version**: 1.0.0  
**Date**: September 13, 2025  
**Status**: In Development  

---

## Overview

Phase 1 establishes the foundational architecture for the Sikhiya Offline platform. This phase focuses on creating a functional mobile app that can load hardcoded lesson packs, allow users to complete them offline, and store progress locally. The backend will provide basic user authentication without full sync functionality.

## Database Schema Design

### Server-Side Schema (PostgreSQL)

#### Core Tables

1. **users**
   - Primary key: `id` (UUID)
   - Authentication: `username`, `email`, `password_hash`
   - Profile: `full_name`, `role`, `school_id`, `grade_level`
   - Tracking: `created_at`, `updated_at`, `last_login`, `last_sync_at`

2. **schools**
   - School management with `name`, `code`, `district`
   - Contact information for school administration
   - Punjab state default with district-level organization

3. **subjects**
   - Grade-level organization (`grade_level` field)
   - Bilingual support (`name`, `name_punjabi`)
   - Visual elements (`color_code`, `icon_url`)

4. **content_modules**
   - Hierarchical content organization under subjects
   - Ordering support (`module_order`)
   - Publishing workflow (`is_published`, `published_at`)
   - Estimated duration for planning

5. **lessons**
   - Multiple content types: video, text, interactive, quiz
   - JSONB storage for flexible content data
   - Video-specific fields for media handling
   - Sequential ordering within modules

6. **quiz_questions**
   - Multiple question types support
   - JSONB options storage for flexibility
   - Bilingual question and explanation support
   - Points-based scoring system

7. **user_progress**
   - Granular progress tracking per lesson
   - Video position tracking for resume functionality
   - Multiple attempt support with best score tracking
   - Sync timestamp for delta synchronization

8. **quiz_attempts**
   - Complete attempt history with answers
   - Performance metrics (score, completion time)
   - Sync support for offline/online consistency

### Client-Side Schema (SQLite/Drift)

#### Design Principles

1. **Denormalized for Performance**: Optimized for fast local reads
2. **Sync-Aware**: All mutable tables include `last_sync_at` timestamps
3. **UUID Consistency**: Matches server UUIDs for seamless sync
4. **JSON Storage**: Complex data stored as TEXT (JSON strings)

#### Key Differences from Server Schema

- **Text-based JSON**: SQLite JSON storage via TEXT fields
- **Simplified Constraints**: Fewer foreign key constraints for flexibility
- **Sync Metadata**: Additional sync tracking fields
- **Download Tracking**: `content_downloads` table for offline content management

## API Endpoint Specifications

### Authentication Endpoints

```typescript
// POST /api/v1/auth/login
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: UserProfile;
    tokens: {
      access: string;
      refresh: string;
    };
  };
}

// POST /api/v1/auth/register
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  schoolId?: string;
  gradeLevel?: number;
}

// POST /api/v1/auth/refresh
interface RefreshRequest {
  refreshToken: string;
}
```

### Content Endpoints

```typescript
// GET /api/v1/content/subjects?grade={gradeLevel}
interface SubjectListResponse {
  success: boolean;
  data: Subject[];
  meta: {
    total: number;
    gradeLevel: number;
  };
}

// GET /api/v1/content/modules/{subjectId}
interface ModuleListResponse {
  success: boolean;
  data: ContentModule[];
  meta: {
    subjectId: string;
    total: number;
  };
}

// GET /api/v1/content/lessons/{moduleId}
interface LessonListResponse {
  success: boolean;
  data: Lesson[];
  meta: {
    moduleId: string;
    totalLessons: number;
    totalDuration: number;
  };
}
```

### Progress Endpoints (Phase 1 Limited)

```typescript
// GET /api/v1/progress/{userId}
interface ProgressResponse {
  success: boolean;
  data: {
    overallProgress: {
      completedLessons: number;
      totalLessons: number;
      percentComplete: number;
    };
    subjectProgress: SubjectProgress[];
    recentActivity: ActivityEntry[];
  };
}

// POST /api/v1/progress
interface ProgressUpdateRequest {
  lessonId: string;
  status: 'in_progress' | 'completed';
  progressPercentage: number;
  timeSpentSeconds: number;
  lastPositionSeconds?: number;
  completionData?: any;
}
```

## Sprint Breakdown - Phase 1

### Sprint 1 (Week 1-2): Foundation Setup

**Backend Tasks:**
- [x] Project structure setup with TypeScript/Express
- [x] Database schema implementation
- [x] Basic authentication middleware (JWT)
- [x] User registration/login endpoints
- [ ] Environment configuration setup
- [ ] Basic error handling and logging

**Mobile Tasks:**
- [x] Flutter project setup with clean architecture
- [x] Drift database setup with table definitions
- [x] Riverpod state management configuration
- [ ] Basic navigation structure (GoRouter)
- [ ] Authentication screens (login/register)
- [ ] Local database initialization

**Acceptance Criteria:**
- Backend server runs and accepts requests
- Database schema is fully implemented
- User can register and login via API
- Flutter app displays login screen
- Local database creates tables successfully

### Sprint 2 (Week 3-4): Content Management Foundation

**Backend Tasks:**
- [ ] Content CRUD endpoints implementation
- [ ] File upload handling for media content
- [ ] Content serving with proper MIME types
- [ ] Basic content validation and sanitization
- [ ] Database seeding with sample content

**Mobile Tasks:**
- [ ] Content models and repositories setup
- [ ] Basic lesson player UI components
- [ ] Local content storage implementation
- [ ] Hardcoded content pack loading
- [ ] Subject and module list screens

**Acceptance Criteria:**
- API serves content with proper structure
- Mobile app displays subject list
- Users can navigate to lessons
- Basic lesson content is displayed
- Local storage saves lesson data

### Sprint 3 (Week 5-6): Offline Progress Tracking

**Backend Tasks:**
- [ ] Progress tracking endpoints
- [ ] Quiz answer validation logic
- [ ] User analytics basic queries
- [ ] Performance optimization for queries
- [ ] API documentation generation

**Mobile Tasks:**
- [ ] Progress tracking implementation
- [ ] Quiz functionality with local scoring
- [ ] Video player with position tracking
- [ ] Progress persistence to local database
- [ ] Basic progress visualization

**Acceptance Criteria:**
- Users can complete lessons and quizzes offline
- Progress is saved locally and persists
- Video playback resumes from last position
- Quiz scores are calculated correctly
- Progress is visible in the app interface

## Architecture Decisions

### Mobile Application Architecture

```
lib/
├── core/                    # Core infrastructure
│   ├── constants/           # App-wide constants
│   ├── database/            # Drift database setup
│   ├── error/               # Error handling
│   ├── network/             # HTTP client setup
│   ├── services/            # Core services
│   └── utils/               # Utility functions
├── features/                # Feature modules
│   ├── authentication/      # Login/register
│   ├── content/             # Content browsing
│   ├── lessons/             # Lesson player
│   └── progress/            # Progress tracking
└── shared/                  # Shared components
    ├── models/              # Data models
    └── widgets/             # Reusable widgets
```

### State Management Strategy

**Riverpod Providers:**
- `authProvider`: User authentication state
- `contentProvider`: Content loading and caching
- `progressProvider`: Progress tracking state
- `databaseProvider`: Database instance management

### Data Flow

1. **Authentication Flow**: JWT tokens stored securely, user state managed globally
2. **Content Flow**: Server content cached locally, hardcoded packs in Phase 1
3. **Progress Flow**: Local-first storage, sync preparation for Phase 2

## Security Considerations

### Phase 1 Security Measures

1. **Authentication**: JWT with secure secret keys
2. **Data Validation**: Input validation on all endpoints
3. **SQL Injection Prevention**: Parameterized queries only
4. **File Upload Security**: Type validation and size limits
5. **CORS Configuration**: Restricted origins for API access

### Mobile Security

1. **Local Storage**: SQLite database with app sandbox protection
2. **Network Security**: HTTPS only for production
3. **Token Storage**: Secure storage using platform keychain
4. **Input Validation**: Client-side validation with server verification

## Performance Requirements

### Mobile Performance Targets

- **App Launch Time**: < 3 seconds on low-end Android
- **Lesson Loading**: < 2 seconds for cached content
- **Database Queries**: < 100ms for common operations
- **Memory Usage**: < 200MB on average usage
- **Storage Efficiency**: < 100MB per subject module

### Backend Performance Targets

- **API Response Time**: < 500ms for data endpoints
- **Authentication**: < 200ms for login/register
- **File Serving**: Streaming support for large videos
- **Database Performance**: Indexed queries < 100ms
- **Concurrent Users**: Support 100+ simultaneous connections

## Testing Strategy

### Backend Testing
- **Unit Tests**: Service layer and utility functions
- **Integration Tests**: API endpoints with database
- **Performance Tests**: Load testing with realistic data
- **Security Tests**: Authentication and authorization

### Mobile Testing
- **Unit Tests**: Business logic and utilities
- **Widget Tests**: UI components and interactions
- **Integration Tests**: Full user flows
- **Platform Tests**: Android and iOS compatibility

## Deployment Plan

### Development Environment
- **Local Development**: Docker Compose for full stack
- **Database**: PostgreSQL container with seed data
- **Backend**: Hot-reload development server
- **Mobile**: Flutter hot-reload with emulators

### Phase 1 Deployment Goals
- **Demo-Ready**: Functional offline app with hardcoded content
- **Testing Infrastructure**: Automated test execution
- **Documentation**: Complete setup and usage guides
- **Performance Baseline**: Metrics collection for future phases

## Risk Assessment & Mitigation

### Technical Risks

1. **Flutter Performance on Low-End Devices**
   - *Mitigation*: Early testing on budget Android devices
   - *Monitoring*: Performance profiling throughout development

2. **Database Schema Changes**
   - *Mitigation*: Migration system design from Phase 1
   - *Planning*: Schema versioning strategy

3. **Content Storage Limitations**
   - *Mitigation*: Compression and optimization pipeline
   - *Testing*: Storage usage monitoring and limits

### Project Risks

1. **Timeline Pressure**
   - *Mitigation*: Prioritized feature development
   - *Flexibility*: Scope adjustment based on progress

2. **Technology Learning Curve**
   - *Mitigation*: Documentation and knowledge sharing
   - *Support*: Technical mentoring resources

## Success Metrics

### Phase 1 Success Criteria

1. **Functional App**: Complete offline lesson consumption
2. **Performance**: Meets target response times on test devices
3. **Stability**: No critical bugs in core functionality
4. **User Experience**: Intuitive navigation and interactions
5. **Code Quality**: >80% test coverage, clean architecture
6. **Documentation**: Complete setup and development guides

### Key Performance Indicators

- Lesson completion rate in offline mode: >90%
- App crash rate: <1% of sessions
- User registration success rate: >95%
- Content loading success rate: >98%

---

**Next Steps**: Upon completion of Phase 1, detailed specifications for Phase 2 (Synchronization & Content Pipeline) will be developed based on lessons learned and feedback from initial testing.