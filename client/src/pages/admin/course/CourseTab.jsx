import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RichTextEditor from '@/components/ui/RichTextEditor'
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
    useEditCourseMutation,
    useGetCourseByIdQuery,
    usePublishCourseMutation,
    useRemoveCourseMutation
} from '@/features/api/courseApi'
import AnimatedPage from '@/components/ui/AnimatedPage'

const CourseTab = () => {
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    })

    const params = useParams()
    const courseId = params.courseId
    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true })
    const [removeCourse, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess, refetch: removeRefetch }] = useRemoveCourseMutation()
    const [previewThumbnail, setPreviewThumbnail] = useState("")
    const navigate = useNavigate()
    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation()
    const [publishCourse] = usePublishCourseMutation()

    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData.course
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "",
            })
            setPreviewThumbnail(course.courseThumbnail)
        }
    }, [courseByIdData])
    const selectCategory = (value) => setInput({ ...input, category: value })
    const selectCourseLevel = (value) => setInput({ ...input, courseLevel: value })

    const changeEventHandler = (e) => {
        const { name, value } = e.target
        setInput({ ...input, [name]: value })
    }


    const selectThumbnail = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setInput({ ...input, courseThumbnail: file })
            const fileReader = new FileReader()
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
            fileReader.readAsDataURL(file)
        }
    }

    const removeCourseHandler = async () => {
        await removeCourse(courseId)
        navigate('/admin/course')
        removeRefetch()
    }

    useEffect(() => {
        if (removeSuccess) {
            navigate(`/admin/course`)
            toast.success(removeData.message)
        }
    }, [removeSuccess])

    const updateCourseHandler = async () => {
        const formData = new FormData()
        formData.append("courseTitle", input.courseTitle)
        formData.append("subTitle", input.subTitle)
        formData.append("description", input.description)
        formData.append("category", input.category)
        formData.append("courseLevel", input.courseLevel)
        formData.append("coursePrice", input.coursePrice)
        formData.append("courseThumbnail", input.courseThumbnail)

        await editCourse({ formData, courseId })
        navigate("/admin/course")
    }

    useEffect(() => {
        if (isSuccess) toast.success(data.message || "Course update")
        if (error) toast.error(error.data.message || "Failed to update course")
    }, [isSuccess, error])

    if (courseByIdLoading,isLoading) return <div className="text-center py-10 dark:bg-black/30">Loading course...</div>

    const isPublished = courseByIdData?.course.isPublished

    const publishStatusHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, query: action })
            refetch()
            if (response.data) toast.success(response.data.message)
        } catch {
            toast.error("Failed to publish or unpublish course")
        }
    }

    return (
        <AnimatedPage>
        <Card className="dark:bg-black/30">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className="space-x-2">
                    <Button
                        className="dark:bg-black/30"
                        disabled={courseByIdData?.course.lectures.length === 0}
                        variant="outline"
                        onClick={() => publishStatusHandler(isPublished ? "false" : "true")}
                    >
                        {isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button onClick={removeCourseHandler} variant='destructive'>
                        Remove Course
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-5">
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Fullstack developer"
                            className="dark:bg-black/30"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="eg. Become a Fullstack developer in 6 months and get an actual job"
                            className="dark:bg-black/30"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className="flex items-center gap-5">
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory} value={input.category}>
                                <SelectTrigger className="w-[180px] dark:bg-black/30">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-black/30">
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                        <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                                        <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course level</Label>
                            <Select onValueChange={selectCourseLevel} value={input.courseLevel}>
                                <SelectTrigger className="w-[180px] dark:bg-black/30">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-black/30">
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="499"
                                className="w-fit dark:bg-black/30"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            onChange={selectThumbnail}
                            accept="image/*"
                            className="w-fit dark:bg-black/30"
                        />
                        {previewThumbnail && (
                            <div className="relative w-fit mt-2">
                                <label htmlFor="course-thumbnail-upload" className="cursor-pointer">
                                    <img
                                        src={previewThumbnail}
                                        className="w-64 rounded-lg border hover:opacity-80 transition"
                                        alt="Course Thumbnail"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewThumbnail("")
                                        setInput(prev => ({ ...prev, courseThumbnail: "" }))
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded"
                                >
                                    X
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => navigate("/admin/course")}
                            variant="outline"
                            className="dark:bg-black/30"
                        >
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler} className="dark:bg-gray-100 ">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin " />Please wait
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>

            {courseByIdData?.course.lectures.length === 0 && (
                <CardFooter className="dark:bg-black/30 flex items-center justify-start px-4 py-2">
                    <Link
                        to={`/admin/course/${courseId}/lecture`}
                        className="text-sm text-red-600 font-medium hover:underline"
                    >
                        *Add lectures to publish course
                    </Link>
                </CardFooter>
            )}
        </Card>
        </AnimatedPage>
    )
}

export default CourseTab
