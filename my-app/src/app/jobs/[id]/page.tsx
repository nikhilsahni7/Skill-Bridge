"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/Skeleton";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  status: string;
  client: {
    clientProfile: {
      name: string;
      location: string;
      companyName: string;
      industry: string;
      description: string;
    };
  };
  proposals: Array<{
    id: string;
    freelancer: {
      name: string;
    };
    bidAmount: number;
    deliveryTime: number;
  }>;
}

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data.job);
        } else {
          throw new Error("Failed to fetch job details");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return <Skeleton />;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{job.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p>Budget: ${job.budget}</p>
              <p>Location: {job.client.clientProfile.location}</p>
              <p>Company: {job.client.clientProfile.companyName}</p>
              <p>Industry: {job.client.clientProfile.industry}</p>
            </div>
            <div>
              <p>
                Status: <Badge>{job.status}</Badge>
              </p>
              <div className="mt-2">
                <p>Skills:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Client Description</h3>
            <p>{job.client.clientProfile.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proposals ({job.proposals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {job.proposals.map((proposal) => (
            <div key={proposal.id} className="mb-4 p-4 border rounded">
              <p>Freelancer: {proposal.freelancer.name}</p>
              <p>Bid Amount: ${proposal.bidAmount}</p>
              <p>Delivery Time: {proposal.deliveryTime} days</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={() => {
          router.push(`/projects/${id}/proposals`);
        }}
      >
        Submit a Proposal
      </Button>
    </div>
  );
}
