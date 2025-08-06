import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import AnimatedPage from '@/components/ui/AnimatedPage'


const Course = ({ course }) => {
    return (
            <Link to={`/course-detail/${course._id}`} >
                <Card className="overflow-hidden rounded-lg dark:bg-[#0A0A0A]/5 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 " >
                    <div className='relative' >
                        <img
                            src={course.courseThumbnail}
                            className='w-full h-36 object-cover rounded-t-lg'
                            alt="course" />
                    </div>
                    <CardContent className="px-5 py-4 space-y-3 dark:text-gray-100" >
                        <h1 className='hover:underline font-bold text-lg truncate' >{course.courseTitle} </h1>
                        <div className='flex items-center justify-between '>
                            <div className='flex items-center gap-2 '>
                                <Avatar className="h-8 w-8" >
                                    <AvatarImage src={course.creator?.photoUrl || "https://i.pinimg.com/236x/23/ac/1a/23ac1a907311c7f2bfe777f3d425beb2.jpg"} alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1 className='font-medium text-sm ' >{course.creator?.name}</h1>
                            </div>
                            <div>
                                <Badge
                                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 shadow-sm ${course.courseLevel === 'Beginner'
                                        ? 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-300 hover:bg-green-200'
                                        : course.courseLevel === 'Medium'
                                            ? 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-300 hover:bg-yellow-200'
                                            : course.courseLevel === 'Advance'
                                                ? 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-300 hover:bg-red-200'
                                                : 'bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-300'
                                        }`}
                                >
                                    {course.courseLevel}
                                </Badge>
                            </div>
                        </div>
                        <div className='text-lg font-bold' >
                            <span>₹{course.coursePrice}</span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
    )
}

export default Course
