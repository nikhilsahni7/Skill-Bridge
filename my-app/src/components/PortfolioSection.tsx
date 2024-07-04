import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "./ui/toaster";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PortfolioSection({
  portfolio,
  onPortfolioUpdate,
}: any) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  const handleDelete = async (projectId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/profile/freelancer/update", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      if (response.ok) {
        const data = await response.json();
        onPortfolioUpdate(
          portfolio.filter(
            (project: any) => project.id !== data.deletedProjectId
          )
        );
        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted.",
        });
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setSelectedProjectId(null);
    }
  };

  const openDeleteDialog = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const closeDeleteDialog = () => {
    setSelectedProjectId(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Portfolio</h2>
      {portfolio.map((project: any) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
            {project.imageUrl && (
              <div className="mt-4">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="mt-4 flex justify-between items-center">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Project
                </a>
              )}
              <Button
                onClick={() => openDeleteDialog(project.id)}
                disabled={isDeleting}
                variant="destructive"
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedProjectId && (
        <Dialog open={!!selectedProjectId} onOpenChange={closeDeleteDialog}>
          <DialogTrigger asChild>
            <Button className="hidden">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
            <DialogFooter>
              <Button onClick={closeDeleteDialog} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(selectedProjectId)}
                variant="destructive"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Toaster />
    </div>
  );
}
