// app/jobs/page.tsx
import JobListings from "@/components/JobListings";

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Listings</h1>
      <JobListings />
    </div>
  );
}
