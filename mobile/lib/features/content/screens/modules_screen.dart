import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/content_providers.dart';

class ModulesScreen extends ConsumerWidget {
  final String subjectId;
  
  const ModulesScreen({super.key, required this.subjectId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Modules'),
      ),
      body: Consumer(
        builder: (context, ref, _) {
          final asyncModules = ref.watch(modulesProvider(subjectId));
          return asyncModules.when(
            data: (modules) {
              if (modules.isEmpty) {
                return const Center(child: Text('No modules available'));
              }
              return ListView.separated(
                itemCount: modules.length,
                separatorBuilder: (_, __) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final m = modules[index];
                  return ListTile(
                    leading: const Icon(Icons.folder_outlined),
                    title: Text(m.title),
                    subtitle: m.titlePunjabi != null ? Text(m.titlePunjabi!) : null,
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => context.go('/lessons/${m.id}'),
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