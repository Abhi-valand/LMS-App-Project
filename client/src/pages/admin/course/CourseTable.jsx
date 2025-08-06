import AnimatedPage from '@/components/ui/AnimatedPage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'
import { Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CourseTable = () => {
    const navigate = useNavigate()
    const { data, isLoading } = useGetCreatorCourseQuery()

    if (isLoading) return <h1>Loading...</h1>

    return (
        <AnimatedPage>
     
        <div className='mt-24 md:mt-0 '>
            <Button onClick={() => navigate(`create`)} className="mb-5">
                Create a new course
            </Button>
            <Table className="">
                <TableCaption>A list of your recent courses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Title</TableHead>
                        <TableHead className="">Status</TableHead>
                        <TableHead className="w-[100px] ">Price</TableHead>
                        <TableHead className="text-right ">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.courses.map((course) => (
                        <TableRow key={course._id} className="">
                            <TableCell className="">{course.courseTitle}</TableCell>
                            <TableCell>
                                <Badge
                                    className={course.isPublished
                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}
                                >
                                    {course.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                                {course?.coursePrice || "NA"}
                            </TableCell>
                            <TableCell className="text-right ">
                                <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => navigate(`${course._id}`)}
                                    className=""
                                >
                                    <Edit />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        </AnimatedPage>
    )
}

export default CourseTable
