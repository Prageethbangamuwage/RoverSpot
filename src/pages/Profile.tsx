import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Search, Calendar, Tag, Trash2, Filter } from 'lucide-react';

// Mock data - replace with actual data from your backend
const mockUserData = {
  name: "Sarah Williams",
  profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
  blogs: [
    {
      id: 1,
      title: "Hidden Waterfalls of Ella",
      excerpt: "Discover the secret cascades tucked away in the hills of Ella, where nature's beauty remains untouched by mass tourism.",
      image: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Nature",
      date: "March 15, 2024"
    },
    {
      id: 2,
      title: "Street Food Guide: Colombo",
      excerpt: "A culinary journey through the vibrant streets of Colombo, exploring the best local delicacies and hidden food spots.",
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Food",
      date: "March 10, 2024"
    }
  ]
};

const Profile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['all', 'Nature', 'Food', 'Culture', 'Adventure'];

  const filteredBlogs = mockUserData.blogs
    .filter(blog => 
      (selectedCategory === 'all' || blog.category === selectedCategory) &&
      (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={mockUserData.profilePicture}
                  alt={mockUserData.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
                />
                <button
                  className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors duration-300"
                  title="Edit Profile"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockUserData.name}</h1>
                <p className="text-gray-600">Travel Blogger</p>
              </div>
            </div>
            <Link
              to="/profile/edit"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blog List */}
        <div className="space-y-6">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all'
                  ? "Try adjusting your filters"
                  : "You haven't written any blogs yet. Start sharing your stories!"}
              </p>
              {(!searchTerm && selectedCategory === 'all') && (
                <Link
                  to="/blog/new"
                  className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300"
                >
                  Write Your First Blog
                </Link>
              )}
            </div>
          ) : (
            filteredBlogs.map(blog => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-48 w-full md:w-48 object-cover"
                      src={blog.image}
                      alt={blog.title}
                    />
                  </div>
                  <div className="p-6 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {blog.category}
                        </span>
                        <span className="text-sm text-gray-500">{blog.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 text-gray-400 hover:text-emerald-600 transition-colors duration-300"
                          title="Edit Blog"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                          title="Delete Blog"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${blog.id}`}
                      className="block mt-2 text-xl font-semibold text-gray-900 hover:text-emerald-600 transition-colors duration-300"
                    >
                      {blog.title}
                    </Link>
                    <p className="mt-3 text-gray-600">{blog.excerpt}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;