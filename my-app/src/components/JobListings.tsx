// app/components/JobListings.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "./Skeleton";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  status: string;
  client: {
    name: string;
    companyName: string;
    location: string;
    clientProfile: {
      industry: string;
      description: string;
    };
  };
}

export default function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [status, page, searchTerm]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/jobs?status=${status}&page=${page}&search=${searchTerm}`
      );
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } else {
        throw new Error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{job.description}</p>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p>Budget: ${job.budget}</p>
                <p>Name: {job.client.name}</p>
                <p>Industry: {job.client.clientProfile.industry}</p>
              </div>
              <div className="space-y-2">
                <div className="space-x-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index}>{skill}</Badge>
                  ))}
                </div>
                <Badge
                  variant={job.status === "OPEN" ? "default" : "secondary"}
                >
                  {job.status}
                </Badge>
                <Link href={`/jobs/${job.id}`}>
                  <Button>View Details</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center space-x-2 mt-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
