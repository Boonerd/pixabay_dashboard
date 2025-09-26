import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/image_provider.dart';
import '../widgets/nav_bar.dart';
import 'package:url_launcher/url_launcher.dart';

class GalleryScreen extends StatelessWidget {
  const GalleryScreen({super.key});

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
    final TextEditingController controller = TextEditingController();

    void searchImages() {
      if (controller.text.isNotEmpty) {
        imageProvider.fetchImages(controller.text);
      }
    }

    return Scaffold(
      body: Row(
        children: [
          const ResponsiveNavBar(),
          Expanded(
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(4.0),
                  child: SizedBox(
                    height: 35,
                    child: TextField(
                      controller: controller,
                      decoration: InputDecoration(
                        labelText: 'Search Images',
                        border: const OutlineInputBorder(),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12.0,
                          vertical: 8.0,
                        ),
                        suffixIcon: IconButton(
                          icon: const Icon(Icons.search),
                          color: controller.text.isNotEmpty
                              ? null
                              : Colors.grey, // Highlight when active
                          onPressed: controller.text.isNotEmpty
                              ? () {
                                  FocusScope.of(context).unfocus();
                                  searchImages();
                                }
                              : null,
                        ),
                      ),
                      onSubmitted: (_) => searchImages(),
                    ),
                  ),
                ),
                Expanded(
                  child: imageProvider.isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : imageProvider.error != null
                      ? Center(child: Text(imageProvider.error!))
                      : MediaQuery.of(context).size.width > 600
                      ? GridView.builder(
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 3,
                                childAspectRatio: 0.7,
                                mainAxisSpacing: 4,
                                crossAxisSpacing: 4,
                                mainAxisExtent: 200,
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
                                      crossAxisAlignment:
                                          CrossAxisAlignment.stretch,
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
                                            style: const TextStyle(
                                              fontSize: 12,
                                            ),
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
                                            style: const TextStyle(
                                              fontSize: 10,
                                            ),
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
                        )
                      : ListView.builder(
                          itemCount: imageProvider.images.length,
                          itemBuilder: (context, index) {
                            final image = imageProvider.images[index];
                            return GestureDetector(
                              onTap: () => _launchURL(image.webformatUrl),
                              child: Card(
                                elevation: 2,
                                child: ListTile(
                                  leading: Image.network(
                                    image.webformatUrl,
                                    width: 50,
                                    fit: BoxFit.cover,
                                    errorBuilder:
                                        (context, error, stackTrace) =>
                                            const Icon(Icons.error),
                                  ),
                                  title: Text(
                                    image.photographer,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                  subtitle: Text(
                                    image.tags.join(', '),
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 10),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
