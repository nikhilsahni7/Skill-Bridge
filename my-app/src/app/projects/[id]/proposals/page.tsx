// app/projects/[projectId]/proposal/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function SubmitProposal({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    coverLetter: "",
    bidAmount: "",
    deliveryTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, projectId: params.id }),
      });

      if (response.ok) {
        // Proposal submitted successfully
        toast({
          title: "Proposal submitted",
          description: "Your proposal has been submitted successfully.",
        });
        router.push("/dashboard");
      } else {
        // Handle error
        console.error("Failed to submit proposal");
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            />
          </div>
          <div>
            <label htmlFor="bidAmount" className="block mb-2">
              Bid Amount ($)
            </label>
            <Input
              type="number"
              id="bidAmount"
              name="bidAmount"
              value={formData.bidAmount}
              onChange={handleChange}
              required
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
            />
          </div>
          <Button type="submit">Submit Proposal</Button>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  );
}
