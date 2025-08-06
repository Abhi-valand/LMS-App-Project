import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("")
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate()

  const [createLecture, { data, isLoading, error, isSuccess }] = useCreateLectureMutation()

  const { data: lectureData, isLoading: lectureLoading, isError: lectureError, refetch } = useGetCourseLectureQuery(courseId)

  const createLectureHandler = async (e) => {
    e.preventDefault(); // prevent form refresh
    if (!lectureTitle.trim()) return; // !"" → true
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      setLectureTitle(""); // clear input
      refetch();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  return (
    <div className='flex-1 '>
      <div className='mb-4'>
        <h1 className='font-bold text-xl dark:text-white'>Let's add lectures</h1>
        <p className='text-sm dark:text-gray-400'>Add some basic course details for your new course</p>
      </div>

      <form className='space-y-4' onSubmit={createLectureHandler}>
        <div>
          <Label className='dark:text-white'>Title</Label>
          <Input
            type="text"
            placeholder="Your lecture name"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className='dark:bg-black/40 dark:text-white dark:border-gray-600'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className='dark:text-white dark:bg-black/40 dark:border-gray-600'
          >
            Back to course
          </Button>

          <Button type="submit" disabled={isLoading} className=' '>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
      </form>

      <div className='mt-10'>
        {lectureLoading ? (
          <p className='dark:text-white'>Loading lectures...</p>
        ) : lectureError ? (
          <p className='dark:text-white'>Failed to load lectures.</p>
        ) : lectureData.lectures.length === 0 ? (
          <p className='dark:text-white'>No lectures available</p>
        ) : (
          lectureData.lectures.map((lecture, index) => (
            <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
          ))
        )}
      </div>
    </div>
  )
}

export default CreateLecture
