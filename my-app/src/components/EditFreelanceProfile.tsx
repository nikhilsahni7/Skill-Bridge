"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";

const portfolioProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  projectUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const freelancerProfileSchema = z.object({
  title: z.string().min(2, "Professional title is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "EXPERT"]),
  education: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  hourlyRate: z.coerce.number().min(1, "Hourly rate must be at least 1"),
  availability: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "HOURLY"]),
  portfolio: z.array(portfolioProjectSchema).optional().default([]),
});

type FreelancerProfileForm = z.infer<typeof freelancerProfileSchema>;

export default function EditFreelancerProfileForm({
  initialProfile,
}: {
  initialProfile: Partial<FreelancerProfileForm>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const form = useForm<FreelancerProfileForm>({
    resolver: zodResolver(freelancerProfileSchema),
    defaultValues: {
      ...initialProfile,
      portfolio: initialProfile.portfolio || [],
    },
  });

  const onSubmit = async (data: FreelancerProfileForm) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile/freelancer/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Edit Your Freelancer Profile
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Professional Title
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Skills (comma-separated)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value?.join(", ") || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((skill) => skill.trim())
                      )
                    }
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Experience Level
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    <SelectItem
                      value="ENTRY"
                      className="text-gray-900 dark:text-white"
                    >
                      Entry
                    </SelectItem>
                    <SelectItem
                      value="INTERMEDIATE"
                      className="text-gray-900 dark:text-white"
                    >
                      Intermediate
                    </SelectItem>
                    <SelectItem
                      value="EXPERT"
                      className="text-gray-900 dark:text-white"
                    >
                      Expert
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Education (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Certifications (comma-separated, optional)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value?.join(", ") || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((cert) => cert.trim())
                      )
                    }
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Hourly Rate ($)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    step="0.01"
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Availability
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    <SelectItem
                      value="FULL_TIME"
                      className="text-gray-900 dark:text-white"
                    >
                      Full Time
                    </SelectItem>
                    <SelectItem
                      value="PART_TIME"
                      className="text-gray-900 dark:text-white"
                    >
                      Part Time
                    </SelectItem>
                    <SelectItem
                      value="CONTRACT"
                      className="text-gray-900 dark:text-white"
                    >
                      Contract
                    </SelectItem>
                    <SelectItem
                      value="HOURLY"
                      className="text-gray-900 dark:text-white"
                    >
                      Hourly
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="portfolio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Portfolio Projects
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {(field.value || []).map((project, index) => (
                      <div
                        key={project.id || index}
                        className="space-y-2 p-4 border rounded dark:border-gray-600"
                      >
                        <Input
                          placeholder="Project Title"
                          value={project.title}
                          onChange={(e) => {
                            const newPortfolio = [...field.value];
                            newPortfolio[index].title = e.target.value;
                            field.onChange(newPortfolio);
                          }}
                          className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500"
                        />
                        <Input
                          placeholder="Project Description"
                          value={project.description}
                          onChange={(e) => {
                            const newPortfolio = [...field.value];
                            newPortfolio[index].description = e.target.value;
                            field.onChange(newPortfolio);
                          }}
                          className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500"
                        />
                        <Input
                          placeholder="Project URL or GitHub (optional)"
                          value={project.projectUrl || ""}
                          onChange={(e) => {
                            const newPortfolio = [...field.value];
                            newPortfolio[index].projectUrl = e.target.value;
                            field.onChange(newPortfolio);
                          }}
                          className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500"
                        />
                        <Input
                          type="hidden"
                          value={project.id || ""}
                          onChange={() => {}} // This field shouldn't change
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newPortfolio = field.value.filter(
                              (_, i) => i !== index
                            );
                            field.onChange(newPortfolio);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Remove Project
                        </Button>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <Button
                  type="button"
                  onClick={() =>
                    field.onChange([
                      ...(field.value || []),
                      { title: "", description: "", projectUrl: "" },
                    ])
                  }
                  className="mt-2 bg-green-500 hover:bg-green-600 text-white"
                >
                  Add Project
                </Button>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
