import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

// Temporary mock data - will be replaced with actual data from the backend
const mockBlogs = [
  {
    id: 1,
    title: "Hiking Adam's Peak: A Spiritual Journey",
    excerpt: "Experience the magical sunrise from the summit of Adam's Peak, one of Sri Lanka's most sacred mountains. This guide covers everything you need to know for this spiritual adventure.",
    image: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Sarah Williams",
    date: "March 15, 2024",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "The Hidden Trails of Knuckles Mountain Range",
    excerpt: "Discover the lesser-known paths through the Knuckles Mountain Range, where pristine nature meets adventure. A comprehensive guide to planning your trek.",
    image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Michael Chen",
    date: "March 14, 2024",
    readTime: "6 min read"
  },
  {
    id: 3,
    title: "Ella Rock: A Hiker's Paradise",
    excerpt: "Join us on an adventure to the summit of Ella Rock, offering breathtaking views of the surrounding hills and tea plantations. Learn about the best routes and times to visit.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Emma Thompson",
    date: "March 13, 2024",
    readTime: "7 min read"
  }
];

const categoryTitles: { [key: string]: string } = {
  all: 'All Travel Stories',
  hiking: 'Hiking Adventures',
  beachside: 'Beachside Experiences',
  historical: 'Historical Sites',
  wildlife: 'Wildlife and Nature',
  cultural: 'Cultural Experiences',
  food: 'Food and Culinary',
  festivals: 'Festivals and Events',
  adventure: 'Adventure Sports'
};

const CategoryBlog = () => {
  const { categoryId = 'all' } = useParams();
  const navigate = useNavigate();

  const handleAddNewPost = () => {
    navigate(`/blog/new?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {categoryTitles[categoryId] || 'Travel Stories'}
            </h1>
            <p className="text-lg text-gray-600">
              Discover amazing experiences and stories from fellow travelers
            </p>
          </div>
          
          <button
            onClick={handleAddNewPost}
            className="group flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
            title="Add New Post"
          >
            <PlusCircle className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add New Post</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogs.map((blog) => (
            <article 
              key={blog.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{blog.author}</span>
                  <span className="mx-2">•</span>
                  <span>{blog.date}</span>
                  <span className="mx-2">•</span>
                  <span>{blog.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-emerald-600 transition-colors duration-300">
                  <a href={`/blog/${blog.id}`}>{blog.title}</a>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <a
                  href={`/blog/${blog.id}`}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Read More
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBlog;