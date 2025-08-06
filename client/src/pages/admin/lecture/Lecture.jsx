import { Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Lecture = ({ lecture, courseId, index }) => {

  const navigate = useNavigate();
  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`)
  }

  return (
    <div className='flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-md my-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all'>
      <h1 className='font-semibold text-gray-800 dark:text-gray-100'>
        Lecture - {index + 1}: {lecture.lectureTitle}
      </h1>
      <Edit
        onClick={goToUpdateLecture}
        size={22}
        className='cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors'
      />
    </div>
  )
}

export default Lecture
