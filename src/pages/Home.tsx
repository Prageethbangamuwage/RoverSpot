import React from 'react';
import ImageSlider from '../components/Home/ImageSlider';
import FeaturedBlogs from '../components/Home/FeaturedBlogs';

const Home = () => {
  return (
    <div className="bg-white pt-16">
      <ImageSlider />
      <FeaturedBlogs />
    </div>
  );
};

export default Home;