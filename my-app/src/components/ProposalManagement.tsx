// app/components/ProposalManagement.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Proposal {
  id: string;
  freelancer: {
    name: string;
  };
  bidAmount: number;
  deliveryTime: number;
  status: string;
}

interface Project {
  id: string;
  title: string;
}

interface ProposalManagementProps {
  projects: Project[];
}

export default function ProposalManagement({
  projects,
}: ProposalManagementProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    if (selectedProject) {
      fetchProposals(selectedProject);
    }
  }, [selectedProject]);

  const fetchProposals = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}/proposals`);
      if (response.ok) {
        const data = await response.json();
        setProposals(data.proposals);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const handleProposalAction = async (proposalId: string, status: string) => {
    try {
      const response = await fetch(
        `/api/projects/${selectedProject}/proposals`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proposalId, status }),
        }
      );

      if (response.ok) {
        fetchProposals(selectedProject!);
      }
    } catch (error) {
      console.error("Error updating proposal:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Proposals</h2>
      <select
        value={selectedProject || ""}
        onChange={(e) => setSelectedProject(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select a project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.title}
          </option>
        ))}
      </select>

      {selectedProject && proposals.length > 0 ? (
        proposals.map((proposal) => (
          <Card key={proposal.id}>
            <CardHeader>
              <CardTitle>{proposal.freelancer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge>{proposal.status}</Badge>
                <span>Bid Amount: ${proposal.bidAmount}</span>
                <span>Delivery Time: {proposal.deliveryTime} days</span>
              </div>
              {proposal.status === "PENDING" && (
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      handleProposalAction(proposal.id, "ACCEPTED")
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleProposalAction(proposal.id, "REJECTED")
                    }
                  >
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No proposals found for this project.</p>
      )}
    </div>
  );
}
