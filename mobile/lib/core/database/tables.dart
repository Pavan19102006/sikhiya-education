import 'package:drift/drift.dart';

// Users table
class Users extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get username => text().withLength(min: 1, max: 50)();
  TextColumn get email => text().withLength(min: 1, max: 255)();
  TextColumn get passwordHash => text().withLength(min: 1, max: 255)();
  TextColumn get fullName => text().withLength(min: 1, max: 255)();
  TextColumn get role => text().withLength(min: 1, max: 20).withDefault(const Constant('student'))();
  TextColumn get schoolId => text().withLength(min: 36, max: 36).nullable()();
  IntColumn get gradeLevel => integer().nullable()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get lastLogin => dateTime().nullable()();
  DateTimeColumn get lastSyncAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// Schools table
class Schools extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get name => text().withLength(min: 1, max: 255)();
  TextColumn get code => text().withLength(min: 1, max: 50)();
  TextColumn get address => text().nullable()();
  TextColumn get district => text().withLength(max: 100).nullable()();
  TextColumn get state => text().withLength(max: 50).withDefault(const Constant('Punjab'))();
  TextColumn get principalName => text().withLength(max: 255).nullable()();
  TextColumn get contactPhone => text().withLength(max: 20).nullable()();
  TextColumn get contactEmail => text().withLength(max: 255).nullable()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

// Subjects table
class Subjects extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get name => text().withLength(min: 1, max: 100)();
  TextColumn get namePunjabi => text().withLength(max: 100).nullable()();
  IntColumn get gradeLevel => integer()();
  TextColumn get description => text().nullable()();
  TextColumn get colorCode => text().withLength(max: 7).withDefault(const Constant('#007bff'))();
  TextColumn get iconUrl => text().withLength(max: 500).nullable()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

// Content modules table
class ContentModules extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get subjectId => text().withLength(min: 36, max: 36)();
  TextColumn get title => text().withLength(min: 1, max: 255)();
  TextColumn get titlePunjabi => text().withLength(max: 255).nullable()();
  TextColumn get description => text().nullable()();
  TextColumn get descriptionPunjabi => text().nullable()();
  IntColumn get moduleOrder => integer()();
  IntColumn get estimatedDurationMinutes => integer().withDefault(const Constant(30))();
  TextColumn get difficultyLevel => text().withLength(max: 20).withDefault(const Constant('beginner'))();
  TextColumn get thumbnailUrl => text().withLength(max: 500).nullable()();
  BoolColumn get isPublished => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get publishedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// Lessons table
class Lessons extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get moduleId => text().withLength(min: 36, max: 36)();
  TextColumn get title => text().withLength(min: 1, max: 255)();
  TextColumn get titlePunjabi => text().withLength(max: 255).nullable()();
  TextColumn get contentType => text().withLength(min: 1, max: 20)();
  IntColumn get lessonOrder => integer()();
  TextColumn get contentData => text()(); // JSON stored as text
  IntColumn get durationMinutes => integer().withDefault(const Constant(15))();
  TextColumn get videoUrl => text().withLength(max: 500).nullable()();
  IntColumn get videoDurationSeconds => integer().nullable()();
  TextColumn get thumbnailUrl => text().withLength(max: 500).nullable()();
  BoolColumn get isMandatory => boolean().withDefault(const Constant(true))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

// Quiz questions table
class QuizQuestions extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get lessonId => text().withLength(min: 36, max: 36)();
  TextColumn get questionText => text()();
  TextColumn get questionTextPunjabi => text().nullable()();
  TextColumn get questionType => text().withLength(min: 1, max: 20)();
  TextColumn get options => text().nullable()(); // JSON stored as text
  TextColumn get correctAnswer => text()();
  TextColumn get explanation => text().nullable()();
  TextColumn get explanationPunjabi => text().nullable()();
  IntColumn get points => integer().withDefault(const Constant(1))();
  IntColumn get questionOrder => integer()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

// User progress table
class UserProgress extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get userId => text().withLength(min: 36, max: 36)();
  TextColumn get lessonId => text().withLength(min: 36, max: 36)();
  TextColumn get status => text().withLength(min: 1, max: 20).withDefault(const Constant('not_started'))();
  IntColumn get progressPercentage => integer().withDefault(const Constant(0))();
  IntColumn get timeSpentSeconds => integer().withDefault(const Constant(0))();
  IntColumn get lastPositionSeconds => integer().withDefault(const Constant(0))();
  IntColumn get attemptsCount => integer().withDefault(const Constant(0))();
  IntColumn get bestScore => integer().withDefault(const Constant(0))();
  TextColumn get completionData => text().nullable()(); // JSON stored as text
  DateTimeColumn get startedAt => dateTime().nullable()();
  DateTimeColumn get completedAt => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get lastSyncAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// Quiz attempts table
class QuizAttempts extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get userId => text().withLength(min: 36, max: 36)();
  TextColumn get lessonId => text().withLength(min: 36, max: 36)();
  IntColumn get attemptNumber => integer()();
  TextColumn get answers => text()(); // JSON stored as text
  IntColumn get score => integer().withDefault(const Constant(0))();
  IntColumn get maxPossibleScore => integer()();
  IntColumn get completionTimeSeconds => integer().nullable()();
  BoolColumn get isCompleted => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get lastSyncAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// Content downloads table
class ContentDownloads extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get userId => text().withLength(min: 36, max: 36)();
  TextColumn get moduleId => text().withLength(min: 36, max: 36)();
  TextColumn get downloadStatus => text().withLength(min: 1, max: 20).withDefault(const Constant('pending'))();
  IntColumn get downloadSizeBytes => integer().withDefault(const Constant(0))();
  IntColumn get downloadProgressPercentage => integer().withDefault(const Constant(0))();
  TextColumn get filePath => text().withLength(max: 500).nullable()();
  DateTimeColumn get downloadedAt => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

// Sync logs table
class SyncLogs extends Table {
  TextColumn get id => text().withLength(min: 36, max: 36)();
  TextColumn get userId => text().withLength(min: 36, max: 36)();
  TextColumn get syncType => text().withLength(min: 1, max: 20)();
  TextColumn get direction => text().withLength(min: 1, max: 20)();
  TextColumn get status => text().withLength(min: 1, max: 20).withDefault(const Constant('in_progress'))();
  IntColumn get recordsProcessed => integer().withDefault(const Constant(0))();
  IntColumn get recordsSuccessful => integer().withDefault(const Constant(0))();
  IntColumn get recordsFailed => integer().withDefault(const Constant(0))();
  TextColumn get errorMessage => text().nullable()();
  TextColumn get syncData => text().nullable()(); // JSON stored as text
  DateTimeColumn get startedAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get completedAt => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}