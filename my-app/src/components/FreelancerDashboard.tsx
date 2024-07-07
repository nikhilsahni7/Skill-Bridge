// app/components/FreelancerDashboard.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  BriefcaseIcon,
  SearchIcon,
  StarIcon,
  DollarSignIcon,
  ClockIcon,
} from "lucide-react";
import Logout from "@/components/Logout";
import ProjectList from "./ProjectsList";
import ProposalList from "./ProposalsList";
import PortfolioSection from "./PortfolioSection";
import AllProjects from "./AllProjects";

interface FreelancerDashboardProps {
  user: any;
}

export default function FreelancerDashboard({
  user,
}: FreelancerDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState({
    activeJobs: 0,
    submittedProposals: 0,
    pendingProposals: 0,
    totalEarnings: 0,
    completionRate: 0,
    projects: [],
    proposals: [],
    portfolio: [],
  });

  const calculateNetEarnings = (totalEarnings: number) => {
    return totalEarnings * 0.9;
  };
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/freelancer/dashboard");
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

  const handlePortfolioUpdate = (updatedPortfolio: any) => {
    setDashboardData((prevData) => ({
      ...prevData,
      portfolio: updatedPortfolio,
    }));
  };

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
      {/* User Info Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Avatar className="h-20 w-20 mr-4">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.freelancer?.title}</p>
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

      {/* Dashboard Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="proposals">My Proposals</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="all-projects">All Projects</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Jobs
                  </CardTitle>
                  <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.activeJobs}
                  </div>
                  <Link href="/jobs">
                    <Button variant="link" className="mt-4 p-0">
                      View Jobs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Submitted Proposals
                  </CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.submittedProposals}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData.pendingProposals} awaiting response
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Earnings (After 10% Fee)
                  </CardTitle>
                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    $
                    {calculateNetEarnings(
                      dashboardData.totalEarnings
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    10% platform fee deducted
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Job Completion Rate
                  </CardTitle>
                  <StarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.completionRate}%
                  </div>
                  <Progress
                    value={dashboardData.completionRate}
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.freelancer?.skills.map(
                    (skill: string, index: number) => (
                      <Badge key={index}>{skill}</Badge>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="capitalize">
                  {user.freelancer?.availability.toLowerCase()}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <ProjectList projects={dashboardData.projects} isClientView={false} />
        </TabsContent>

        {/* Proposals Tab */}
        <TabsContent value="proposals">
          <ProposalList proposals={dashboardData.proposals} />
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <PortfolioSection
            portfolio={dashboardData.portfolio}
            onPortfolioUpdate={handlePortfolioUpdate}
          />
        </TabsContent>

        {/* All Projects Tab */}
        <TabsContent value="all-projects">
          <AllProjects />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
