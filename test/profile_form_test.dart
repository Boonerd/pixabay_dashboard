import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pixabay_dashboard/screens/profile.dart';
import 'package:provider/provider.dart';
import 'package:pixabay_dashboard/providers/image_provider.dart'; // Fixed import

void main() {
  testWidgets('Profile form validation test', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => PixabayImageProvider(),
        child: const MaterialApp(home: ProfileScreen()),
      ),
    );

    expect(find.byType(TextFormField), findsNWidgets(4));
    expect(find.byType(DropdownButton), findsOneWidget);
    expect(find.text('Submit'), findsOneWidget);

    await tester.tap(find.text('Submit'));
    await tester.pump();
    expect(find.text('Please fill all fields'), findsOneWidget);

    await tester.enterText(find.byType(TextFormField).at(0), 'John Doe');
    await tester.enterText(find.byType(TextFormField).at(1), 'invalid-email');
    await tester.enterText(find.byType(TextFormField).at(3), 'password123');
    await tester.enterText(find.byType(TextFormField).at(4), 'password123');
    await tester.tap(find.text('Submit'));
    await tester.pump();
    expect(find.text('Invalid email format'), findsOneWidget);

    await tester.enterText(
      find.byType(TextFormField).at(1),
      'john@example.com',
    );
    await tester.enterText(find.byType(TextFormField).at(3), 'password123');
    await tester.enterText(find.byType(TextFormField).at(4), 'mismatch');
    await tester.tap(find.text('Submit'));
    await tester.pump();
    expect(find.text('Passwords do not match'), findsOneWidget);

    await tester.enterText(find.byType(TextFormField).at(0), 'John Doe');
    await tester.enterText(
      find.byType(TextFormField).at(1),
      'john@example.com',
    );
    await tester.tap(find.byType(DropdownButton).first);
    await tester.pump();
    await tester.tap(find.text('Nature').first);
    await tester.pump();
    await tester.enterText(find.byType(TextFormField).at(3), 'password123');
    await tester.enterText(find.byType(TextFormField).at(4), 'password123');
    await tester.tap(find.text('Submit'));
    await tester.pump();
    expect(find.text('Success! ID: 101'), findsOneWidget);
  });
}
