import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logout from "./Logout";

export default function ClientDashboard({ user }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <Link href="/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5</p>
            <Link href="/projects">
              <Button className="mt-4">View Projects</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <Link href="/proposals">
              <Button className="mt-4">View Proposals</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Post a New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/projects/new">
              <Button className="mt-4">Create Project</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <Logout />
    </div>
  );
}
