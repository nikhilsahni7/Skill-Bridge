// app/components/ClientDashboard.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BuildingIcon,
  BriefcaseIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  PlusCircleIcon,
} from "lucide-react";
import Logout from "@/components/Logout";
import ProjectList from "./ProjectsList";
import FreelancerList from "./FreelancerList";
import CreateProject from "./CreateProject";

interface ClientDashboardProps {
  user: any;
}

export default function ClientDashboard({ user }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState({
    activeProjects: 0,
    totalProjects: 0,
    projects: [],
    freelancers: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/client/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const { success, data } = await response.json();
        if (success) {
          setDashboardData(data);
        } else {
          throw new Error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Avatar className="h-20 w-20 mr-4">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.client?.companyName}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <Link href="/profile/edit">
            <Button variant="outline" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </Button>
          </Link>
          <Logout />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="create-project">Create Project</TabsTrigger>
          <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Projects
                  </CardTitle>
                  <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.activeProjects}
                  </div>
                  <Link href="/projects">
                    <Button variant="link" className="mt-4 p-0">
                      View Projects
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Projects
                  </CardTitle>
                  <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.totalProjects}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Company</CardTitle>
                  <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.client?.companyName}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Location
                  </CardTitle>
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.client?.location}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <GlobeIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{user.client?.website || "Not specified"}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{user.client?.phoneNumber || "Not specified"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge>{user.client?.industry || "Not specified"}</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="projects">
          <ProjectList projects={dashboardData.projects} isClientView={true} />
        </TabsContent>

        <TabsContent value="create-project">
          <CreateProject />
        </TabsContent>

        <TabsContent value="freelancers">
          <FreelancerList freelancers={dashboardData.freelancers} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
