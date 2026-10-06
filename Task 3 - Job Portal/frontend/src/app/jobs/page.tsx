
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description?: string;
};

const sampleJobs: Job[] = [
  { id: 1, title: "Python Developer", company: "TechNova", location: "Hyderabad", type: "Full-time", salary: "₹4–7 LPA" },
  { id: 2, title: "Frontend Developer", company: "WebWorks", location: "Remote", type: "Internship", salary: "₹15k/month" },
  { id: 3, title: "Software Engineer", company: "InnovateX", location: "Bengaluru", type: "Full-time", salary: "₹6–10 LPA" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("API unavailable");
        return res.json();
      })
      .then((data: Job[]) => setJobs(data))
      .catch(() => setJobs(sampleJobs));
  }, []);

  const filtered = jobs.filter((job) =>
    (job.title + " " + job.company).toLowerCase().includes(query.toLowerCase()) &&
    job.location.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <main>
      <nav className="navbar">
        <Link href="/" className="logo">Career<span>Hub</span></Link>
        <div className="navlinks">
          <Link href="/">Home</Link>
          <Link href="/jobs">Find Jobs</Link>
          <Link href="/recruiter">For Recruiters</Link>
        </div>
        <div className="navbuttons">
          <Link href="/login" className="login">Login</Link>
          <Link href="/register" className="btn">Sign Up</Link>
        </div>
      </nav>

      <section className="page-wrap">
        <p className="eyebrow">CAREER OPPORTUNITIES</p>
        <h1 className="page-title">Find your next job</h1>
        <p className="muted">Search jobs and explore new opportunities.</p>

        <div className="searchbox">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Job title or company" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        </div>

        <div className="job-list">
          {filtered.map((job) => (
            <article className="job-card" key={job.id}>
              <div>
                <span className="status">{job.type}</span>
                <h2>{job.title}</h2>
                <p className="company">{job.company}</p>
                <p className="location">📍 {job.location} · {job.salary}</p>
                {job.description && <p className="muted">{job.description}</p>}
              </div>
              <Link href="/login" className="btn">Apply Now</Link>
            </article>
          ))}
          {filtered.length === 0 && <p>No matching jobs found.</p>}
        </div>
      </section>
    </main>
  );
}