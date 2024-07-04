import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProposalList({ proposals }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Proposals</h2>
      {proposals.map((proposal: any) => (
        <Card key={proposal.id}>
          <CardHeader>
            <CardTitle>{proposal.projectTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Badge>{proposal.status}</Badge>
              <span>Bid Amount: ${proposal.bidAmount}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
