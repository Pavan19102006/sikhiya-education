import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/content_providers.dart';

class LessonsScreen extends ConsumerWidget {
  final String moduleId;
  
  const LessonsScreen({super.key, required this.moduleId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lessons'),
      ),
      body: Consumer(
        builder: (context, ref, _) {
          final asyncLessons = ref.watch(lessonsProvider(moduleId));
          return asyncLessons.when(
            data: (lessons) {
              if (lessons.isEmpty) {
                return const Center(child: Text('No lessons available'));
              }
              return ListView.separated(
                itemCount: lessons.length,
                separatorBuilder: (_, __) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final l = lessons[index];
                  return ListTile(
                    leading: const Icon(Icons.play_lesson_outlined),
                    title: Text(l.title),
                    subtitle: Text('${l.contentType} • ${l.durationMinutes} min'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => context.go('/lesson/${l.id}'),
                  );
                },
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (err, st) => Center(child: Text('Error: $err')),
          );
        },
      ),
    );
  }
}