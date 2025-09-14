import { Response, NextFunction } from 'express';
import { getDatabase } from '../database/connection';
import { AppError, asyncHandler } from '../middleware/error-handler';
import { AuthRequest } from '../middleware/auth';

export class ContentController {
  getSubjects = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { grade } = req.query;
    const db = getDatabase();
    
    let query = 'SELECT id, name, name_punjabi, grade_level, description, color_code, icon_url FROM subjects WHERE is_active = true';
    const params: any[] = [];
    
    if (grade) {
      query += ' AND grade_level = $1';
      params.push(parseInt(grade as string));
    }
    
    query += ' ORDER BY grade_level, name';

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows.map(subject => ({
        id: subject.id,
        name: subject.name,
        namePunjabi: subject.name_punjabi,
        gradeLevel: subject.grade_level,
        description: subject.description,
        colorCode: subject.color_code,
        iconUrl: subject.icon_url,
      })),
      meta: {
        total: result.rows.length,
        gradeLevel: grade ? parseInt(grade as string) : null,
      },
    });
  });

  getModules = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { subjectId } = req.params;
    const db = getDatabase();

    const result = await db.query(
      `SELECT id, subject_id, title, title_punjabi, description, description_punjabi, 
              module_order, estimated_duration_minutes, difficulty_level, thumbnail_url
       FROM content_modules 
       WHERE subject_id = $1 AND is_published = true
       ORDER BY module_order`,
      [subjectId]
    );

    res.json({
      success: true,
      data: result.rows.map(module => ({
        id: module.id,
        subjectId: module.subject_id,
        title: module.title,
        titlePunjabi: module.title_punjabi,
        description: module.description,
        descriptionPunjabi: module.description_punjabi,
        moduleOrder: module.module_order,
        estimatedDurationMinutes: module.estimated_duration_minutes,
        difficultyLevel: module.difficulty_level,
        thumbnailUrl: module.thumbnail_url,
      })),
      meta: {
        subjectId,
        total: result.rows.length,
      },
    });
  });

  getLessons = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { moduleId } = req.params;
    const db = getDatabase();

    const result = await db.query(
      `SELECT id, module_id, title, title_punjabi, content_type, lesson_order,
              duration_minutes, video_url, video_duration_seconds, thumbnail_url, is_mandatory
       FROM lessons 
       WHERE module_id = $1
       ORDER BY lesson_order`,
      [moduleId]
    );

    const totalDuration = result.rows.reduce((sum, lesson) => sum + lesson.duration_minutes, 0);

    res.json({
      success: true,
      data: result.rows.map(lesson => ({
        id: lesson.id,
        moduleId: lesson.module_id,
        title: lesson.title,
        titlePunjabi: lesson.title_punjabi,
        contentType: lesson.content_type,
        lessonOrder: lesson.lesson_order,
        durationMinutes: lesson.duration_minutes,
        videoUrl: lesson.video_url,
        videoDurationSeconds: lesson.video_duration_seconds,
        thumbnailUrl: lesson.thumbnail_url,
        isMandatory: lesson.is_mandatory,
      })),
      meta: {
        moduleId,
        totalLessons: result.rows.length,
        totalDuration,
      },
    });
  });

  getLesson = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { lessonId } = req.params;
    const db = getDatabase();

    const result = await db.query(
      `SELECT id, module_id, title, title_punjabi, content_type, lesson_order,
              content_data, duration_minutes, video_url, video_duration_seconds, 
              thumbnail_url, is_mandatory
       FROM lessons 
       WHERE id = $1`,
      [lessonId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Lesson not found', 404));
    }

    const lesson = result.rows[0];

    // Get quiz questions if it's a quiz lesson
    let quizQuestions: any[] = [];
    if (lesson.content_type === 'quiz') {
      const questionsResult = await db.query(
        `SELECT id, question_text, question_text_punjabi, question_type, options, 
                explanation, explanation_punjabi, points, question_order
         FROM quiz_questions 
         WHERE lesson_id = $1
         ORDER BY question_order`,
        [lessonId]
      );
      
      quizQuestions = questionsResult.rows.map(q => ({
        id: q.id,
        questionText: q.question_text,
        questionTextPunjabi: q.question_text_punjabi,
        questionType: q.question_type,
        options: q.options,
        explanation: q.explanation,
        explanationPunjabi: q.explanation_punjabi,
        points: q.points,
        questionOrder: q.question_order,
      }));
    }

    res.json({
      success: true,
      data: {
        id: lesson.id,
        moduleId: lesson.module_id,
        title: lesson.title,
        titlePunjabi: lesson.title_punjabi,
        contentType: lesson.content_type,
        lessonOrder: lesson.lesson_order,
        contentData: lesson.content_data,
        durationMinutes: lesson.duration_minutes,
        videoUrl: lesson.video_url,
        videoDurationSeconds: lesson.video_duration_seconds,
        thumbnailUrl: lesson.thumbnail_url,
        isMandatory: lesson.is_mandatory,
        quizQuestions,
      },
    });
  });
}