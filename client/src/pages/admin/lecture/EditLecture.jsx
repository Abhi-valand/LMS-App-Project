import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import LectureTab from './LectureTab'

const EditLecture = () => {
    const params = useParams();
    const courseId = params.courseId;

    return (
        <div className='flex flex-col gap-6 p-4 md:p-6 rounded-lg  shadow-sm'>
            <div className='flex items-center gap-3'>
                <Link to={`/admin/course/${courseId}/lecture`}>
                    <Button size='icon' variant='outline' className='rounded-full dark:bg-black/30 border-gray-300 dark:border-gray-700'>
                        <ArrowLeft size={18} className='text-gray-700  dark:text-gray-300' />
                    </Button>
                </Link>
                <h1 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>Update Your Lecture</h1>
            </div>

            <LectureTab />
        </div>
    )
}

export default EditLecture
