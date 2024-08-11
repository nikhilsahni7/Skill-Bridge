// app/components/FreelancerDashboard.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from "next-themes";
import {
  CalendarIcon,
  BriefcaseIcon,
  StarIcon,
  DollarSignIcon,
  ClockIcon,
  RefreshCcwIcon,
  MenuIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import Logout from "@/components/Logout";
import MyProjects from "./MyProjects";
import ProposalList from "./ProposalsList";
import PortfolioSection from "./PortfolioSection";
import AllProjects from "./AllProjects";
import {
  FaInstagram,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import ChatList from "./ChatList";

interface FreelancerDashboardProps {
  user: {
    name: string;
    image: string;
    freelancer?: {
      title: string;
      skills: string[];
      availability: string;
    };
  };
}

interface DashboardData {
  activeJobs: number;
  submittedProposals: number;
  pendingProposals: number;
  totalEarnings: number;
  completedProjects: number;
  completionRate: number;
  projects: Project[];
  proposals: Proposal[];
  portfolio: PortfolioProject[];
}

interface Project {
  id: string;
  title: string;
  status: string;
  deadline: string;
  budget: number;
  proposals: number;
  description?: string;
  skills?: string[];
}

interface Proposal {
  id: string;
  projectTitle: string;
  projectStatus: string;
  status: string;
  bidAmount: number;
  deliveryTime: number;
}

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  projectUrl: string | null;
}

const socialMediaLinks = [
  {
    Icon: FaInstagram,
    url: "https://www.instagram.com/iam.nikhil7?igsh=cTFyZDh0NXk0eGNs",
  },
  {
    Icon: FaFacebookF,
    url: "https://www.instagram.com/iam.nikhil7?igsh=cTFyZDh0NXk0eGNs",
  },
  {
    Icon: FaSquareXTwitter,
    url: "https://x.com/Nikhilllsahni?t=GwfnmO3UaBbk5W5Fk2FjsQ&s=09",
  },
  { Icon: FaGithub, url: "https://github.com/nikhilsahni7" },
  {
    Icon: FaLinkedinIn,
    url: "https://www.linkedin.com/in/nikhil-sahni-655518222?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
];

export default function FreelancerDashboard({
  user,
}: FreelancerDashboardProps) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    activeJobs: 0,
    submittedProposals: 0,
    pendingProposals: 0,
    totalEarnings: 0,
    completedProjects: 0,
    completionRate: 0,
    projects: [],
    proposals: [],
    portfolio: [],
  });
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDashboardData = useCallback(async () => {
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
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const calculateNetEarnings = (totalEarnings: number) => {
    return totalEarnings * 0.9;
  };

  const handlePortfolioUpdate = (updatedPortfolio: PortfolioProject[]) => {
    setDashboardData((prevData) => ({
      ...prevData,
      portfolio: updatedPortfolio,
    }));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
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
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">
                {user.freelancer?.title}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && (theme === "dark" ? <SunIcon /> : <MoonIcon />)}
            </Button>
            <Button variant="outline" size="icon" onClick={fetchDashboardData}>
              <RefreshCcwIcon className="h-4 w-4" />
            </Button>
            <div className="md:hidden">
              <Button variant="outline" size="icon" onClick={toggleMobileMenu}>
                <MenuIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="hidden md:flex space-x-2">
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
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-background shadow-lg rounded-lg p-4 mb-4"
            >
              <Link href="/profile/edit">
                <Button variant="ghost" className="w-full justify-start mb-2">
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-secondary flex flex-wrap justify-start ">
            <TabsTrigger
              value="overview"
              className="flex-grow text-xs sm:text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="flex-grow text-xs sm:text-sm"
            >
              My Projects
            </TabsTrigger>
            <TabsTrigger
              value="proposals"
              className="flex-grow text-xs sm:text-sm"
            >
              My Proposals
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="flex-grow text-xs sm:text-sm"
            >
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="flex-grow text-xs sm:text-sm"
            >
              Messages
            </TabsTrigger>

            <TabsTrigger
              value="all-projects"
              className="flex-grow text-xs sm:text-sm  "
            >
              All Projects
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div variants={cardVariants}>
                <Card className="bg-primary text-primary-foreground hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Jobs
                    </CardTitle>
                    <BriefcaseIcon className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.activeJobs}
                    </div>
                    <Link href="/jobs">
                      <Button variant="secondary" className="mt-4 w-full">
                        View Jobs
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card className="bg-secondary text-secondary-foreground hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Submitted Proposals
                    </CardTitle>
                    <CalendarIcon className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.submittedProposals}
                    </div>
                    <p className="text-xs mt-2">
                      {dashboardData.pendingProposals} awaiting response
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card className="bg-accent text-accent-foreground hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Net Earnings
                    </CardTitle>
                    <DollarSignIcon className="h-4 w-4" />
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
                    <p className="text-xs mt-2">After 10% platform fee</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Job Completion Rate
                    </CardTitle>
                    <StarIcon className="h-4 w-4 text-yellow-400" />
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
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Your Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.freelancer?.skills.map(
                      (skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="hover:shadow-lg transition-shadow">
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

            <motion.div variants={cardVariants}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Connect with Nikhil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-4">
                    {socialMediaLinks.map(({ Icon, url }, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl hover:text-primary transition-colors"
                      >
                        <Icon />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* My Projects tab */}
          <TabsContent value="projects">
            <MyProjects />
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
          {/* messages */}
          <TabsContent value="messages">
            <ChatList />
          </TabsContent>

          {/* All Projects Tab */}
          <TabsContent value="all-projects">
            <AllProjects />
          </TabsContent>
        </Tabs>

        <Toaster />

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Made with ❤️ by Vishal Sharma</p>
          <p className="mt-2">
            © 2024 Freelancer Dashboard. All rights reserved.
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
