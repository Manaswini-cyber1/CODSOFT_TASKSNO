
"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      setMessage(
        "Registration successful! You can now login."
      );
      setName("");
      setEmail("");
      setPassword("");
      setRole("candidate");
    } catch (error) {
      setMessage(
        "Cannot connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <nav className="navbar">
        <Link href="/" className="logo">
          Career<span>Hub</span>
        </Link>
        <Link href="/jobs">Find Jobs</Link>
      </nav>

      <section className="page-wrap">
        <form className="form-card" onSubmit={register}>
          <h1>Create an account</h1>
          <p className="muted">
            Join CareerHub as a candidate or recruiter.
          </p>

          <div className="field">
            <label>Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="field">
            <label>Register as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button
            className="btn full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {message && (
            <p className="success">{message}</p>
          )}

          <p className="muted">
            Already registered?{" "}
            <Link href="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}