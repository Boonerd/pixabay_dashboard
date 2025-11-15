class PixabayImage {
  final String thumbnail;
  final String webformatUrl; // Add this
  final String photographer;
  final List<String> tags;

  PixabayImage({
    required this.thumbnail,
    required this.webformatUrl,
    required this.photographer,
    required this.tags,
  });

  factory PixabayImage.fromJson(Map<String, dynamic> json) {
    return PixabayImage(
      thumbnail: json['previewURL'],
      webformatUrl: json['webformatURL'], // Use this for higher quality
      photographer: json['user'],
      tags: (json['tags'] as String).split(', '),
    );
  }
}
