import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/app_constants.dart';

class TokenStorage {
  static const _keyAccess = 'access_token';
  static const _keyRefresh = 'refresh_token';

  final FlutterSecureStorage _storage;
  TokenStorage(this._storage);

  Future<void> saveTokens({required String access, required String refresh}) async {
    await _storage.write(key: _keyAccess, value: access);
    await _storage.write(key: _keyRefresh, value: refresh);
  }

  Future<String?> getAccessToken() => _storage.read(key: _keyAccess);
  Future<String?> getRefreshToken() => _storage.read(key: _keyRefresh);

  Future<void> clear() async {
    await _storage.delete(key: _keyAccess);
    await _storage.delete(key: _keyRefresh);
  }
}

class ApiClient {
  final Dio dio;
  final TokenStorage tokenStorage;

  ApiClient(this.dio, this.tokenStorage) {
    dio.options
      ..baseUrl = AppConstants.baseUrl
      ..connectTimeout = AppConstants.apiTimeout
      ..receiveTimeout = AppConstants.apiTimeout;

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await tokenStorage.getAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
    ));
  }
}

final tokenStorageProvider = Provider<TokenStorage>((ref) {
  const storage = FlutterSecureStorage();
  return TokenStorage(storage);
});

final apiClientProvider = Provider<ApiClient>((ref) {
  final dio = Dio();
  final tokenStorage = ref.watch(tokenStorageProvider);
  return ApiClient(dio, tokenStorage);
});