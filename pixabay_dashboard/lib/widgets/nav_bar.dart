import 'package:flutter/material.dart';

class ResponsiveNavBar extends StatelessWidget {
  const ResponsiveNavBar({super.key}); // Add 'const' here

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth > 600) {
          return NavigationRail(
            destinations: const [
              NavigationRailDestination(
                icon: Icon(Icons.dashboard),
                label: Text('Dashboard'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.image),
                label: Text('Gallery'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.person),
                label: Text('Profile'),
              ),
            ],
            selectedIndex: 0,
            onDestinationSelected: (index) {
              Navigator.pushNamed(
                context,
                ['/dashboard', '/gallery', '/profile'][index],
              );
            },
          );
        } else {
          return Drawer(
            child: ListView(
              children: [
                ListTile(
                  title: const Text('Dashboard'),
                  onTap: () => Navigator.pushNamed(context, '/dashboard'),
                ),
                ListTile(
                  title: const Text('Gallery'),
                  onTap: () => Navigator.pushNamed(context, '/gallery'),
                ),
                ListTile(
                  title: const Text('Profile'),
                  onTap: () => Navigator.pushNamed(context, '/profile'),
                ),
              ],
            ),
          );
        }
      },
    );
  }
}
