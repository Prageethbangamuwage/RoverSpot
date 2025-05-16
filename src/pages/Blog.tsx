import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mountain, 
  Waves, 
  Landmark, 
  Trees, 
  Utensils, 
  PartyPopper, 
  Tent,
  Globe,
  Layers
} from 'lucide-react';

const categories = [
  {
    id: 'all',
    name: 'All',
    icon: Layers,
    description: 'Explore all travel experiences',
    color: 'bg-gray-600'
  },
  {
    id: 'hiking',
    name: 'Hiking',
    icon: Mountain,
    description: 'Mountain trails and scenic walks',
    color: 'bg-emerald-600'
  },
  {
    id: 'beachside',
    name: 'Beachside Adventures',
    icon: Waves,
    description: 'Coastal experiences and water activities',
    color: 'bg-blue-600'
  },
  {
    id: 'historical',
    name: 'Historical Sites',
    icon: Landmark,
    description: 'Ancient ruins and heritage locations',
    color: 'bg-amber-600'
  },
  {
    id: 'wildlife',
    name: 'Wildlife and Nature',
    icon: Trees,
    description: 'Flora, fauna, and natural wonders',
    color: 'bg-green-600'
  },
  {
    id: 'cultural',
    name: 'Cultural Experiences',
    icon: Globe,
    description: 'Local traditions and customs',
    color: 'bg-purple-600'
  },
  {
    id: 'food',
    name: 'Food and Culinary',
    icon: Utensils,
    description: 'Local cuisine and food tours',
    color: 'bg-red-600'
  },
  {
    id: 'festivals',
    name: 'Festivals and Events',
    icon: PartyPopper,
    description: 'Celebrations and local events',
    color: 'bg-pink-600'
  },
  {
    id: 'adventure',
    name: 'Adventure Sports',
    icon: Tent,
    description: 'Thrilling outdoor activities',
    color: 'bg-orange-600'
  }
];

const Blog = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/blog/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Travel Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing stories and experiences across different aspects of Sri Lankan travel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600">
                  {category.description}
                </p>
              </div>
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-emerald-600/10 rounded-xl transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;