import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import Error from "next/error";

interface Project {
  id: string;
  title: string;
  freelancer?: {
    id: string;
    name: string;
  } | null;
  budget: number;
}

interface ActiveProjectsManagementProps {
  projects: Project[];
  onProjectComplete: () => void;
}

export default function ActiveProjectsManagement({
  projects,
  onProjectComplete,
}: ActiveProjectsManagementProps) {
  const [completingProject, setCompletingProject] = useState<string | null>(
    null
  );
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const { toast } = useToast();

  const handleCompleteProject = async (projectId: string) => {
    if (rating < 1 || rating > 5) {
      toast({
        title: "Invalid Rating",
        description: "Please provide a rating between 1 and 5.",
        variant: "destructive",
      });
      return;
    }

    setCompletingProject(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        onProjectComplete();
        toast({
          title: "Success",
          description: "Project marked as completed successfully.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to complete project");
      }
    } catch (error: any) {
      console.error("Error completing project:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to complete the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompletingProject(null);
      setRating(5);
      setComment("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Active Projects</h2>
      {projects.length === 0 ? (
        <p>No active projects at the moment.</p>
      ) : (
        projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div>
                  <p>
                    Freelancer: {project.freelancer?.name || "Not assigned"}
                  </p>
                  <p>Budget: ${project.budget}</p>
                </div>
                <StarRating rating={rating} onRatingChange={setRating} />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Review comment"
                />
                <Button
                  onClick={() => handleCompleteProject(project.id)}
                  disabled={completingProject === project.id}
                >
                  {completingProject === project.id
                    ? "Processing..."
                    : "Complete Project"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
