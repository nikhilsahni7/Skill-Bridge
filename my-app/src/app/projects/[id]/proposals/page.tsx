// app/projects/[projectId]/proposal/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/Skeleton";

export default function SubmitProposal({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    coverLetter: "",
    bidAmount: "",
    deliveryTime: "",
  });
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);

  useEffect(() => {
    const fetchProjectStatus = async () => {
      setIsFetchingStatus(true);
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const project = await response.json();
        if (!project || !project.status) {
          throw new Error("Invalid project data received");
        }
        setProjectStatus(project.status);
      } catch (error) {
        console.error("Error fetching project status:", error);
        let errorMessage = "Failed to fetch project status. Please try again.";
        if (error instanceof Error) {
          errorMessage += ` Error: ${error.message}`;
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsFetchingStatus(false);
      }
    };

    fetchProjectStatus();
  }, [params.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (projectStatus === "COMPLETED") {
      toast({
        title: "Cannot apply",
        description: "This project has already been completed.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Basic form validation
    if (
      !formData.coverLetter.trim() ||
      !formData.bidAmount ||
      !formData.deliveryTime
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: params.id,
          coverLetter: formData.coverLetter,
          bidAmount: parseFloat(formData.bidAmount),
          deliveryTime: parseInt(formData.deliveryTime),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit proposal");
      }

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Your proposal has been submitted successfully.",
        });
        router.push("/dashboard");
      } else {
        throw new Error("Failed to submit proposal");
      }
    } catch (error: any) {
      console.error("Error submitting proposal:", error);
      toast({
        title: "Submission Error",
        description:
          error.message || "An error occurred while submitting the proposal.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isFetchingStatus) {
    return <Skeleton />;
  }

  if (projectStatus === "COMPLETED") {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Project Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This project has already been completed. You cannot submit a
            proposal.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Submit Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="coverLetter" className="block mb-2">
              Cover Letter
            </label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              required
              placeholder="Explain why you're the best fit for this project"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="bidAmount" className="block mb-2">
              Bid Amount ($) --10% Will be deducted from the bid amount
            </label>
            <Input
              type="number"
              id="bidAmount"
              name="bidAmount"
              value={formData.bidAmount}
              onChange={handleChange}
              required
              placeholder="Enter your bid amount"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="deliveryTime" className="block mb-2">
              Delivery Time (days)
            </label>
            <Input
              type="number"
              id="deliveryTime"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              required
              placeholder="Enter estimated delivery time in days"
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Proposal"}
          </Button>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  );
}
