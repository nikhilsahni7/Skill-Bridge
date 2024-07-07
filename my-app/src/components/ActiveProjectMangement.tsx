// app/components/ActiveProjectsManagement.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleCompleteProject = async (projectId: string) => {
    setCompletingProject(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        onProjectComplete(); // Refresh the dashboard data
        toast({
          title: "Success",
          description: "Project marked as completed successfully.",
        });
      } else {
        throw new Error("Failed to complete project");
      }
    } catch (error) {
      console.error("Error completing project:", error);
      toast({
        title: "Error",
        description: "Failed to complete the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompletingProject(null);
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
              <div className="flex justify-between items-center">
                <div>
                  <p>
                    Freelancer: {project.freelancer?.name || "Not assigned"}
                  </p>
                  <p>Budget: ${project.budget}</p>
                </div>
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
