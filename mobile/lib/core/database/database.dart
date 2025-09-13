import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:sqlite3_flutter_libs/sqlite3_flutter_libs.dart';
import 'package:sqlite3/sqlite3.dart';

import 'tables.dart';

part 'database.g.dart';

@DriftDatabase(tables: [
  Users,
  Schools,
  Subjects,
  ContentModules,
  Lessons,
  QuizQuestions,
  UserProgress,
  QuizAttempts,
  ContentDownloads,
  SyncLogs,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
        // Handle database upgrades here
      },
    );
  }

  // User methods
  Future<List<User>> getAllUsers() => select(users).get();
  
  Future<User?> getUserById(String id) =>
      (select(users)..where((tbl) => tbl.id.equals(id))).getSingleOrNull();
  
  Future<User?> getUserByUsername(String username) =>
      (select(users)..where((tbl) => tbl.username.equals(username))).getSingleOrNull();
  
  Future<int> insertUser(UsersCompanion user) => into(users).insert(user);
  
  Future<bool> updateUser(User user) => update(users).replace(user);

  // Content methods
  Future<List<Subject>> getSubjectsByGrade(int gradeLevel) =>
      (select(subjects)..where((tbl) => tbl.gradeLevel.equals(gradeLevel))).get();
  
  Future<List<ContentModule>> getModulesBySubject(String subjectId) =>
      (select(contentModules)..where((tbl) => tbl.subjectId.equals(subjectId))
        ..orderBy([(tbl) => OrderingTerm.asc(tbl.moduleOrder)])).get();
  
  Future<List<Lesson>> getLessonsByModule(String moduleId) =>
      (select(lessons)..where((tbl) => tbl.moduleId.equals(moduleId))
        ..orderBy([(tbl) => OrderingTerm.asc(tbl.lessonOrder)])).get();

  // Progress methods
  Future<UserProgressData?> getUserProgress(String userId, String lessonId) =>
      (select(userProgress)..where((tbl) => 
        tbl.userId.equals(userId) & tbl.lessonId.equals(lessonId))).getSingleOrNull();
  
  Future<List<UserProgressData>> getUserProgressForModule(String userId, String moduleId) {
    final query = select(userProgress).join([
      innerJoin(lessons, lessons.id.equalsExp(userProgress.lessonId)),
    ])..where(lessons.moduleId.equals(moduleId) & userProgress.userId.equals(userId));
    
    return query.map((row) => row.readTable(userProgress)).get();
  }
  
  Future<int> insertOrUpdateProgress(UserProgressCompanion progress) =>
      into(userProgress).insertOnConflictUpdate(progress);

  // Quiz methods
  Future<List<QuizQuestion>> getQuizQuestions(String lessonId) =>
      (select(quizQuestions)..where((tbl) => tbl.lessonId.equals(lessonId))
        ..orderBy([(tbl) => OrderingTerm.asc(tbl.questionOrder)])).get();
  
  Future<int> insertQuizAttempt(QuizAttemptsCompanion attempt) =>
      into(quizAttempts).insert(attempt);
  
  Future<List<QuizAttempt>> getUserQuizAttempts(String userId, String lessonId) =>
      (select(quizAttempts)..where((tbl) => 
        tbl.userId.equals(userId) & tbl.lessonId.equals(lessonId))
        ..orderBy([(tbl) => OrderingTerm.desc(tbl.createdAt)])).get();

  // Download methods
  Future<List<ContentDownload>> getUserDownloads(String userId) =>
      (select(contentDownloads)..where((tbl) => tbl.userId.equals(userId))).get();
  
  Future<int> insertOrUpdateDownload(ContentDownloadsCompanion download) =>
      into(contentDownloads).insertOnConflictUpdate(download);

  // Sync methods
  Future<List<UserProgressData>> getUnsyncedProgress(String userId) =>
      (select(userProgress)..where((tbl) => 
        tbl.userId.equals(userId) & 
        tbl.lastSyncAt.isNull() | 
        tbl.updatedAt.isBiggerThanExp(tbl.lastSyncAt))).get();
  
  Future<List<QuizAttempt>> getUnsyncedQuizAttempts(String userId) =>
      (select(quizAttempts)..where((tbl) => 
        tbl.userId.equals(userId) & 
        tbl.lastSyncAt.isNull() | 
        tbl.updatedAt.isBiggerThanExp(tbl.lastSyncAt))).get();
  
  Future<void> markProgressSynced(String userId, List<String> progressIds) {
    return batch((batch) {
      for (final id in progressIds) {
        batch.update(
          userProgress,
          UserProgressCompanion(
            lastSyncAt: Value(DateTime.now()),
          ),
          where: (tbl) => tbl.id.equals(id) & tbl.userId.equals(userId),
        );
      }
    });
  }
  
  Future<void> markQuizAttemptsSynced(String userId, List<String> attemptIds) {
    return batch((batch) {
      for (final id in attemptIds) {
        batch.update(
          quizAttempts,
          QuizAttemptsCompanion(
            lastSyncAt: Value(DateTime.now()),
          ),
          where: (tbl) => tbl.id.equals(id) & tbl.userId.equals(userId),
        );
      }
    });
  }

  // Cleanup methods
  Future<void> clearUserData(String userId) {
    return transaction(() async {
      await (delete(userProgress)..where((tbl) => tbl.userId.equals(userId))).go();
      await (delete(quizAttempts)..where((tbl) => tbl.userId.equals(userId))).go();
      await (delete(contentDownloads)..where((tbl) => tbl.userId.equals(userId))).go();
      await (delete(syncLogs)..where((tbl) => tbl.userId.equals(userId))).go();
    });
  }
  
  Future<void> clearAllData() {
    return transaction(() async {
      await delete(userProgress).go();
      await delete(quizAttempts).go();
      await delete(contentDownloads).go();
      await delete(syncLogs).go();
      await delete(quizQuestions).go();
      await delete(lessons).go();
      await delete(contentModules).go();
      await delete(subjects).go();
      await delete(schools).go();
      await delete(users).go();
    });
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'sikhiya_offline.db'));

    if (Platform.isAndroid) {
      await applyWorkaroundToOpenSqlite3OnOldAndroidVersions();
    }

    final cachebase = (await getTemporaryDirectory()).path;
    sqlite3.tempDirectory = cachebase;

    return NativeDatabase.createInBackground(file);
  });
}

// Provider for dependency injection
final databaseProvider = Provider<AppDatabase>((ref) {
  throw UnimplementedError('Database provider not overridden');
});