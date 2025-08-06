import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation, useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi"; // Assuming the API call is handled here
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { data, isLoading, isSuccess, isError, error }] =
    useCreateCheckoutSessionMutation();
  // Function to handle the purchase course action
  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  const { data:coursedata } =
        useGetCourseDetailWithStatusQuery(courseId);
  const { course } = coursedata
 
  // Handle Razorpay payment after successful API response
  useEffect(() => {
    if (isSuccess) {
      if (data?.orderId) {
        // Initialize Razorpay checkout
        const options = {
          key: data.keyId, // Replace with your Razorpay key
          amount: data.amount, // Amount in the smallest currency unit (i.e., paise for INR)
          currency: "INR", // You can change this based on your requirements
          name: course.courseTitle,
          subtitle: course.subtitle,
          order_id: data.order_id, // Order ID returned from Razorpay API
          handler: function (response) {
            // Handle payment success
            toast.success("Payment successful. Redirecting to course...");
            // Handle post-payment success actions (e.g., updating order status, navigating to the course progress)
            window.location.href = `/course-progress/${courseId}`;
          },
          notes: {
            courseId: courseId, // Additional data to be sent to the backend
          },
          theme: {
            color: "#F37254", // Customize the button color
          },
        };

        // Create Razorpay checkout instance
        const rzp1 = new window.Razorpay(options);
        console.log(rzp1)
        rzp1.open(); // Open the Razorpay checkout modal
      } else {
        console.log(error);
        
        toast.error("Invalid response from server.");
      }
    }

    if (isError) {
      toast.error(error?.data?.message || "Failed to create checkout session");
    }
  }, [data, isSuccess, isError, error]);

  return (
    <Button
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      className="w-full bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-2 rounded-xl shadow-md transition-colors duration-200 ease-in hover:scale-105"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
        </>
      ) : (
        <span className="block transition-none">Purchase Course</span>
      )}
    </Button>
  );
};

export default BuyCourseButton;
