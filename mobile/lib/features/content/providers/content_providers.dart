import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/content_models.dart';
import '../services/content_service.dart';

// Subjects list provider (optionally filter by grade)
final subjectsProvider = FutureProvider.family<List<SubjectDto>, int?>((ref, grade) async {
  final service = ref.watch(contentServiceProvider);
  return service.getSubjects(grade: grade);
});

// Modules list for a subject
final modulesProvider = FutureProvider.family<List<ContentModuleDto>, String>((ref, subjectId) async {
  final service = ref.watch(contentServiceProvider);
  return service.getModules(subjectId);
});

// Lessons list for a module
final lessonsProvider = FutureProvider.family<List<LessonDto>, String>((ref, moduleId) async {
  final service = ref.watch(contentServiceProvider);
  return service.getLessons(moduleId);
});
