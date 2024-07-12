import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSignIcon, BriefcaseIcon } from "lucide-react";

interface Freelancer {
  id: string;
  name: string;
  title: string;
  skills: string[];
  hourlyRate: number;
  image: string;
  completedProjects: number;
  totalEarnings: number;
}

interface FreelancerListProps {
  freelancers: Freelancer[];
}

export default function FreelancerList({ freelancers }: FreelancerListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {freelancers.map((freelancer) => (
        <Card key={freelancer.id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={freelancer.image} alt={freelancer.name} />
              <AvatarFallback>{freelancer.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{freelancer.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {freelancer.title}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold flex items-center">
                <DollarSignIcon className="h-4 w-4 mr-1" />$
                {freelancer.hourlyRate}/hr
              </span>
              <span className="text-sm text-muted-foreground flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                {freelancer.completedProjects} completed
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Total Earnings: ${freelancer?.totalEarnings?.toFixed(2) || 0}
              </p>
            </div>
            <Link href={`/freelancers/${freelancer.id}`}>
              <Button className="w-full">View Profile</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
