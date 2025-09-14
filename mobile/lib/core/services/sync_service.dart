import 'package:dio/dio.dart';
import 'package:logger/logger.dart';
import '../database/database.dart';
import '../constants/app_constants.dart';

class SyncService {
  final Dio _dio;
  final AppDatabase _database;
  final Logger _logger = Logger();

  SyncService(this._dio, this._database);

  /// Perform delta synchronization with the server
  Future<SyncResult> performDeltaSync(String userId) async {
    try {
      _logger.i('Starting delta sync for user: $userId');

      // Get last sync timestamp
      final user = await _database.getUserById(userId);
      final lastSyncAt = user?.lastSyncAt;

      // Get unsynced data from local database
      final unsyncedProgress = await _database.getUnsyncedProgress(userId);
      final unsyncedQuizAttempts = await _database.getUnsyncedQuizAttempts(userId);

      // Prepare sync payload
      final syncData = {
        'lastSyncAt': lastSyncAt?.toIso8601String(),
        'progressData': unsyncedProgress.map((p) => {
          'id': p.id,
          'lessonId': p.lessonId,
          'status': p.status,
          'progressPercentage': p.progressPercentage,
          'timeSpentSeconds': p.timeSpentSeconds,
          'lastPositionSeconds': p.lastPositionSeconds,
          'completionData': p.completionData,
          'startedAt': p.startedAt?.toIso8601String(),
          'completedAt': p.completedAt?.toIso8601String(),
          'createdAt': p.createdAt.toIso8601String(),
          'updatedAt': p.updatedAt.toIso8601String(),
        }).toList(),
        'quizAttempts': unsyncedQuizAttempts.map((q) => {
          'id': q.id,
          'lessonId': q.lessonId,
          'attemptNumber': q.attemptNumber,
          'answers': q.answers,
          'score': q.score,
          'maxPossibleScore': q.maxPossibleScore,
          'completionTimeSeconds': q.completionTimeSeconds,
          'isCompleted': q.isCompleted,
          'createdAt': q.createdAt.toIso8601String(),
          'updatedAt': q.updatedAt.toIso8601String(),
        }).toList(),
      };

      // Send sync request to server
      final response = await _dio.post('/sync/delta', data: syncData);

      if (response.statusCode == 200 && response.data['success'] == true) {
        // Mark local data as synced
        await _markDataAsSynced(userId, unsyncedProgress, unsyncedQuizAttempts);

        // Process server changes if any
        final serverChanges = response.data['data']['serverChanges'];
        if (serverChanges != null) {
          await _processServerChanges(serverChanges);
        }

        _logger.i('Delta sync completed successfully');
        return SyncResult.success(
          syncedProgress: unsyncedProgress.length,
          syncedQuizAttempts: unsyncedQuizAttempts.length,
        );
      } else {
        throw Exception('Sync request failed: ${response.data}');
      }
    } on DioException catch (e) {
      _logger.e('Network error during sync: ${e.message}');
      return SyncResult.failure('Network error: ${e.message}');
    } catch (e, stackTrace) {
      _logger.e('Sync failed', e, stackTrace);
      return SyncResult.failure('Sync failed: $e');
    }
  }

  /// Mark local data as synced
  Future<void> _markDataAsSynced(
    String userId,
    List<UserProgressData> progress,
    List<QuizAttempt> quizAttempts,
  ) async {
    if (progress.isNotEmpty) {
      await _database.markProgressSynced(
        userId,
        progress.map((p) => p.id).toList(),
      );
    }

    if (quizAttempts.isNotEmpty) {
      await _database.markQuizAttemptsSynced(
        userId,
        quizAttempts.map((q) => q.id).toList(),
      );
    }
  }

  /// Process changes received from server
  Future<void> _processServerChanges(Map<String, dynamic> serverChanges) async {
    // Process content changes
    final contentChanges = serverChanges['contentChanges'] as List?;
    if (contentChanges != null && contentChanges.isNotEmpty) {
      _logger.i('Processing ${contentChanges.length} content changes from server');
      // TODO: Implement content update logic
    }

    // Process progress changes
    final progressChanges = serverChanges['progressChanges'] as List?;
    if (progressChanges != null && progressChanges.isNotEmpty) {
      _logger.i('Processing ${progressChanges.length} progress changes from server');
      // TODO: Implement progress conflict resolution
    }
  }

  /// Get sync status from server
  Future<SyncStatus> getSyncStatus() async {
    try {
      final response = await _dio.get('/sync/status');
      
      if (response.statusCode == 200 && response.data['success'] == true) {
        final data = response.data['data'];
        return SyncStatus(
          lastSyncAt: data['lastSyncAt'] != null 
              ? DateTime.parse(data['lastSyncAt']) 
              : null,
          pendingProgress: data['pendingSync']['progress'] ?? 0,
          pendingQuizAttempts: data['pendingSync']['quizAttempts'] ?? 0,
        );
      } else {
        throw Exception('Failed to get sync status');
      }
    } catch (e, stackTrace) {
      _logger.e('Failed to get sync status', e, stackTrace);
      rethrow;
    }
  }
}

class SyncResult {
  final bool isSuccess;
  final String? errorMessage;
  final int syncedProgress;
  final int syncedQuizAttempts;

  SyncResult._({
    required this.isSuccess,
    this.errorMessage,
    this.syncedProgress = 0,
    this.syncedQuizAttempts = 0,
  });

  factory SyncResult.success({
    int syncedProgress = 0,
    int syncedQuizAttempts = 0,
  }) {
    return SyncResult._(
      isSuccess: true,
      syncedProgress: syncedProgress,
      syncedQuizAttempts: syncedQuizAttempts,
    );
  }

  factory SyncResult.failure(String errorMessage) {
    return SyncResult._(
      isSuccess: false,
      errorMessage: errorMessage,
    );
  }
}

class SyncStatus {
  final DateTime? lastSyncAt;
  final int pendingProgress;
  final int pendingQuizAttempts;

  SyncStatus({
    this.lastSyncAt,
    required this.pendingProgress,
    required this.pendingQuizAttempts,
  });

  bool get hasPendingData => pendingProgress > 0 || pendingQuizAttempts > 0;
}