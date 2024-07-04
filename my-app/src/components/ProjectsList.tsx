import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProjectList({ projects }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Projects</h2>
      {projects.map((project: any) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Badge>{project.status}</Badge>
              <span>
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
