import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showWelcomeToast, setShowWelcomeToast] = useState(false); // Start as false
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Show welcome toast only when user logs in
  useEffect(() => {
    let timer;
  
    if (user) {
      const hasShownWelcome = localStorage.getItem("hasShownWelcome");
      console.log("has?", hasShownWelcome);
  
      if (!hasShownWelcome || hasShownWelcome === "false") {
        setShowWelcomeToast(true);
        localStorage.setItem("hasShownWelcome", "true");
  
      }
    }
    
    timer = setTimeout(() => {
      setShowWelcomeToast(false);
    }, 3000);
    return () => clearTimeout(timer); // ✅ Cleanup always happens
  }, [user]);
  

  // Reset on logout
  useEffect(() => {
    if (!user) {
      localStorage.setItem("hasShownWelcome", "false");
    }
  }, [user]);



  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("");
  }

  return (
    <div className='relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 to dark:bg-gray-900 mt-16 pb-24 pt-16 px-4 text-center'>

      {/* Welcome Toast */}
      {showWelcomeToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bg-white dark:bg-gray-800 text-black dark:text-white 
                        px-6 py-4 rounded-xl shadow-lg 
                        animate-fadeInOut z-50">
          👋 Welcome back, <span className="font-bold text-blue-600">{user.name}</span>!
        </div>
      )}

      {/* Main Content */}
      <div className='max-w-3xl mx-auto'>
        <h1 className="text-white text-4xl font-bold mb-4">
          Find Best Courses for You
        </h1>

        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn and Upskill with our wide range of Courses
        </p>

        {/* Search Bar */}
        <form onSubmit={searchHandler} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Courses"
            className="flex-grow bg-white dark:bg-black/75 border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button type="submit" className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">
            Search
          </Button>
        </form>

        {/* Explore Button */}
        <Button onClick={() => navigate(`/course/search?query`)} className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full hover:bg-gray-200 hover:dark:bg-gray-900">
          Explore Courses
        </Button>
      </div>
    </div>
  )
}

export default HeroSection;
