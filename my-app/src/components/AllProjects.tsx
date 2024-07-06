// app/components/AllProjects.tsx
"use client";
import { useState, useEffect } from "react";
import ProjectList from "./ProjectsList";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects/all");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects);
        } else {
          throw new Error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Available Projects</h2>
      <ProjectList projects={projects} isClientView={false} />
    </div>
  );
}
