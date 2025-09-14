import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/content_providers.dart';

class SubjectsScreen extends ConsumerWidget {
  const SubjectsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Subjects'),
        actions: [
          IconButton(
            icon: const Icon(Icons.sync),
            onPressed: () {
              // TODO: Trigger sync
            },
          ),
        ],
      ),
      body: Consumer(
        builder: (context, ref, _) {
          final asyncSubjects = ref.watch(subjectsProvider(null));
          return asyncSubjects.when(
            data: (subjects) {
              if (subjects.isEmpty) {
                return const Center(child: Text('No subjects available'));
              }
              return ListView.separated(
                itemCount: subjects.length,
                separatorBuilder: (_, __) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final s = subjects[index];
                  return ListTile(
                    leading: const Icon(Icons.book_outlined),
                    title: Text(s.name),
                    subtitle: s.namePunjabi != null ? Text(s.namePunjabi!) : null,
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => context.go('/modules/${s.id}'),
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