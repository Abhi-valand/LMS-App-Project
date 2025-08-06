import AnimatedPage from "@/components/ui/AnimatedPage";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { data, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError)
    return <h1 className="text-red-500">Failed to get purchased course</h1>;

  const { purchasedCourse } = data || [];

  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId.courseTitle,
    price: course.courseId.coursePrice,
  }));

  const totalRevenue = purchasedCourse.reduce(
    (acc, element) => acc + (element.amount || 0),
    0
  );

  const totalSales = purchasedCourse.length;

  return (
    <AnimatedPage>
    <div className="grid gap-6 mt-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Card className="shadow-lg hover:shadow-xl dark:bg-black/10 transition-shadow duration-300">
        <CardHeader className="dark:bg-black/10">
          <CardTitle className="dark:text-white">Total Sales</CardTitle>
        </CardHeader>
        <CardContent className="dark:bg-black/10">
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl dark:bg-black/10 transition-shadow duration-300">
        <CardHeader className="dark:bg-black/10">
          <CardTitle className="dark:text-white">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="dark:bg-black/10">
          <p className="text-3xl font-bold text-blue-600">{totalRevenue}</p>
        </CardContent>
      </Card>

      {/* Course Prices Chart Card */}
      <Card className="shadow-lg hover:shadow-xl dark:bg-black/10 transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader className="dark:bg-black/10">
          <CardTitle className="text-xl font-semibold text-gray-700 dark:text-white">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent className="dark:bg-black/10">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseData} margin={{ bottom: 70 ,left:46 ,right:46 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30}
                textAnchor="end"
                interval={0}
                tickFormatter={(name) =>
                  name.length > 15 ? name.slice(0, 15) + "…" : name
                }
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value, name) => [`₹${value}`, name]}
                labelFormatter={(label) => label} // This will show the full name of the course on hover
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    </AnimatedPage>
  );
};

export default Dashboard;
