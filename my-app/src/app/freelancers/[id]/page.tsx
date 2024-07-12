"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/Skeleton";
import ChatModal from "@/components/ChatModal";
import { DollarSignIcon, BriefcaseIcon } from "lucide-react";

interface FreelancerProfile {
  id: string;
  userId: string;
  title: string;
  skills: string[];
  experienceLevel: string;
  education: string | null;
  certifications: string[];
  hourlyRate: number;
  availability: string;
  completedProjects: number;
  totalEarnings: number;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  portfolio: {
    id: string;
    projects: {
      id: string;
      title: string;
      description: string;
      imageUrl: string | null;
      projectUrl: string | null;
    }[];
  } | null;
}

export default function FreelancerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const response = await fetch(`/api/freelancers/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setFreelancer(data);
        } else {
          throw new Error("Failed to fetch freelancer");
        }
      } catch (error) {
        console.error("Error fetching freelancer:", error);
        setError("Failed to load freelancer details");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancer();
  }, [params.id]);

  const handleContactFreelancer = () => {
    setIsChatOpen(true);
  };

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!freelancer) {
    return <div className="text-center">Freelancer not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={freelancer.user.image}
                alt={freelancer.user.name}
              />
              <AvatarFallback>{freelancer.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{freelancer.user.name}</CardTitle>
              <p className="text-gray-500">{freelancer.title}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Experience Level:</strong> {freelancer.experienceLevel}
            </div>
            <div className="flex items-center">
              <strong>Hourly Rate:</strong>
              <span className="ml-2 flex items-center">
                <DollarSignIcon className="h-4 w-4 mr-1" />$
                {freelancer.hourlyRate}/hour
              </span>
            </div>
            <div>
              <strong>Availability:</strong> {freelancer.availability}
            </div>
            <div>
              <strong>Education:</strong>{" "}
              {freelancer.education || "Not specified"}
            </div>
            <div className="flex items-center">
              <strong>Completed Projects:</strong>
              <span className="ml-2 flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                {freelancer.completedProjects}
              </span>
            </div>
            <div>
              <strong>Total Earnings:</strong> $
              {freelancer.totalEarnings.toFixed(2)}
            </div>
          </div>
          <div className="mb-4">
            <strong>Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {freelancer.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          {freelancer.certifications.length > 0 && (
            <div className="mb-4">
              <strong>Certifications:</strong>
              <ul className="list-disc list-inside mt-2">
                {freelancer.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
          {freelancer.portfolio && (
            <div className="mb-4">
              <strong>Portfolio Projects:</strong>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {freelancer.portfolio.projects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {project.description}
                      </p>
                      {project.projectUrl && (
                        <Link
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="mt-2">
                            View Project
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleContactFreelancer}>Contact Freelancer</Button>
        </CardContent>
      </Card>
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        receiverId={freelancer.userId}
        receiverName={freelancer.user.name}
      />
    </div>
  );
}
