import 'package:flutter_test/flutter_test.dart';
import 'package:pixabay_dashboard/main.dart';
import 'package:provider/provider.dart';
import 'package:pixabay_dashboard/providers/image_provider.dart';

void main() {
  testWidgets('Placeholder test', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => PixabayImageProvider(),
        child: MyApp(),
      ),
    );
    expect(find.text('Pixabay Dashboard'), findsOneWidget);
  });
}