// app/components/AllProjects.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  client: {
    name: string;
  };
}

export default function AllProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects/all");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects);
        } else {
          throw new Error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Available Projects</h2>
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
                  <p>Budget: ${project.budget}</p>
                  <p>Client: {project.client.name}</p>
                </div>
                <div>
                  <Link href={`/projects/${project.id}`}>
                    <Button>View Details</Button>
                  </Link>
                  <Link href={`/projects/${project.id}/proposals`}>
                    <Button variant="outline" className="ml-2">
                      Send Proposal
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
