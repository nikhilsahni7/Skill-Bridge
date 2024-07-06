// app/components/FreelancerList.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Freelancer {
  id: string;
  name: string;
  title: string;
  skills: string[];
  hourlyRate: number;
  image: string;
}

interface FreelancerListProps {
  freelancers: Freelancer[];
}

export default function FreelancerList({ freelancers }: FreelancerListProps) {
  return (
    <div className="space-y-4">
      {freelancers.map((freelancer) => (
        <Card key={freelancer.id}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={freelancer.image} alt={freelancer.name} />
                <AvatarFallback>{freelancer.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{freelancer.name}</CardTitle>
                <p className="text-sm text-gray-500">{freelancer.title}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                {freelancer.skills.map((skill, index) => (
                  <Badge key={index}>{skill}</Badge>
                ))}
              </div>
              <span>${freelancer.hourlyRate}/hr</span>
              <Link href={`/freelancers/${freelancer.id}`}>
                <Button>View Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
