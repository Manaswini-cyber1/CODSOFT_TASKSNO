
import Link from "next/link";

const jobs = [
  {
    id: 1,
    title: "Python Developer",
    company: "TechNova",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹4–7 LPA",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "WebWorks",
    location: "Remote",
    type: "Internship",
    salary: "₹15k/month",
  },
  {
    id: 3,
    title: "Software Engineer",
    company: "InnovateX",
    location: "Bengaluru",
    type: "Full-time",
    salary: "₹6–10 LPA",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <Link href="/" className="logo">
          Career<span>Hub</span>
        </Link>

        <div className="navlinks">
          <Link href="/">Home</Link>
          <Link href="/jobs">Find Jobs</Link>
          <Link href="/recruiter">For Recruiters</Link>
        </div>

        <div className="navbuttons">
          <Link href="/login" className="login">
            Login
          </Link>
          <Link href="/register" className="btn">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">YOUR CAREER STARTS HERE</p>

          <h1>
            Find a job that
            <br />
            matches your <span>ambition.</span>
          </h1>

          <p className="hero-text">
            Discover opportunities, connect with companies,
            and take the next step in your career.
          </p>

          <form action="/jobs" className="searchbox">
            <input
              name="q"
              placeholder="Job title or keyword"
            />
            <input
              name="location"
              placeholder="Location"
            />
            <button className="btn searchbtn" type="submit">
              Search Jobs
            </button>
          </form>

          <p className="popular">
            Popular: Python Developer · Designer · Intern
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OPPORTUNITIES</p>
            <h2>Featured jobs</h2>
            <p>
              Explore opportunities from companies looking for talent.
            </p>
          </div>

          <Link href="/jobs" className="viewall">
            View all jobs →
          </Link>
        </div>

        <div className="job-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="job-top">
                <div className="company-icon">
                  {job.company[0]}
                </div>
                <span className="job-type">{job.type}</span>
              </div>

              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>
              <p className="location">📍 {job.location}</p>

              <div className="job-bottom">
                <strong>{job.salary}</strong>
                <Link href="/jobs" className="apply">
                  View Job →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="callout">
        <div>
          <h2>Looking to hire?</h2>
          <p>
            Find the right people and build your team with CareerHub.
          </p>
        </div>

        <Link href="/recruiter" className="btn">
          Post a Job
        </Link>
      </section>

      <footer>
        <Link href="/" className="logo">
          Career<span>Hub</span>
        </Link>
        <p>Connecting talent with opportunity.</p>
        <p>© 2026 CareerHub</p>
      </footer>
    </main>
  );
}