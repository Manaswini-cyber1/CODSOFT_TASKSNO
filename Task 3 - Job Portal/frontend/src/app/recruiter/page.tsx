
"use client";

import { useState } from "react";
import Link from "next/link";

const pipeline = [
  { title: "Python Developer", department: "Engineering", applicants: 12, shortlisted: 3 },
  { title: "Frontend Developer", department: "Design & Engineering", applicants: 8, shortlisted: 2 },
  { title: "Software Engineer", department: "Technology", applicants: 4, shortlisted: 1 },
];

export default function RecruiterPage() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function postJob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, company, location }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not post job.");
      }

      setMessage("Job posted successfully!");
      setTitle("");
      setCompany("");
      setLocation("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Backend connection failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="recruiter-layout">
      <aside className="recruiter-sidebar">
        <Link href="/" className="recruiter-brand">
          <span className="recruiter-brand-icon">C</span>
          <span>Career<span className="recruiter-brand-highlight">Hub</span></span>
        </Link>

        <p className="recruiter-menu-label">WORKSPACE</p>

        <nav className="recruiter-nav">
          <Link href="/recruiter" className="recruiter-nav-link active">
            <span className="recruiter-nav-icon">▦</span>
            Overview
          </Link>
          <a href="#pipeline" className="recruiter-nav-link">
            <span className="recruiter-nav-icon">▤</span>
            Manage Jobs
          </a>
          <a href="#applications" className="recruiter-nav-link">
            <span className="recruiter-nav-icon">♙</span>
            Applicants
          </a>
          <Link href="/jobs" className="recruiter-nav-link">
            <span className="recruiter-nav-icon">⌕</span>
            View Job Board
          </Link>
          <a href="#post-job" className="recruiter-nav-link">
            <span className="recruiter-nav-icon">＋</span>
            Post a Job
          </a>
        </nav>

        <div className="recruiter-sidebar-bottom">
          <div className="recruiter-sidebar-tip">
            <span>✦</span>
            <strong>Hiring tip</strong>
            <p>Clear job descriptions help attract relevant candidates.</p>
            <a href="#post-job">Create a job →</a>
          </div>
          <p>© 2026 CareerHub</p>
        </div>
      </aside>

      <div className="recruiter-main">
        <header className="recruiter-topbar">
          <div className="recruiter-topbar-title">
            <span className="recruiter-hamburger">☰</span>
            Recruiter Dashboard
          </div>

          <div className="recruiter-search">
            <span>⌕</span>
            <input placeholder="Search candidates or jobs..." />
          </div>

          <div className="recruiter-user">
            <div className="recruiter-avatar">R</div>
            <div className="recruiter-user-info">
              <strong>Recruiter</strong>
              <span>Hiring Manager</span>
            </div>
            <Link href="/login">Logout</Link>
          </div>
        </header>

        <div className="recruiter-content">
          <section className="recruiter-welcome">
            <div>
              <p className="recruiter-eyebrow">HIRING WORKSPACE</p>
              <h1>Good day, Recruiter! <span>✦</span></h1>
              <p>Here's an overview of your recruitment activity.</p>
            </div>
            <a href="#post-job" className="recruiter-primary-btn">
              + Post a New Job
            </a>
          </section>

          <section className="recruiter-stats">
            <article className="recruiter-stat recruiter-stat-purple">
              <div className="recruiter-stat-icon">▣</div>
              <div>
                <p>Active Jobs</p>
                <strong>3</strong>
                <span>Currently listed</span>
              </div>
            </article>
            <article className="recruiter-stat recruiter-stat-blue">
              <div className="recruiter-stat-icon">♙</div>
              <div>
                <p>Total Applicants</p>
                <strong>24</strong>
                <span>Across all jobs</span>
              </div>
            </article>
            <article className="recruiter-stat recruiter-stat-green">
              <div className="recruiter-stat-icon">✓</div>
              <div>
                <p>Shortlisted</p>
                <strong>6</strong>
                <span>Potential candidates</span>
              </div>
            </article>
            <article className="recruiter-stat recruiter-stat-orange">
              <div className="recruiter-stat-icon">◷</div>
              <div>
                <p>New Applicants</p>
                <strong>8</strong>
                <span>Demo figure</span>
              </div>
            </article>
          </section>

          <section className="recruiter-main-grid">
            <div className="recruiter-primary-column">
              <article className="recruiter-panel recruiter-post-panel" id="post-job">
                <div className="recruiter-panel-heading">
                  <div>
                    <h2>Post a New Job</h2>
                    <p>Find the right people for your team.</p>
                  </div>
                  <span className="recruiter-heading-icon">＋</span>
                </div>

                <form onSubmit={postJob} className="recruiter-form">
                  <div className="recruiter-form-field">
                    <label htmlFor="job-title">Job title</label>
                    <input
                      id="job-title"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Python Developer"
                    />
                  </div>

                  <div className="recruiter-form-field">
                    <label htmlFor="company-name">Company name</label>
                    <input
                      id="company-name"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. TechNova"
                    />
                  </div>

                  <div className="recruiter-form-field">
                    <label htmlFor="job-location">Job location</label>
                    <input
                      id="job-location"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Hyderabad or Remote"
                    />
                  </div>

                  <button
                    className="recruiter-primary-btn recruiter-submit"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Publishing..." : "Publish Job  →"}
                  </button>

                  {message && (
                    <p
                      className={
                        message === "Job posted successfully!"
                          ? "recruiter-form-message recruiter-message-success"
                          : "recruiter-form-message recruiter-message-error"
                      }
                      role="status"
                    >
                      {message}
                    </p>
                  )}
                </form>
                <p className="recruiter-form-note">
                  Your job will be submitted to the CareerHub backend.
                </p>
              </article>

              <article className="recruiter-panel" id="pipeline">
                <div className="recruiter-panel-heading">
                  <div>
                    <h2>Recruitment Pipeline</h2>
                    <p>Review the progress of your open positions.</p>
                  </div>
                  <span className="recruiter-small-tag">3 positions</span>
                </div>

                <div className="recruiter-pipeline-list">
                  {pipeline.map((job, index) => (
                    <div className="recruiter-pipeline-item" key={index}>
                      <div className="recruiter-pipeline-symbol">
                        {job.title.charAt(0)}
                      </div>
                      <div className="recruiter-pipeline-info">
                        <strong>{job.title}</strong>
                        <span>{job.department}</span>
                        <div className="recruiter-pipeline-meta">
                          <span>{job.applicants} applicants</span>
                          <span>{job.shortlisted} shortlisted</span>
                        </div>
                      </div>
                      <span className="recruiter-active-badge">Active</span>
                    </div>
                  ))}
                </div>
                <Link href="/jobs" className="recruiter-text-link">
                  View job board →
                </Link>
              </article>
            </div>

            <div className="recruiter-secondary-column">
              <article className="recruiter-panel recruiter-insight-panel">
                <div className="recruiter-panel-heading">
                  <div>
                    <h2>Hiring Snapshot</h2>
                    <p>Sample recruitment metrics</p>
                  </div>
                </div>

                <div className="recruiter-donut-wrap">
                  <div className="recruiter-donut">
                    <div>
                      <strong>24</strong>
                      <span>Applicants</span>
                    </div>
                  </div>
                </div>

                <div className="recruiter-legend">
                  <div><i className="recruiter-legend-purple" /> Under review <strong>12</strong></div>
                  <div><i className="recruiter-legend-green" /> Shortlisted <strong>6</strong></div>
                  <div><i className="recruiter-legend-orange" /> Other <strong>6</strong></div>
                </div>
                <p className="recruiter-demo-note">
                  Illustrative figures, not connected to applicant records yet.
                </p>
              </article>

              <article className="recruiter-panel recruiter-quick-panel" id="applications">
                <div className="recruiter-panel-heading">
                  <div>
                    <h2>Quick Actions</h2>
                    <p>Manage your hiring workflow.</p>
                  </div>
                </div>
                <Link href="/jobs" className="recruiter-quick-action">
                  <span className="quick-action-icon quick-purple">⌕</span>
                  <span><strong>Browse job board</strong><small>See published openings</small></span>
                  <b>→</b>
                </Link>
                <a href="#post-job" className="recruiter-quick-action">
                  <span className="quick-action-icon quick-blue">＋</span>
                  <span><strong>Create a job</strong><small>Publish a new opportunity</small></span>
                  <b>→</b>
                </a>
                <a href="#pipeline" className="recruiter-quick-action">
                  <span className="quick-action-icon quick-green">▤</span>
                  <span><strong>Review pipeline</strong><small>Check your open roles</small></span>
                  <b>→</b>
                </a>
              </article>
            </div>
          </section>

          <footer className="recruiter-footer">
            <span>© 2026 CareerHub. All rights reserved.</span>
            <span>Connecting people with opportunities.</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
