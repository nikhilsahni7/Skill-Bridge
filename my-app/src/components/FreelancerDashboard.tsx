import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logout from "./Logout";

export default function FreelancerDashboard({ user }: any) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
            <Link href="/jobs">
              <Button className="mt-4">View Jobs</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Submitted Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
            <Link href="/proposals">
              <Button className="mt-4">View Proposals</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Find New Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/projects/search">
              <Button className="mt-4">Search Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <Logout />
    </div>
  );
}
