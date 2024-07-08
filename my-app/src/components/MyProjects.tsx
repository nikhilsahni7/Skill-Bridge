// app/components/MyProjects.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  title: string;
  status: string;
  deadline: string | null;
  budget: number;
  description: string;
  skills: string[];
  proposalStatus: string;
}

export default function MyProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/freelancer/my-projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{project.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p>Status: {project.status}</p>
                <p>Budget: ${project.budget}</p>
                {project.deadline && <p>Deadline: {project.deadline}</p>}
                <p>Proposal Status: {project.proposalStatus}</p>
              </div>
              <div>
                <div className="space-x-2 mb-2">
                  {project.skills.map((skill, index) => (
                    <Badge key={index}>{skill}</Badge>
                  ))}
                </div>
                <Link href={`/projects/${project.id}`}>
                  <Button>View Details</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
