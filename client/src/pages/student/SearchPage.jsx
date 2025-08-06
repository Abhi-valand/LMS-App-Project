import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [storedQuery, setStoredQuery] = useState(query);

  useEffect(() => {
    if (query) {
      setStoredQuery(query);
    }
  }, [query]);
  
  const [selectedCategories, setSelectedCatgories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const isEmpty = !isLoading && data?.courses.length === 0;

  const handleFilterChange = (categories, price) => {
    setSelectedCatgories(categories);
    setSortByPrice(price);
  
    // Reset query in URL if a category is selected
    if (categories.length > 0) {
      searchParams.set("query", "");
      setSearchParams(searchParams);
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-[11%] dark:bg-[#0A0A0A]/80 dark:text-gray-100">
      <div className="mb-6 ">
        <h1 className="text-2xl md:text-3xl dark:text-gray-100 font-bold mb-1">
          Search results for "{storedQuery}"
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Showing results for{" "}
          <span className="text-blue-700 font-semibold italic">{storedQuery}</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <Filter handleFilterChange={handleFilterChange} query={query}/>
        <div className="flex-1">
          {isLoading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <CourseSkeleton key={idx} />
              ))}
            </div>
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            <div className="grid gap-6">
              {data?.courses?.map((course) => (
                <SearchResult key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200">
        Course Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/">
        <Button variant="link">Browse All Courses</Button>
      </Link>
    </div>
  );
};
const animations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}
const CourseSkeleton = ({children}) => {
  return (
<motion.div
    variants={animations}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.5 }}
    className=""
  >
    {children}
    <div className="flex flex-col dark:text-gray-100 dark:bg-[#0A0A0A]/80 md:flex-row justify-between items-start md:items-center border-b border-gray-300 dark:border-gray-500 py-4 gap-4">
      <div className="flex flex-col md:flex-row gap-32 w-full md:w-auto">
        <div className="h-32 w-full md:w-56">
          <Skeleton className="h-full w-[200%] rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-6 w-[250%] rounded bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-4 w-[190%] rounded bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-4 w-[100%] rounded bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-6 w-24 mt-2 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
        <Skeleton className="h-6 w-16 ml-auto md:ml-0 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
    </motion.div>
  );
};


