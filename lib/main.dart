import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/dashboard.dart';
import 'screens/gallery.dart';
import 'screens/profile.dart';
import 'providers/image_provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => PixabayImageProvider(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  MyAppState createState() => MyAppState();
}

class MyAppState extends State<MyApp> {
  ThemeMode _themeMode = ThemeMode.system;

  void _toggleTheme(bool isDark) {
    setState(() {
      _themeMode = isDark ? ThemeMode.dark : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pixabay Dashboard',
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      themeMode: _themeMode,
      initialRoute: '/dashboard',
      routes: {
        '/dashboard': (context) => Scaffold(
          appBar: AppBar(
            title: const Text('Pixabay Dashboard'),
            actions: [
              IconButton(
                icon: Icon(
                  _themeMode == ThemeMode.dark
                      ? Icons.light_mode
                      : Icons.dark_mode,
                ),
                onPressed: () => _toggleTheme(_themeMode == ThemeMode.dark),
              ),
            ],
          ),
          body: const DashboardScreen(),
        ),
        '/gallery': (context) => Scaffold(
          appBar: AppBar(
            title: const Text('Pixabay Dashboard'),
            actions: [
              IconButton(
                icon: Icon(
                  _themeMode == ThemeMode.dark
                      ? Icons.light_mode
                      : Icons.dark_mode,
                ),
                onPressed: () => _toggleTheme(_themeMode == ThemeMode.dark),
              ),
            ],
          ),
          body: const GalleryScreen(),
        ),
        '/profile': (context) => Scaffold(
          appBar: AppBar(
            title: const Text('Pixabay Dashboard'),
            actions: [
              IconButton(
                icon: Icon(
                  _themeMode == ThemeMode.dark
                      ? Icons.light_mode
                      : Icons.dark_mode,
                ),
                onPressed: () => _toggleTheme(_themeMode == ThemeMode.dark),
              ),
            ],
          ),
          body: const ProfileScreen(),
        ),
      },
    );
  }
}
