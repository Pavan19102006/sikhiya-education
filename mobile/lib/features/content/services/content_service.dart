import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../../core/network/api_client.dart';
import '../models/content_models.dart';

class ContentService {
  final ApiClient _api;
  ContentService(this._api);

  Future<List<SubjectDto>> getSubjects({int? grade}) async {
    final Response res = await _api.dio.get('/content/subjects', queryParameters: {
      if (grade != null) 'grade': grade,
    });

    if (res.statusCode == 200 && res.data['success'] == true) {
      final List list = res.data['data'];
      return list.map((j) => SubjectDto.fromJson(j)).toList();
    }
    throw Exception('Failed to load subjects');
  }

  Future<List<ContentModuleDto>> getModules(String subjectId) async {
    final Response res = await _api.dio.get('/content/modules/$subjectId');
    if (res.statusCode == 200 && res.data['success'] == true) {
      final List list = res.data['data'];
      return list.map((j) => ContentModuleDto.fromJson(j)).toList();
    }
    throw Exception('Failed to load modules');
  }

  Future<List<LessonDto>> getLessons(String moduleId) async {
    final Response res = await _api.dio.get('/content/lessons/$moduleId');
    if (res.statusCode == 200 && res.data['success'] == true) {
      final List list = res.data['data'];
      return list.map((j) => LessonDto.fromJson(j)).toList();
    }
    throw Exception('Failed to load lessons');
  }
}

final contentServiceProvider = Provider<ContentService>((ref) {
  final api = ref.watch(apiClientProvider);
  return ContentService(api);
});