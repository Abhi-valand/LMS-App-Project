import { useState } from "react";
import { useForgotPasswordMutation } from "@/features/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async () => {
        if (!email) {
            toast.error("Email is required.");
            return;
        }

        try {
            const res = await forgotPassword({ email }).unwrap();
            toast.success(res.message || "Password reset link sent!");
        } catch (err) {
            const msg = err?.data?.message || "Something went wrong.";
            toast.error(msg);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-6 rounded-lg shadow-lg w-[400px] dark:bg-[#0A0A0A]/5">
                <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleSubmit} disabled={isLoading} className="mt-4 w-full">
                    {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
            </div>
        </div>
    );
};

export default ForgotPassword;
