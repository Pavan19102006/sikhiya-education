import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../../core/database/database_port.dart';
import 'package:flutter/foundation.dart';
import '../../../core/network/api_client.dart';

// Auth state model
class AuthUser {
  final String id;
  final String username;
  final String email;
  final String? fullName;
  final String role;
  final String? schoolId;
  final int? gradeLevel;

  AuthUser({
    required this.id,
    required this.username,
    required this.email,
    this.fullName,
    required this.role,
    this.schoolId,
    this.gradeLevel,
  });

  factory AuthUser.fromMap(Map<String, dynamic> m) => AuthUser(
        id: m['id'] as String,
        username: m['username'] as String,
        email: m['email'] as String,
        fullName: m['fullName'] as String?,
        role: m['role'] as String,
        schoolId: m['schoolId'] as String?,
        gradeLevel: (m['gradeLevel'] as num?)?.toInt(),
      );
}

class AuthState {
  final bool isAuthenticated;
  final AuthUser? user;
  final bool isLoading;
  final String? errorMessage;

  const AuthState({
    this.isAuthenticated = false,
    this.user,
    this.isLoading = false,
    this.errorMessage,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    User? user,
    bool? isLoading,
    String? errorMessage,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}

// Auth provider
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthLocalStore _localStore;
  final ApiClient _api;
  final TokenStorage _tokenStorage;

  AuthNotifier(this._localStore, this._api, this._tokenStorage) : super(const AuthState()) {
    _checkAuthStatus();
  }

  // Check if user is already logged in
  Future<void> _checkAuthStatus() async {
    // For now, just set to not authenticated
    // In a real app, you'd check for stored tokens/credentials
    state = const AuthState(isAuthenticated: false);
  }

  // Login user
  Future<void> login(String username, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final response = await _api.dio.post(
        '/auth/login',
        data: {
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final userData = response.data['data']['user'];
        final tokens = response.data['data']['tokens'];

        // Persist tokens
        await _tokenStorage.saveTokens(
          access: tokens['access'],
          refresh: tokens['refresh'],
        );

        // Store user data locally (no-op on web)
        await _localStore.saveUser(userData as Map<String, dynamic>);

        state = state.copyWith(
          isAuthenticated: true,
          user: AuthUser.fromMap(userData as Map<String, dynamic>),
          isLoading: false,
        );
      } else {
        throw Exception(response.data['error'] ?? 'Login failed');
      }
    } on DioException catch (e) {
      String errorMessage = 'Network error occurred';
      if (e.response?.data != null) {
        errorMessage = e.response!.data['error'] ?? errorMessage;
      }
      state = state.copyWith(
        isLoading: false,
        errorMessage: errorMessage,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  // Register user
  Future<void> register({
    required String username,
    required String email,
    required String password,
    required String fullName,
    String? schoolId,
    int? gradeLevel,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final response = await _api.dio.post(
        '/auth/register',
        data: {
          'username': username,
          'email': email,
          'password': password,
          'fullName': fullName,
          'schoolId': schoolId,
          'gradeLevel': gradeLevel,
        },
      );

      if (response.statusCode == 201 && response.data['success'] == true) {
        final userData = response.data['data']['user'];
        final tokens = response.data['data']['tokens'];

        // Persist tokens
        await _tokenStorage.saveTokens(
          access: tokens['access'],
          refresh: tokens['refresh'],
        );

        // Store user data locally (no-op on web)
        await _localStore.saveUser(userData as Map<String, dynamic>);

        state = state.copyWith(
          isAuthenticated: true,
          user: AuthUser.fromMap(userData as Map<String, dynamic>),
          isLoading: false,
        );
      } else {
        throw Exception(response.data['error'] ?? 'Registration failed');
      }
    } on DioException catch (e) {
      String errorMessage = 'Network error occurred';
      if (e.response?.data != null) {
        errorMessage = e.response!.data['error'] ?? errorMessage;
      }
      state = state.copyWith(
        isLoading: false,
        errorMessage: errorMessage,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  // Logout user
  Future<void> logout() async {
    try {
      await _api.dio.post('/auth/logout');
    } catch (e) {
      // Continue with logout even if server request fails
    }

    // Clear local user data
    if (state.user != null) {
      await _localStore.clearUserData(state.user!.id);
    }

    // Clear tokens
    await _tokenStorage.clear();

    state = const AuthState(isAuthenticated: false);
  }

  // Clear error message
  void clearError() {
    state = state.copyWith(errorMessage: null);
  }
}

// Provider setup
// Api client provider moved to core/network/api_client.dart

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final localStore = ref.watch(authLocalStoreProvider);
  final api = ref.watch(apiClientProvider);
  final tokenStorage = ref.watch(tokenStorageProvider);
  return AuthNotifier(localStore, api, tokenStorage);
});
