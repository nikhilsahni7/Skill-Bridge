import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  status: string;
  budget: number;
  proposals: number;
  description?: string;
  skills?: string[];
}

interface ProjectListProps {
  projects: Project[];
  isClientView: boolean;
}

export default function ProjectList({
  projects,
  isClientView,
}: ProjectListProps) {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {project.description && (
              <p className="mb-2">{project.description}</p>
            )}
            <div className="flex justify-between items-center">
              <div>
                <p>Status: {project.status}</p>
                <p>Budget: ${project.budget}</p>
                {isClientView && <p>Proposals: {project.proposals}</p>}
              </div>
              <div>
                {project.skills && (
                  <div className="space-x-2 mb-2">
                    {project.skills.map((skill, index) => (
                      <Badge key={index}>{skill}</Badge>
                    ))}
                  </div>
                )}
                <Link href={`/projects/${project.id}`}>
                  <Button>
                    {isClientView ? "View Proposals" : "View Details"}
                  </Button>
                </Link>
                {!isClientView && (
                  <Link href={`/projects/${project.id}/proposal`}>
                    <Button variant="outline" className="ml-2">
                      Send Proposal
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
