import React from 'react';
import { ArrowRight } from 'lucide-react';

const featuredBlogs = [
  {
    id: 1,
    title: "Temple of the Sacred Tooth Relic",
    excerpt: "Explore the serene beauty of the Temple of the Sacred Tooth Relic in Kandy, where ancient architecture meets spiritual tranquility beside the peaceful lake.",
    image: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg",
    author: "Sarah Williams",
    date: "March 15, 2024"
  },
  {
    id: 2,
    title: "Coastal Wonders of Sri Lanka",
    excerpt: "Discover the dramatic coastlines where pristine beaches meet rugged cliffs, offering breathtaking views of the Indian Ocean's powerful waves.",
    image: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg",
    author: "Michael Chen",
    date: "March 14, 2024"
  },
  {
    id: 3,
    title: "Life in the Rice Fields",
    excerpt: "Experience the authentic rural life of Sri Lanka through its vibrant rice paddies, where traditional farming practices continue to thrive.",
    image: "https://images.pexels.com/photos/247597/pexels-photo-247597.jpeg",
    author: "Emma Thompson",
    date: "March 13, 2024"
  }
];

const FeaturedBlogs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore handpicked stories from our community of travelers, sharing their unique experiences across Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredBlogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{blog.author}</span>
                  <span className="mx-2">•</span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <button className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;