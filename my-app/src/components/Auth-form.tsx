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
import {
  FaBriefcase,
  FaEnvelope,
  FaLock,
  FaUser,
  FaGoogle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { doSocialLogin } from "@/lib";

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <FaBriefcase className="text-5xl text-blue-600 dark:text-blue-400 inline-block mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            SkillBridge
          </h1>
          <p className="text-gray-600 dark:text-white mt-2">
            Connect. Collaborate. Create.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="space-y-1 bg-white dark:bg-gray-800 dark:border-gray-700 border-b p-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
                {activeTab === "login" ? "Sign In" : "Create an Account"}
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-white">
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
                        ? "bg-blue-600 text-white dark:bg-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className={`text-sm font-medium transition-all duration-300 ${
                      activeTab === "register"
                        ? "bg-blue-600 text-white dark:bg-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-white"
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
                                <FormLabel className="text-gray-700 dark:text-gray-300">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
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
                                <FormLabel className="text-gray-700 dark:text-gray-300">
                                  Password
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      type="password"
                                      className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
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
                              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-200 dark:border-red-500 dark:text-red-900"
                              role="alert"
                            >
                              <span className="block sm:inline">{error}</span>
                            </motion.div>
                          )}
                          <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 dark:bg-blue-400 dark:hover:bg-blue-500"
                          >
                            Sign in
                          </Button>
                        </form>
                      </Form>
                      <div className="mt-6 space-y-4">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-white">
                              Or continue with
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <form action={doSocialLogin}>
                            <Button
                              variant="outline"
                              className="w-full border border-gray-300 text-gray-700 dark:text-white-100 hover:bg-green-600  dark: bg-white font-medium "
                              name="action"
                              value="google"
                            >
                              <FaGoogle className="w-5 h-5 " />
                              Sign in with Google
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
                                <FormLabel className="text-gray-700 dark:text-gray-300">
                                  Name
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100"
                                      placeholder="Enter your name"
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
                                <FormLabel className="text-gray-700 dark:text-gray-300">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100"
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
                                <FormLabel className="text-gray-700 dark:text-gray-300">
                                  Password
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                      {...field}
                                      type="password"
                                      className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100"
                                      placeholder="Enter your password"
                                      onChange={(e) => {
                                        field.onChange(e);
                                        checkPasswordStrength(e.target.value);
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500" />
                                <div className="mt-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                                      Password strength:
                                    </span>
                                    <span
                                      className={`text-sm font-medium ${
                                        passwordStrength < 40
                                          ? "text-red-500"
                                          : passwordStrength < 80
                                          ? "text-yellow-500"
                                          : "text-green-500"
                                      }`}
                                    >
                                      {passwordStrength < 40
                                        ? "Weak"
                                        : passwordStrength < 80
                                        ? "Medium"
                                        : "Strong"}
                                    </span>
                                  </div>
                                  <div className="relative w-full bg-gray-200 rounded h-2 dark:bg-gray-600">
                                    <div
                                      className={`h-2 rounded ${
                                        passwordStrength < 40
                                          ? "bg-red-500"
                                          : passwordStrength < 80
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{ width: `${passwordStrength}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </FormItem>
                            )}
                          />
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-200 dark:border-red-500 dark:text-red-900"
                              role="alert"
                            >
                              <span className="block sm:inline">{error}</span>
                            </motion.div>
                          )}
                          {success && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-200 dark:border-green-500 dark:text-green-900"
                              role="alert"
                            >
                              <span className="block sm:inline">{success}</span>
                            </motion.div>
                          )}
                          <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 dark:bg-blue-400 dark:hover:bg-blue-500"
                          >
                            Register
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
              {/* Social Proof */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-white">
                  Join over 100,000 professionals on SkillBridge!
                </p>
              </div>
              <footer className="mt-4 text-center text-sm text-muted-foreground  dark:text-white">
                <p>Made with ❤️ by Nikhil Sahni</p>
              </footer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
