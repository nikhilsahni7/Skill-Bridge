/* eslint-disable react/no-unescaped-entities */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { useTransition, useState } from "react";
import { login } from "@/app/actions/login";
import { register } from "@/app/actions/register";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { doSocialLogin } from "@/lib";
import {
  FaBriefcase,
  FaEnvelope,
  FaLock,
  FaUser,
  FaGoogle,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaReddit,
  FaTumblr,
  FaWhatsapp,
  FaYoutube,
  FaSoundcloud,
  FaSpotify,
  FaApple,
  FaWindows,
  FaHandshake,
  FaLinkedinIn,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export const AuthForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("login");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  const onLoginSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    startTransition(async () => {
      const result = await login(values);
      if (result?.error) setError(result.error);
    });
  };

  const onRegisterSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await register(values);
      if (result?.error) setError(result.error);
      if (result?.success) setSuccess(result.success);
    });
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 6) strength += 20;
    if (password.match(/[a-z]+/)) strength += 20;
    if (password.match(/[A-Z]+/)) strength += 20;
    if (password.match(/[0-9]+/)) strength += 20;
    if (password.match(/[$@#&!]+/)) strength += 20;
    setPasswordStrength(strength);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <FaBriefcase className="text-5xl text-blue-600 inline-block mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">SkillBridge</h1>
          <p className="text-gray-600 mt-2">Connect. Collaborate. Create.</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1 bg-white border-b p-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-800">
                {activeTab === "login" ? "Sign In" : "Create an Account"}
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                {activeTab === "login"
                  ? "Access your account"
                  : "Join our community of professionals"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs
                defaultValue="login"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="login"
                    className={`text-sm font-medium transition-all duration-300 ${
                      activeTab === "login"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className={`text-sm font-medium transition-all duration-300 ${
                      activeTab === "register"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="login">
                      <Form {...loginForm}>
                        <form
                          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                      placeholder="Enter your email"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">
                                  Password
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      type="password"
                                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                      placeholder="Enter your password"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                              role="alert"
                            >
                              <span className="block sm:inline">{error}</span>
                            </motion.div>
                          )}
                          <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                          >
                            Sign in
                          </Button>
                        </form>
                      </Form>
                      <div className="mt-6 space-y-4">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                              Or continue with
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-6">
                          <form action={doSocialLogin}>
                            <Button
                              variant="outline"
                              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                              name="action"
                              value="google"
                            >
                              <FaGoogle className="w-5 h-5 " />
                              Sign in with Google
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                              name="action"
                              value="linkedin"
                            >
                              <FaLinkedin className="w-5 h-5" />
                              Sign in with Linkedin
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                              name="action"
                              value="github"
                            >
                              <FaGithub className="w-5 h-5" />
                              Sign in with Github
                            </Button>
                          </form>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="register">
                      <Form {...registerForm}>
                        <form
                          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={registerForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">
                                  Name
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                      placeholder="Enter your full name"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                      placeholder="Enter your email"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">
                                  Password
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      type="password"
                                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                      placeholder="Create a strong password"
                                      onChange={(e) => {
                                        field.onChange(e);
                                        checkPasswordStrength(e.target.value);
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                          <div className="mt-2">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${passwordStrength}%`,
                                  backgroundColor: `hsl(${passwordStrength}, 100%, 50%)`,
                                }}
                              ></div>
                            </div>
                            <p className="text-sm mt-1 text-gray-600">
                              Password strength: {passwordStrength}%
                            </p>
                          </div>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                              role="alert"
                            >
                              <span className="block sm:inline">{error}</span>
                            </motion.div>
                          )}
                          {success && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                              role="alert"
                            >
                              <span className="block sm:inline">{success}</span>
                            </motion.div>
                          )}
                          <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                          >
                            Create Account
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
              {/* Social Proof */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Join over 100,000 professionals on SkillBridge!
                </p>
              </div>
              {/* Terms and Privacy Policy */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <a href="#" className="underline  hover:text-gray-300">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline  hover:text-gray-300">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthForm;
