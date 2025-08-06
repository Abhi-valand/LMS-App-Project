import React from 'react'
import Course from './Course';
import { useLoadUserQuery } from '@/features/api/authApi';
import AnimatedPage from '@/components/ui/AnimatedPage';

const MyLearning = () => {
    const { data, isLoading } = useLoadUserQuery()
    
    const myLearning = data?.user.enrolledCourses || []
    return (
        <div className='max-w-4xl pb-[38%] mx-auto py-24 ' >
            <h1 className='font-bold text-2xl ' >MY LEARNING</h1>
            <div className='my-5' >
                {
                    isLoading ? (
                        <MyLearningSkeleton />
                    ) :
                        myLearning.length === 0 ? (<p>You are not enrolled in any courses !</p>) :
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ' >
                                {
                                    myLearning.map((course, index) => <Course key={index} course={course} />)
                                }
                            </div>
                }
            </div>
        </div>

    )
}

export default MyLearning

//Skeleton component for loading state
const MyLearningSkeleton = () => {
    return (
        <AnimatedPage>
            
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4 sm:px-100" >
            {[...Array(3)].map((_, index) => (
                <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse "
                ></div>
            ))}
        </div>
            </AnimatedPage>
        )
};

