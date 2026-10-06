
"use client";

import Link from "next/link";

const applications = [
  {
    role: "Python Developer",
    company: "TechNova",
    status: "Under Review",
    date: "Sep 28, 2026",
  },
  {
    role: "Frontend Developer",
    company: "WebWorks",
    status: "Shortlisted",
    date: "Sep 25, 2026",
  },
  {
    role: "Software Engineer",
    company: "InnovateX",
    status: "Applied",
    date: "Sep 22, 2026",
  },
];

const recommendedJobs = [
  {
    company: "TechNova",
    initials: "T",
    role: "Python Developer",
    type: "Full-time",
    location: "Hyderabad",
    color: "purple",
  },
  {
    company: "WebWorks",
    initials: "W",
    role: "Frontend Developer",
    type: "Internship",
    location: "Remote",
    color: "orange",
  },
  {
    company: "InnovateX",
    initials: "I",
    role: "Software Engineer",
    type: "Full-time",
    location: "Bengaluru",
    color: "blue",
  },
];

export default function CandidatePage() {
  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const underReview = applications.filter(
    (app) => app.status === "Under Review"
  ).length;

  return (
    <main className="candidate-layout">
      <aside className="candidate-sidebar">
        <Link href="/" className="candidate-brand">
          <span className="brand-symbol">C</span>
          <span>Career<span className="brand-highlight">Hub</span></span>
        </Link>

        <p className="sidebar-label">MENU</p>

        <nav className="sidebar-nav">
          <Link href="/candidate" className="sidebar-link active">
            <span className="sidebar-icon">▦</span>
            Dashboard
          </Link>
          <Link href="/jobs" className="sidebar-link">
            <span className="sidebar-icon">⌕</span>
            Search Jobs
          </Link>
          <a href="#applications" className="sidebar-link">
            <span className="sidebar-icon">▤</span>
            Applications
          </a>
          <a href="#activity" className="sidebar-link">
            <span className="sidebar-icon">✉</span>
            Messages
          </a>
          <a href="#analytics" className="sidebar-link">
            <span className="sidebar-icon">◔</span>
            Statistics
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">✦</span>
            <strong>CareerHub Tips</strong>
            <p>Keep your profile updated to improve your job search.</p>
            <Link href="/register">Edit profile →</Link>
          </div>
          <p className="sidebar-footer">© 2026 CareerHub</p>
        </div>
      </aside>

      <div className="candidate-main">
        <header className="candidate-topbar">
          <div className="topbar-title">
            <span className="topbar-menu">☰</span>
            <span>Dashboard</span>
          </div>

          <div className="topbar-search">
            <span>⌕</span>
            <input placeholder="Search jobs, companies..." />
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">M</div>
            <div>
              <strong>Candidate</strong>
              <span>Job Seeker</span>
            </div>
            <Link href="/login" className="logout-link">
              Logout
            </Link>
          </div>
        </header>

        <div className="candidate-content">
          <section className="dashboard-welcome">
            <div>
              <p className="dashboard-eyebrow">CANDIDATE WORKSPACE</p>
              <h1>Welcome back, Candidate! <span>✦</span></h1>
              <p>Here's what's happening with your job search today.</p>
            </div>
            <Link href="/jobs" className="dashboard-primary-btn">
              + Find a Job
            </Link>
          </section>

          <section className="candidate-stats">
            <article className="candidate-stat stat-purple">
              <div className="stat-icon">▤</div>
              <div>
                <p>Total Applications</p>
                <strong>{applications.length}</strong>
                <span>Applications submitted</span>
              </div>
            </article>

            <article className="candidate-stat stat-blue">
              <div className="stat-icon">✧</div>
              <div>
                <p>Shortlisted</p>
                <strong>{shortlisted}</strong>
                <span>Companies interested</span>
              </div>
            </article>

            <article className="candidate-stat stat-green">
              <div className="stat-icon">◷</div>
              <div>
                <p>Under Review</p>
                <strong>{underReview}</strong>
                <span>Awaiting a response</span>
              </div>
            </article>

            <article className="candidate-stat stat-orange">
              <div className="stat-icon">✉</div>
              <div>
                <p>Interviews</p>
                <strong>0</strong>
                <span>Scheduled interviews</span>
              </div>
            </article>
          </section>

          <section className="candidate-panels">
            <div className="candidate-left-column">
              <article className="profile-panel">
                <div className="panel-heading">
                  <h2>My Profile</h2>
                  <Link href="/register">Edit</Link>
                </div>
                <div className="profile-details">
                  <div className="profile-avatar">M</div>
                  <h3>Candidate</h3>
                  <p>Job Seeker</p>
                  <span className="profile-badge">Profile setup demo</span>
                </div>
                <div className="profile-progress">
                  <div className="progress-heading">
                    <span>Profile completion</span>
                    <strong>60%</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" />
                  </div>
                  <p>Add your skills and experience to complete your profile.</p>
                </div>
                <Link href="/register" className="profile-edit-btn">
                  Complete Profile
                </Link>
              </article>

              <article className="activity-panel" id="activity">
                <div className="panel-heading">
                  <h2>Recent Activity</h2>
                  <span className="panel-muted">Latest</span>
                </div>
                {applications.slice(0, 3).map((app, index) => (
                  <div className="activity-item" key={index}>
                    <div className="activity-icon">
                      {index === 0 ? "✓" : "↗"}
                    </div>
                    <div className="activity-copy">
                      <strong>{app.status === "Shortlisted"
                        ? "You've been shortlisted!"
                        : "Application submitted"}
                      </strong>
                      <p>{app.role} · {app.company}</p>
                      <span>{app.date}</span>
                    </div>
                  </div>
                ))}
              </article>
            </div>

            <div className="candidate-right-column">
              <article className="analytics-panel" id="analytics">
                <div className="panel-heading">
                  <div>
                    <h2>Application Overview</h2>
                    <p className="panel-muted">Your job search at a glance</p>
                  </div>
                  <span className="chart-period">This month⌄</span>
                </div>

                <div className="chart-legend">
                  <span><i className="legend-purple" /> Applications</span>
                  <span><i className="legend-green" /> Shortlisted</span>
                </div>

                <div className="candidate-chart">
                  <div className="chart-y-labels">
                    <span>3</span>
                    <span>2</span>
                    <span>1</span>
                    <span>0</span>
                  </div>
                  <svg
                    viewBox="0 0 600 210"
                    role="img"
                    aria-label="Illustrative application activity chart"
                    preserveAspectRatio="none"
                  >
                    <line x1="0" y1="20" x2="600" y2="20" className="chart-gridline" />
                    <line x1="0" y1="75" x2="600" y2="75" className="chart-gridline" />
                    <line x1="0" y1="130" x2="600" y2="130" className="chart-gridline" />
                    <line x1="0" y1="185" x2="600" y2="185" className="chart-gridline" />
                    <path
                      d="M 0 165 C 55 165, 55 38, 120 65 S 190 145, 250 115 S 340 165, 400 90 S 500 120, 600 45"
                      className="chart-line-purple"
                    />
                    <path
                      d="M 0 185 C 60 185, 75 150, 130 165 S 220 185, 280 150 S 360 185, 420 160 S 520 180, 600 145"
                      className="chart-line-green"
                    />
                  </svg>
                </div>
                <div className="chart-x-labels">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
                <p className="chart-note">
                  Illustrative chart · Connect application history for live analytics.
                </p>
              </article>

              <article className="recommended-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recommended Jobs</h2>
                    <p className="panel-muted">Explore more opportunities</p>
                  </div>
                  <Link href="/jobs">View all →</Link>
                </div>

                <div className="recommended-list">
                  {recommendedJobs.map((job, index) => (
                    <div className="recommended-job" key={index}>
                      <div className={`recommended-icon ${job.color}`}>
                        {job.initials}
                      </div>
                      <div className="recommended-copy">
                        <strong>{job.role}</strong>
                        <p>{job.company} · {job.location}</p>
                        <span>{job.type}</span>
                      </div>
                      <Link href="/jobs" className="job-arrow">↗</Link>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section className="applications-panel" id="applications">
            <div className="panel-heading">
              <div>
                <h2>My Applications</h2>
                <p className="panel-muted">Track the progress of your applications.</p>
              </div>
              <Link href="/jobs" className="dashboard-primary-btn">
                Browse Jobs
              </Link>
            </div>

            <div className="application-table">
              <div className="application-table-head">
                <span>POSITION</span>
                <span>COMPANY</span>
                <span>DATE APPLIED</span>
                <span>STATUS</span>
              </div>
              {applications.map((app, index) => (
                <div className="application-table-row" key={index}>
                  <strong>{app.role}</strong>
                  <span>{app.company}</span>
                  <span>{app.date}</span>
                  <span>
                    <i className={`application-status ${
                      app.status === "Shortlisted"
                        ? "status-shortlisted"
                        : app.status === "Under Review"
                        ? "status-review"
                        : "status-applied"
                    }`}>
                      {app.status}
                    </i>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <footer className="candidate-footer">
            <span>© 2026 CareerHub. All rights reserved.</span>
            <span>Build your future with confidence.</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
