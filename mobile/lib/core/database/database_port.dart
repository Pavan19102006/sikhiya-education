// Simple web-friendly database provider stub for DI
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Use conditional import/actual implementation on mobile
class AppDatabase {}

// Simple interface to save/clear auth user locally (no-op on web)
abstract class AuthLocalStore {
  Future<void> saveUser(Map<String, dynamic> userData);
  Future<void> clearUserData(String userId);
}

class NoopAuthLocalStore implements AuthLocalStore {
  @override
  Future<void> clearUserData(String userId) async {}

  @override
  Future<void> saveUser(Map<String, dynamic> userData) async {}
}

final databaseProvider = Provider<AppDatabase>((ref) {
  throw UnimplementedError('Database provider not available on web');
});

final authLocalStoreProvider = Provider<AuthLocalStore>((ref) {
  // On web, return no-op; on mobile, override this provider with real impl
  return NoopAuthLocalStore();
});
