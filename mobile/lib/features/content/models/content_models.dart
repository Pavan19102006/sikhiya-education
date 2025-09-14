import 'package:json_annotation/json_annotation.dart';

part 'content_models.g.dart';

@JsonSerializable()
class SubjectDto {
  final String id;
  final String name;
  final String? namePunjabi;
  final int gradeLevel;
  final String? description;
  final String? colorCode;
  final String? iconUrl;

  SubjectDto({
    required this.id,
    required this.name,
    this.namePunjabi,
    required this.gradeLevel,
    this.description,
    this.colorCode,
    this.iconUrl,
  });

  factory SubjectDto.fromJson(Map<String, dynamic> json) => _$SubjectDtoFromJson(json);
  Map<String, dynamic> toJson() => _$SubjectDtoToJson(this);
}

@JsonSerializable()
class ContentModuleDto {
  final String id;
  final String subjectId;
  final String title;
  final String? titlePunjabi;
  final String? description;
  final String? descriptionPunjabi;
  final int moduleOrder;
  final int estimatedDurationMinutes;
  final String difficultyLevel;
  final String? thumbnailUrl;

  ContentModuleDto({
    required this.id,
    required this.subjectId,
    required this.title,
    this.titlePunjabi,
    this.description,
    this.descriptionPunjabi,
    required this.moduleOrder,
    required this.estimatedDurationMinutes,
    required this.difficultyLevel,
    this.thumbnailUrl,
  });

  factory ContentModuleDto.fromJson(Map<String, dynamic> json) => _$ContentModuleDtoFromJson(json);
  Map<String, dynamic> toJson() => _$ContentModuleDtoToJson(this);
}

@JsonSerializable()
class LessonDto {
  final String id;
  final String moduleId;
  final String title;
  final String? titlePunjabi;
  final String contentType;
  final int lessonOrder;
  final int durationMinutes;
  final String? videoUrl;
  final int? videoDurationSeconds;
  final String? thumbnailUrl;
  final bool isMandatory;

  LessonDto({
    required this.id,
    required this.moduleId,
    required this.title,
    this.titlePunjabi,
    required this.contentType,
    required this.lessonOrder,
    required this.durationMinutes,
    this.videoUrl,
    this.videoDurationSeconds,
    this.thumbnailUrl,
    required this.isMandatory,
  });

  factory LessonDto.fromJson(Map<String, dynamic> json) => _$LessonDtoFromJson(json);
  Map<String, dynamic> toJson() => _$LessonDtoToJson(this);
}
