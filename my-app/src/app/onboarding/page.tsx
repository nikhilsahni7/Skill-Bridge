"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaBriefcase, FaUserTie } from "react-icons/fa";
import Logout from "@/components/Logout";

export default function OnboardingPage() {
  const [userType, setUserType] = useState<"CLIENT" | "FREELANCER" | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const checkUserProfile = async () => {
      const response = await fetch("/api/user/type");
      const data = await response.json();
      if (data.userType) {
        router.push("/dashboard");
      }
    };
    checkUserProfile();
  }, [router]);

  const handleContinue = async () => {
    if (userType) {
      try {
        const response = await fetch("/api/user/type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType }),
        });
        if (response.ok) {
          router.push(`/onboarding/${userType.toLowerCase()}`);
        } else {
          throw new Error("Failed to set user type");
        }
      } catch (error) {
        console.error("Error setting user type:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-blue-600 dark:bg-gray-800 p-8 text-white flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">
                Welcome to SkillBridge
              </h1>
              <p className="text-xl mb-8">
                Your gateway to professional success
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-500 dark:bg-blue-700 rounded-full p-2 mr-4">
                    <FaBriefcase className="text-2xl" />
                  </div>
                  <p>Access top-tier talent or exciting projects</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-500 dark:bg-blue-700 rounded-full p-2 mr-4">
                    <FaUserTie className="text-2xl" />
                  </div>
                  <p>Build your professional network</p>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 p-8 bg-gray-50 dark:bg-gray-800">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Choose Your Path
              </h2>
              <div className="space-y-4 mb-8">
                <Button
                  onClick={() => setUserType("CLIENT")}
                  variant={userType === "CLIENT" ? "default" : "outline"}
                  size="lg"
                  className={`w-full text-lg justify-start space-x-4 ${
                    userType === "CLIENT"
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <FaUserTie className="text-2xl" />
                  <span>I want to hire talent</span>
                </Button>
                <Button
                  onClick={() => setUserType("FREELANCER")}
                  variant={userType === "FREELANCER" ? "default" : "outline"}
                  size="lg"
                  className={`w-full text-lg justify-start space-x-4 ${
                    userType === "FREELANCER"
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <FaBriefcase className="text-2xl" />
                  <span>I want to work on projects</span>
                </Button>
              </div>
              <Button
                onClick={handleContinue}
                disabled={!userType}
                size="lg"
                className="w-full text-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
