import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import axios from 'axios'
import { toast } from 'sonner'
import { Progress } from "@/components/ui/progress"
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const MEDIA_API = "http://localhost:8080/api/v1/media"

const LectureTab = () => {
  const [lecturetitle, setLectureTitle] = useState("")
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null)
  const [isFree, setIsFree] = useState(false)
  const [mediaProgress, setMediaProgress] = useState(false)
  const [uploadProgess, setUploadProgress] = useState(0)
  const [btnDisable, setBtnDisable] = useState(true)
  const navigate = useNavigate()
  const params = useParams();
  const { courseId, lectureId } = params;

  const [editLecture, { error, data, isSuccess, isLoading }] = useEditLectureMutation()
  const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation()
  const { data: lectureData } = useGetLectureByIdQuery(lectureId)
  const lecture = lectureData?.lecture

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle)
      setIsFree(lecture.isPreviewFree)
      setUploadVideoInfo(lecture.videoUrl)
    }
  }, [lecture])

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      setMediaProgress(true)
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total))
          }
        })

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_Id
          })
          setBtnDisable(false)
          toast.success(res.data.message)
        }

      } catch (error) {
        toast.error("Video upload failed")
      } finally {
        setMediaProgress(false)
      }
    }
  }

  const editLectureHandler = async () => {
    await editLecture({ lecturetitle, videoInfo: uploadVideoInfo, isPreviewFree: isFree, courseId, lectureId })
  }

  const removeLectureHandler = async () => {
    await removeLecture(lectureId)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message)
      navigate(`/admin/course/${courseId}/lecture/`)
    }
    if (error) {
      toast.error(error.data.message)
    }
  }, [isSuccess, error])

  useEffect(() => {
    if (removeSuccess) {
      navigate(`/admin/course/${courseId}/lecture/`)
      toast.success(removeData.message);
    }
  }, [removeSuccess])

  return (
    <div>
      <Card className="bg-white dark:bg-black/30 shadow-md border-gray-200 dark:border-gray-700">
  <CardHeader className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
    <div>
      <CardTitle className='text-gray-800 dark:text-white'>Edit Lecture</CardTitle>
      <CardDescription className='text-gray-500 dark:text-gray-400'>
        Make changes and click save when done.
      </CardDescription>
    </div>
    <Button
      disabled={removeLoading}
      variant='destructive'
      onClick={removeLectureHandler}
    >
      {removeLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait
        </>
      ) : "Remove Lecture"}
    </Button>
  </CardHeader>

  <CardContent className='space-y-6'>
    <div className='space-y-2'>
      <Label className='text-gray-700 dark:text-gray-300'>Title</Label>
      <Input
        value={lecturetitle}
        onChange={(e) => setLectureTitle(e.target.value)}
        type="text"
        placeholder="Ex. Introduction to Python"
      />
    </div>

    <div className='space-y-2'>
      <Label className='text-gray-700 dark:text-gray-300'>Video <span className='text-red-600'>*</span></Label>
      <Input
        type="file"
        accept="video/*"
        onChange={fileChangeHandler}
        className='w-fit cursor-pointer'
      />
    </div>

    <div className='flex items-center space-x-3'>
      <Switch
        id="preview-switch"
        checked={isFree}
        onCheckedChange={setIsFree}
      />
      <Label htmlFor="preview-switch" className='text-sm text-gray-600 dark:text-gray-300'>
        Is this video FREE?
      </Label>
    </div>

    {mediaProgress && (
      <div className='space-y-1'>
        <Progress value={uploadProgess} className="w-full md:w-[60%]" />
        <p className='text-sm text-gray-500'>{uploadProgess}% uploaded</p>
      </div>
    )}

    <div className='pt-4'>
      <Button disabled={isLoading} onClick={editLectureHandler}>
        {isLoading ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait
          </>
        ) : "Update Lecture"}
      </Button>
    </div>
  </CardContent>
</Card>

    </div>
  )
}

export default LectureTab
