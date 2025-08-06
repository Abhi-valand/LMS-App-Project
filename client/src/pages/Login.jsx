// QEEyFcKq7SzNahLw
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useForgotPasswordMutation, useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [SignupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student", // default role
    });
    const [LoginInput, setLoginInput] = useState({ email: "", password: "" });

    const [registerUser, { data: registerData, error: registerError, isLoading: registerisLoading, isSuccess: registerisSuccess }] = useRegisterUserMutation()
    const [loginUser, { data: loginData, error: loginError, isLoading: loginisLoading, isSuccess: loginisSuccess }] = useLoginUserMutation()



    const navigate = useNavigate();

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "Signup") {
            setSignupInput({ ...SignupInput, [name]: value })
        } else {
            setLoginInput({ ...LoginInput, [name]: value })
        }
    };

    const handleRegistration = async (type) => {
        const inputData = type === "Signup" ? SignupInput : LoginInput;
        const action = type === "Signup" ? registerUser : loginUser;

        if (type === "Signup" && inputData.password !== inputData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        await action(inputData);
    };


    useEffect(() => {
        if (registerisSuccess && registerData) {
            toast.success(registerData.message || "register successful")
        }
        if (registerError) {
            const errorMessage =
                registerError?.data?.message || "Signup failed. Please try again.";
            toast.error(errorMessage);
        }
        if (loginisSuccess && loginData) {
            toast.success(loginData.message || "Login successful")
            navigate("/")
        }

        if (loginError) {
            const errorMessage =
                loginError?.data?.message || "Login failed. Please check your credentials.";
            toast.error(errorMessage);
        }
    }, [loginisLoading, registerisLoading, loginData, registerData, loginError, registerError])



    return (
        <div className="flex items-center justify-center w-full pt-20 pb-[21%] dark:bg-[#0A0A0A]/80 ">
            <Tabs defaultValue="Login" className="w-[400px] ">
                <TabsList className="grid w-full grid-cols-2 dark:bg-[#0A0A0A]/5">
                    <TabsTrigger value="Signup" className='dark:bg-[#0A0A0A]/5 dark:shadow-slate-900' >Signup</TabsTrigger>
                    <TabsTrigger value="Login" className='dark:bg-[#0A0A0A]/5 dark:shadow-slate-900'>Login</TabsTrigger>
                </TabsList>
                <TabsContent value="Signup">
                    <Card className='dark:bg-[#0A0A0A]/5 dark:text-gray-100'>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Create a new account and click signup when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input type="text" name="name" value={SignupInput.name} onChange={(e) => changeInputHandler(e, "Signup")} placeholder="Eg. patel" required="true" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Email</Label>
                                <Input type="email" name="email" value={SignupInput.email} onChange={(e) => changeInputHandler(e, "Signup")} placeholder="Eg. abc@gmail.com" required="true" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Password</Label>
                                <Input type="password" name="password" value={SignupInput.password} onChange={(e) => changeInputHandler(e, "Signup")} placeholder="Eg. XYZ" required="true" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    value={SignupInput.confirmPassword || ""}
                                    onChange={(e) => changeInputHandler(e, "Signup")}
                                    placeholder="Re-enter your password"
                                    required
                                />
                            </div>

                            <div className="space-y-1 ">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    name="role"
                                    value={SignupInput.role}
                                    onChange={(e) => changeInputHandler(e, "Signup")}
                                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-[#0A0A0A]/5 bg-white dark:text-gray-100 text-black focus:outline-none"
                                >
                                    <option className="dark:bg-[#0A0A0A] dark:text-gray-100 text-black" value="student">Student</option>
                                    <option className="dark:bg-[#0A0A0A] dark:text-gray-100 text-black" value="instructor">Instructor</option>
                                </select>

                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registerisLoading} onClick={() => handleRegistration("Signup")}>
                                {
                                    registerisLoading ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Please wait
                                        </>
                                    ) : "Signup"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="Login">
                    <Card className='dark:bg-[#0A0A0A]/5 dark:text-gray-100'>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login your password here. After signup, you'll be logged in
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Email</Label>
                                <Input type="email" name="email" value={LoginInput.email} onChange={(e) => changeInputHandler(e, "Login")} placeholder="Eg. abc@gmail.com" required="true" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">password</Label>
                                <Input type="password" name="password" value={LoginInput.password} onChange={(e) => changeInputHandler(e, "Login")} placeholder="Eg. xyz" required="true" />
                            </div>
                            <div className="text-right text-sm mt-1 text-blue-500 hover:underline cursor-pointer">
                                <a href="/login/forgot-password">Forgot password?</a>
                            </div>

                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginisLoading} onClick={() => handleRegistration("Login")}>
                                {
                                    loginisLoading ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Please wait
                                        </>
                                    ) : "login"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default Login;