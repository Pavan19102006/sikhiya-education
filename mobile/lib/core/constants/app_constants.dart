class AppConstants {
  // App Info
  static const String appName = 'Sikhiya Offline';
  static const String appVersion = '1.0.0';
  
  // API Configuration
  static const String baseUrl = 'http://localhost:3001/api/v1';
  static const Duration apiTimeout = Duration(seconds: 30);
  
  // Database Configuration
  static const String databaseName = 'sikhiya_offline.db';
  static const int databaseVersion = 1;
  
  // Sync Configuration
  static const Duration syncInterval = Duration(hours: 6);
  static const Duration backgroundSyncInterval = Duration(minutes: 30);
  static const int maxRetryAttempts = 3;
  static const Duration retryDelay = Duration(seconds: 5);
  
  // Storage Limits
  static const int maxVideoQuality = 720;
  static const int maxContentSizeBytes = 100 * 1024 * 1024; // 100MB
  static const int maxCacheSize = 500 * 1024 * 1024; // 500MB
  
  // UI Constants
  static const Duration animationDuration = Duration(milliseconds: 300);
  static const double defaultPadding = 16.0;
  static const double defaultBorderRadius = 8.0;
  
  // Content Types
  static const List<String> supportedVideoFormats = ['mp4', 'mov', 'avi'];
  static const List<String> supportedImageFormats = ['jpg', 'jpeg', 'png', 'webp'];
  static const List<String> supportedAudioFormats = ['mp3', 'wav', 'm4a'];
  
  // Error Messages
  static const String networkErrorMessage = 'No internet connection available';
  static const String syncErrorMessage = 'Failed to sync data';
  static const String storageErrorMessage = 'Insufficient storage space';
}