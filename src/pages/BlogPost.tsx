import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Globe, MapPin } from 'lucide-react';

// Mock data - replace with actual data from your backend
const mockBlogPost = {
  id: 1,
  title: "Hiking Adam's Peak: A Spiritual Journey",
  content: `
    <h2>The Journey Begins</h2>
    <p>As the stars faded and dawn approached, we began our ascent of Sri Pada, also known as Adam's Peak. The ancient stone steps, worn smooth by centuries of pilgrims, led us higher into the misty mountains.</p>
    
    <h2>The Climb</h2>
    <p>The 5,500 steps to the summit might seem daunting, but the journey is made easier by the companionship of fellow climbers, the twinkling lights that illuminate the path, and the promise of a spectacular sunrise.</p>
    
    <h2>Summit Experience</h2>
    <p>Reaching the top just before sunrise, we joined hundreds of pilgrims and travelers in anticipation. As the sun emerged from behind distant mountains, it cast the mountain's distinctive triangular shadow across the landscape below - a sight that made every step worthwhile.</p>
  `,
  image: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
  imageCaption: "The stunning sunrise view from Adam's Peak summit",
  location: {
    name: "Adam's Peak, Sri Lanka",
    coordinates: { lat: 6.8096, lng: 80.4994 }
  },
  author: "Sarah Williams",
  date: "March 15, 2024",
  rating: 4.8,
  totalRatings: 156
};

const BlogPost = () => {
  const { id } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'සිංහල' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' }
  ];

  const handleRating = (rating: number) => {
    setUserRating(rating);
    setHasRated(true);
    // TODO: Implement API call to save rating
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    // TODO: Implement translation API integration
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <article className="max-w-4xl mx-auto px-4">
        {/* Featured Image */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <img
            src={mockBlogPost.image}
            alt={mockBlogPost.title}
            className="w-full h-[500px] object-cover"
          />
          {mockBlogPost.imageCaption && (
            <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-sm">
              {mockBlogPost.imageCaption}
            </p>
          )}
        </div>

        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {mockBlogPost.title}
          </h1>
          <div className="flex items-center text-gray-600 space-x-4">
            <span>{mockBlogPost.author}</span>
            <span>•</span>
            <span>{mockBlogPost.date}</span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex items-center space-x-2 mb-8 bg-white p-4 rounded-lg shadow-sm">
          <Globe className="h-5 w-5 text-gray-500" />
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border-0 bg-transparent focus:ring-0 text-gray-600"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Blog Content */}
        <div 
          className="prose prose-lg max-w-none mb-12 bg-white p-8 rounded-xl shadow-sm"
          dangerouslySetInnerHTML={{ __html: mockBlogPost.content }}
        />

        {/* Location Map */}
        <div className="mb-12 bg-white p-8 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Location of This Place
            </h2>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-100">
            {/* Replace with actual Google Maps integration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">
                Map showing {mockBlogPost.location.name}
                <br />
                Coordinates: {mockBlogPost.location.coordinates.lat}, {mockBlogPost.location.coordinates.lng}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rate this Blog</h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRating(star)}
                  disabled={hasRated}
                  className={`p-1 ${hasRated ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      (hoveredRating || userRating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <div className="text-gray-600">
              <span className="font-bold">{mockBlogPost.rating}</span>
              <span className="mx-1">•</span>
              <span>{mockBlogPost.totalRatings} ratings</span>
            </div>
          </div>
          
          {hasRated && (
            <p className="mt-2 text-emerald-600">
              Thank you for rating this blog!
            </p>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;