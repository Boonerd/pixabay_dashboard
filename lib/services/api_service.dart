import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/image_model.dart';

class ApiService {
  static const String apiKey = '52447639-c54739809927b69fdeea322ca';
  static const String baseUrl = 'https://pixabay.com/api/';

  Future<List<PixabayImage>> fetchImages(String query) async {
    final response = await http.get(
      Uri.parse('$baseUrl?key=$apiKey&q=$query&per_page=20'),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final images = (data['hits'] as List)
          .map((json) => PixabayImage.fromJson(json))
          .toList();
      return images;
    } else {
      throw Exception('Failed to load images');
    }
  }
}
