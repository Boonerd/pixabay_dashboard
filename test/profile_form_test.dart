import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pixabay_dashboard/screens/profile.dart';

void main() {
  testWidgets('Profile form validation test', (WidgetTester tester) async {
    await tester.pumpWidget(MaterialApp(home: ProfileScreen()));

    final textFormFieldFinder = find.byType(TextFormField);
    expect(textFormFieldFinder, findsOneWidget);

    final dropdownFinder = find.byType(DropdownButtonFormField<String>);
    expect(dropdownFinder, findsOneWidget);

    await tester.enterText(textFormFieldFinder, 'Test User');
    await tester.tap(find.byType(ElevatedButton));
    await tester.pumpAndSettle();

    expect(find.text('Test User'), findsOneWidget);
  });
}
