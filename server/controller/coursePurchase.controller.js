import Razorpay from "razorpay";
import crypto from "crypto";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id; // Get the userId from the session (assumed to be set via middleware)
    const { courseId } = req.body; // Get courseId from request body

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    // Convert price to paise (smallest unit in INR)
    const amountInPaise = course.coursePrice * 100; // 1 INR = 100 paise

    // Create a new order in Razorpay
    const options = {
      amount: amountInPaise, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`, // Unique receipt ID
      notes: {
        courseId: courseId.toString(), // Pass the courseId and userId in the notes
        userId: userId.toString(),
      },
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    // Save the order in your database
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice, // Save original price (in INR)
      paymentId: order.id, // Save Razorpay order id
      status: "pending", // Status is pending until payment is successful
    });

    await newPurchase.save();

    // Respond with order details
    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseName: course.courseTitle,
      userId,
      keyId: process.env.RAZORPAY_KEY_ID, // Send Razorpay keyId to the frontend for initiating payment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate the signature to verify
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Check if the signatures match
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Find the purchase record using the Razorpay order ID
    const purchase = await CoursePurchase.findOne({ paymentId: razorpay_order_id }).populate("courseId");

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Update the purchase status to "completed"
    purchase.status = "completed";

    // Unlock all lectures associated with the course
    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    // Save the updated purchase status
    await purchase.save();

    // Enroll the user in the course
    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } },
      { new: true }
    );

    // Add the user to the course's enrolled students
    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Payment verified and course unlocked" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate("creator") // Populate course creator info
      .populate("lectures"); // Populate lectures info

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if the user has purchased the course
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourses = await CoursePurchase.find({ status: "completed" }).populate("courseId");
    if (!purchasedCourses) {
      return res.status(404).json({
        purchasedCourses: [],
      });
    }
    return res.status(200).json({
      purchasedCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
