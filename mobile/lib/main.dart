import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'core/constants/app_constants.dart';
import 'core/database/database_port.dart';
import 'core/sync/sync_manager.dart';
import 'shared/widgets/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize database and background sync (skip DB init on web)
  AppDatabase? database;
  if (!kIsWeb) {
    database = AppDatabase();
    await SyncManager.initialize();
  }
  
  runApp(
    ProviderScope(
      overrides: [
        if (database != null) databaseProvider.overrideWithValue(database),
      ],
      child: const SikhiyaOfflineApp(),
    ),
  );
}

class SikhiyaOfflineApp extends ConsumerWidget {
  const SikhiyaOfflineApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    
    return MaterialApp.router(
      title: AppConstants.appName,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'Roboto',
        useMaterial3: true,
      ),
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', 'US'),
        Locale('pa', 'IN'), // Punjabi
      ],
      routerConfig: router,
    );
  }
}