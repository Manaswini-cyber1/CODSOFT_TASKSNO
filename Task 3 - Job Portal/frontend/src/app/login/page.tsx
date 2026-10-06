
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("careerhub_token", data.token);
      localStorage.setItem(
        "careerhub_user",
        JSON.stringify(data.user)
      );

      setMessage("Login successful! Redirecting...");

      if (data.user.role === "recruiter") {
        window.location.href = "/recruiter";
      } else {
        window.location.href = "/candidate";
      }
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
        <form className="form-card" onSubmit={login}>
          <h1>Welcome back</h1>
          <p className="muted">
            Login to continue to CareerHub.
          </p>

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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button
            className="btn full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="success">{message}</p>
          )}

          <p className="muted">
            Don't have an account?{" "}
            <Link href="/register">Register</Link>
          </p>
        </form>
      </section>
    </main>
  );
}