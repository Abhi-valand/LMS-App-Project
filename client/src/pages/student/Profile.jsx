import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import AnimatedPage from '@/components/ui/AnimatedPage'


const Profile = () => {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [name, setname] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };
  

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    await updateUser(formData);
  };
  

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error?.message || "Failed to update profile.");
    }
  }, [error, updateUserData, isSuccess, isError]);

  if (isLoading || !data || !data.user) {
    return <h1>Profile Loading...</h1>;
  }
  const user = data && data.user


  return (
    <AnimatedPage>
            
    <div className='max-w-4xl mx-auto pb-[24%] pt-24 px-4 dark:bg-[#0A0A0A]/80 ' >
      <h1 className='font-bold text-2xl text-center md:text-left dark:text-gray-100
' >Profile</h1>
      <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-5' >
        <div className='flex flex-col items-center'>
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4" >
            <AvatarImage src={
              user.photoUrl ||
              "https://i.pinimg.com/236x/23/ac/1a/23ac1a907311c7f2bfe777f3d425beb2.jpg"
            } alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className='mb-2 dark:text-gray-100' >
            <h1 className='font-semibold text-gray-900 dark:text-gray-100' >
              Name:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2' >{user.name}</span>
            </h1>
          </div>
          <div className='mb-2 dark:text-gray-100' >
            <h1 className='font-semibold text-gray-900 dark:text-gray-100' >
              Email:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2' >{user.email}</span>
            </h1>
          </div>
          <div className='mb-2 dark:text-gray-100' >
            <h1 className='font-semibold text-gray-900 dark:text-gray-100' >
              Role:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2' >{user.role.toUpperCase()}</span>
            </h1>
          </div>
          <Dialog onOpenChange={(isOpen) => {
            if (isOpen) {
              setname(user.name); // pre-fill name
              setProfilePhoto(null); // reset profile photo state
            }
          }}>
            <DialogTrigger asChild >
              <Button size='sm' className='mt-2'>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className='dark:bg-black'>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-4 grid-cols-4 items-center'>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className="col-span-3"
                    />
                </div>
                <div className='grid gap-4 grid-cols-4 items-center'>
                  <Label>Profile photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                  {
                    updateUserIsLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait
                      </>
                    ) : "Save Changes"
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>


        </div>
      </div>
      <div>
        <h1 className='font-medium text-lg dark:text-gray-100 ' >Courses you are enrolled in</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5 dark:text-gray-100 ' >
          {
            user.enrolledCourses.length === 0 ? (
              <h1>You haven't enrolled yet.</h1>
            ) : (
              user.enrolledCourses.map((course) => <Course course={course} key={course._id} />)
            )
          }
        </div>
      </div>
    </div>
          </AnimatedPage>
  );
};

export default Profile

