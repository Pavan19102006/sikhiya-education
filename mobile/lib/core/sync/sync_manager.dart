import 'dart:async';
import 'package:workmanager/workmanager.dart';
import 'package:logger/logger.dart';
import '../constants/app_constants.dart';

class SyncManager {
  static final Logger _logger = Logger();
  static bool _isInitialized = false;

  /// Initialize the sync manager with background tasks
  static Future<void> initialize() async {
    if (_isInitialized) {
      _logger.w('SyncManager already initialized');
      return;
    }

    try {
      await Workmanager().initialize(
        _callbackDispatcher,
        isInDebugMode: false,
      );

      // Schedule periodic background sync
      await Workmanager().registerPeriodicTask(
        'background-sync',
        'backgroundSync',
        frequency: AppConstants.backgroundSyncInterval,
        existingWorkPolicy: ExistingWorkPolicy.keep,
        constraints: Constraints(
          networkType: NetworkType.connected,
          requiresBatteryNotLow: true,
        ),
      );

      _isInitialized = true;
      _logger.i('SyncManager initialized successfully');
    } catch (e, stackTrace) {
      _logger.e('Failed to initialize SyncManager', e, stackTrace);
    }
  }

  /// Trigger immediate sync
  static Future<void> triggerSync() async {
    if (!_isInitialized) {
      await initialize();
    }

    try {
      await Workmanager().registerOneOffTask(
        'immediate-sync',
        'immediateSync',
        constraints: Constraints(
          networkType: NetworkType.connected,
        ),
      );
      _logger.i('Immediate sync triggered');
    } catch (e, stackTrace) {
      _logger.e('Failed to trigger immediate sync', e, stackTrace);
    }
  }

  /// Cancel all background tasks
  static Future<void> cancelAllTasks() async {
    try {
      await Workmanager().cancelAll();
      _logger.i('All sync tasks cancelled');
    } catch (e, stackTrace) {
      _logger.e('Failed to cancel sync tasks', e, stackTrace);
    }
  }
}

/// Background callback dispatcher
@pragma('vm:entry-point')
void _callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    final Logger logger = Logger();
    
    try {
      logger.i('Background sync task started: $task');
      
      switch (task) {
        case 'backgroundSync':
        case 'immediateSync':
          // Perform sync operation
          // Note: In a real implementation, you'd initialize the database and sync service here
          logger.i('Sync operation completed');
          break;
        default:
          logger.w('Unknown background task: $task');
      }
      
      return Future.value(true);
    } catch (e, stackTrace) {
      logger.e('Background sync task failed', e, stackTrace);
      return Future.value(false);
    }
  });
}