import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/image_provider.dart';
import '../widgets/nav_bar.dart';
import 'package:url_launcher/url_launcher.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      throw 'Could not launch $url';
    }
  }

  @override
  Widget build(BuildContext context) {
    final imageProvider = Provider.of<PixabayImageProvider>(context);
    if (imageProvider.images.isEmpty && !imageProvider.isLoading) {
      imageProvider.fetchImages('popular');
    }
    return Scaffold(
      body: Row(
        children: [
          const ResponsiveNavBar(),
          Expanded(
            child: imageProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : imageProvider.error != null
                ? Center(child: Text(imageProvider.error!))
                : GridView.builder(
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 3,
                          childAspectRatio: 0.75,
                          mainAxisSpacing: 4,
                          crossAxisSpacing: 4,
                        ),
                    itemCount: imageProvider.images.length,
                    itemBuilder: (context, index) {
                      final image = imageProvider.images[index];
                      return GestureDetector(
                        onTap: () => _launchURL(image.webformatUrl),
                        child: Card(
                          elevation: 2,
                          child: MouseRegion(
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Expanded(
                                    child: Image.network(
                                      image.webformatUrl,
                                      fit: BoxFit.cover,
                                      errorBuilder:
                                          (context, error, stackTrace) =>
                                              const Icon(Icons.error),
                                    ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(2.0),
                                    child: Text(
                                      image.photographer,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(fontSize: 12),
                                    ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 2.0,
                                    ),
                                    child: Text(
                                      image.tags.join(', '),
                                      textAlign: TextAlign.center,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(fontSize: 10),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            onEnter: (_) =>
                                (context as Element).markNeedsBuild(),
                            onExit: (_) =>
                                (context as Element).markNeedsBuild(),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
