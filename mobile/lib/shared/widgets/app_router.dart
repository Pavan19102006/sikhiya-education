import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/authentication/screens/login_screen.dart';
import '../../features/authentication/screens/register_screen.dart';
import '../../features/content/screens/subjects_screen.dart';
import '../../features/content/screens/modules_screen.dart';
import '../../features/content/screens/lessons_screen.dart';
import '../../features/lessons/screens/lesson_player_screen.dart';
import '../../features/authentication/providers/auth_provider.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);
  
  return GoRouter(
    initialLocation: authState.isAuthenticated ? '/subjects' : '/login',
    routes: [
      // Authentication routes
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      
      // Main app routes
      GoRoute(
        path: '/subjects',
        name: 'subjects',
        builder: (context, state) => const SubjectsScreen(),
      ),
      GoRoute(
        path: '/modules/:subjectId',
        name: 'modules',
        builder: (context, state) {
          final subjectId = state.pathParameters['subjectId']!;
          return ModulesScreen(subjectId: subjectId);
        },
      ),
      GoRoute(
        path: '/lessons/:moduleId',
        name: 'lessons',
        builder: (context, state) {
          final moduleId = state.pathParameters['moduleId']!;
          return LessonsScreen(moduleId: moduleId);
        },
      ),
      GoRoute(
        path: '/lesson/:lessonId',
        name: 'lesson',
        builder: (context, state) {
          final lessonId = state.pathParameters['lessonId']!;
          return LessonPlayerScreen(lessonId: lessonId);
        },
      ),
    ],
    redirect: (context, state) {
      final isAuthenticated = authState.isAuthenticated;
      final isLoggingIn = state.subloc == '/login' || state.subloc == '/register';
      
      // If not authenticated and not on auth pages, redirect to login
      if (!isAuthenticated && !isLoggingIn) {
        return '/login';
      }
      
      // If authenticated and on auth pages, redirect to subjects
      if (isAuthenticated && isLoggingIn) {
        return '/subjects';
      }
      
      // No redirect needed
      return null;
    },
  );
});