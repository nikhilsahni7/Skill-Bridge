"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";

const clientProfileSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  website: z.string().url().optional().or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
});

type ClientProfileForm = z.infer<typeof clientProfileSchema>;

export default function ClientProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClientProfileForm>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      description: "",
      website: "",
      location: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: ClientProfileForm) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Complete Your Client Profile
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-500 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-500 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-500 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    className="border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-500 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-500 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    className="border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-500 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
