"use client";
import { useState } from "react";
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

const freelancerProfileSchema = z.object({
  title: z.string().min(2, "Professional title is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "EXPERT"]),
  education: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  hourlyRate: z.coerce.number().min(1, "Hourly rate must be at least 1"),
  availability: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "HOURLY"]),
});

type FreelancerProfileForm = z.infer<typeof freelancerProfileSchema>;

export default function EditFreelancerProfileForm({
  initialProfile,
}: {
  initialProfile: FreelancerProfileForm;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FreelancerProfileForm>({
    resolver: zodResolver(freelancerProfileSchema),
    defaultValues: initialProfile,
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
      className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Edit Your Freelancer Profile
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value.join(", ")}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((skill) => skill.trim())
                      )
                    }
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ENTRY">Entry</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="EXPERT">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
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
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate ($)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    step="0.01"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="HOURLY">Hourly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
