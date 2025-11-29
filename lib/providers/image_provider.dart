import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/image_model.dart';

class PixabayImageProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  List<PixabayImage> _images = [];
  bool _isLoading = false;
  String? _error;

  List<PixabayImage> get images => _images; // Add this getter
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchImages(String query) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _images = await _apiService.fetchImages(query);
    } catch (e) {
      _error = 'Failed to load images: $e';
    }
    _isLoading = false;
    notifyListeners();
  }
}
