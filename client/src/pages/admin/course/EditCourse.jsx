import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import CourseTab from './CourseTab'
import AnimatedPage from '@/components/ui/AnimatedPage'


const EditCourse = () => {
  return (
    <AnimatedPage>
    <div className='flex-1 '>
        <div className='flex items-center justify-between mb-5 '>
            <h1 className='font-bold text-xl dark:text-white'>Add detailed information regarding course</h1>
            <Link to="lecture">
                <Button 
                  variant='link' 
                  className='hover:underline hover:text-blue-600 dark:text-white dark:hover:text-blue-400'>
                  Go to lectures page
                </Button>
            </Link>
        </div>
        <CourseTab />
    </div>
    </AnimatedPage>
  )
}

export default EditCourse
