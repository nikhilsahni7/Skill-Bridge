// app/projects/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/Skeleton";

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deliveryTime: number;
  status: string;
  skills: string[];
  client: {
    name: string;
    id: string;
  };
}

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          throw new Error("Failed to fetch project");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{project.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Budget:</strong> ${project.budget}
            </div>
            <div>
              <strong>Delivery Time:</strong> {project.deliveryTime} days
            </div>
            <div>
              <strong>Status:</strong> {project.status}
            </div>
            <div>
              <strong>Client:</strong> {project.client.name}
            </div>
          </div>
          <div className="mb-4">
            <strong>Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.skills.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </div>
          </div>
          <Link href={`/projects/${project.id}/propose`}>
            <Button>Submit Proposal</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
