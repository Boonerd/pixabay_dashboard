import 'package:flutter_test/flutter_test.dart';
import 'package:pixabay_dashboard/main.dart';

void main() {
  testWidgets('Placeholder test', (WidgetTester tester) async {
    await tester.pumpWidget(MyApp());
    expect(find.text('Pixabay Dashboard'), findsOneWidget);
  });
}
