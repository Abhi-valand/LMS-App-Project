import AnimatedPage from '@/components/ui/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateCourseMutation } from '@/features/api/courseApi';

import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [category, setCategory] = useState('');

  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || 'Course created.');
      navigate('/admin/course');
    }
    if (error) {
      toast.error(error.data.message || 'Both fields are required.');
    }
  }, [error, isSuccess]);

  return (
    <AnimatedPage>
    <div className="flex-1 mx-10 py-6 bg-white dark:bg-[#0A0A0A] rounded-xl shadow-md dark:shadow-none">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
          Let's add a course
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add some basic details for your new course
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Title</Label>
          <Input
            className="mt-1 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
            type="text"
            placeholder="Your Course Name"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>

        <div>
          <Label className="text-gray-700 dark:text-gray-300">Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white">
              <SelectGroup>
                <SelectLabel className="text-gray-600 dark:text-gray-400">
                  Category
                </SelectLabel>
                {[
                  'Next JS',
                  'Data Science',
                  'Frontend Development',
                  'Fullstack Development',
                  'MERN Stack Development',
                  'Javascript',
                  'Python',
                  'Docker',
                  'MongoDB',
                  'HTML',
                ].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/course')}
            className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 dark:bg-black/30 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
};

export default AddCourse;
