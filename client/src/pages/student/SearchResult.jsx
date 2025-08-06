import AnimatedPage from "@/components/ui/AnimatedPage";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course,children }) => {
  const animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
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
      
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnial"
          className="h-32 w-full md:w-56 object-cover rounded"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl dark:text-gray-100">{course.courseTitle}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{course.subTitle}</p>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Instructor: <span className="font-bold">{course.creator?.name}</span>{" "}
          </p>
          <Badge className={`w-fit mt-2 md:mt-0 ${course.courseLevel === 'Beginner'
                                    ? 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-300 hover:bg-green-200'
                                    : course.courseLevel === 'Medium'
                                        ? 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-300 hover:bg-yellow-200'
                                        : course.courseLevel === 'Advance'
                                            ? 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-300 hover:bg-red-200'
                                            : 'bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-300'
                                    }`}>{course.courseLevel}</Badge>
        </div>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto ">
        <h1 className="font-bold text-lg md:text-xl">₹{course.coursePrice}</h1>
      </div>
    </div>
    </motion.div>
  );
};

export default SearchResult;