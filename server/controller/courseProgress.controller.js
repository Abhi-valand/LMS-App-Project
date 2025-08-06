import { CourseProgress } from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js";

export const getCourseProgress = async (req,res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        //step-1 fetch the user course progress
        let courseProgress = await CourseProgress.findOne({courseId,userId}).populate("courseId")

        const courseDetails = await Course.findById(courseId).populate("lectures")

        if(!courseDetails){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        // step-2 if no progress found, return course detail with empty progress
        if(!courseProgress){
            return res.status(200).json({
                data:{
                    courseDetails,
                    progress:[],
                    completed:false
                }
            })
        }

        // step-3 return the user's course progress along with course details
        return res.status(200).json({
            data:{
                courseDetails,
                progress:courseProgress.lectureProgress,
                completed:courseProgress.completed
            }
        })

    } catch (error) {
        console.log(error);
    }
}

export const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { watchedDuration, totalDuration } = req.body; // Get from frontend
        const userId = req.id;

        // Validate durations
        if (!watchedDuration || !totalDuration || totalDuration === 0) {
            return res.status(400).json({ message: "Invalid duration data" });
        }

        const hasCompletedLecture = (watchedDuration / totalDuration) >= 0.95;

        // Fetch or create course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId });

        if (!courseProgress) {
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: []
            });
        }

        const lectureIndex = courseProgress.lectureProgress.findIndex(
            (lecture) => lecture.lectureId === lectureId
        );

        if (lectureIndex !== -1) {
            // Update existing lecture progress
            courseProgress.lectureProgress[lectureIndex].viewed = hasCompletedLecture;
        } else {
            // Add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed: hasCompletedLecture
            });
        }

        // Check if all lectures are completed
        const viewedLecturesCount = courseProgress.lectureProgress.filter(
            (lecture) => lecture.viewed
        ).length;

        const course = await Course.findById(courseId);

        if (course && course.lectures.length === viewedLecturesCount) {
            courseProgress.completed = true;
        }

        await courseProgress.save();

        return res.status(200).json({
            message: hasCompletedLecture 
                ? "Lecture marked as completed"
                : "Lecture progress saved (not fully watched)"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const markAsCompleted = async (req,res) => {
    try {
        const {courseId} = req.params
        const userId = req.id

        const courseProgress = await CourseProgress.findOne({courseId,userId})
        if(!courseProgress) return res.status(404).json({
            message:"Course progress not found"
        })

        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = true)
        courseProgress.completed = true
        await courseProgress.save()
        return res.status(200).json({
            message:"Course marked as completed."
        })
    } catch (error) {
        console.log(error);
    }
}

export const markAsInCompleted = async (req,res) => {
    try {
        const {courseId} = req.params
        const userId = req.id

        const courseProgress = await CourseProgress.findOne({courseId,userId})
        if(!courseProgress) return res.status(404).json({
            message:"Course progress not found"
        })

        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = false)
        courseProgress.completed = false
        await courseProgress.save()
        return res.status(200).json({
            message:"Course marked as incompleted."
        })
    } catch (error) {
        console.log(error);
    }
}