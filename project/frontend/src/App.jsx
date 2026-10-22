import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import ChatbotWidget from "./components/ChatbotWidget";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobListings from "./pages/JobListings";
import JobDetails from "./pages/JobDetails";

import CandidateApplications from "./pages/candidate/CandidateApplications";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateSavedJobs from "./pages/candidate/CandidateSavedJobs";
import CandidateInterviews from "./pages/candidate/CandidateInterviews";

import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import PostJob from "./pages/recruiter/PostJob";
import RecruiterApplicants from "./pages/recruiter/RecruiterApplicants";
import RecruiterAnalytics from "./pages/recruiter/RecruiterAnalytics";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";

import AdminDashboard from "./pages/admin/AdminDashboard";

const candidateNav = [
  { to: "/candidate/applications", label: "My Applications", end: true },
  { to: "/candidate/saved", label: "Saved Jobs" },
  { to: "/candidate/interviews", label: "Interviews" },
  { to: "/candidate/profile", label: "My Profile" },
];

const recruiterNav = [
  { to: "/recruiter/jobs", label: "My Postings", end: true },
  { to: "/recruiter/post-job", label: "Post a Job" },
  { to: "/recruiter/interviews", label: "Interviews" },
  { to: "/recruiter/analytics", label: "Analytics" },
];

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Candidate */}
        <Route
          path="/candidate/applications"
          element={
            <ProtectedRoute role="candidate">
              <DashboardLayout items={candidateNav}>
                <CandidateApplications />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/saved"
          element={
            <ProtectedRoute role="candidate">
              <DashboardLayout items={candidateNav}>
                <CandidateSavedJobs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/profile"
          element={
            <ProtectedRoute role="candidate">
              <DashboardLayout items={candidateNav}>
                <CandidateProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/interviews"
          element={
            <ProtectedRoute role="candidate">
              <DashboardLayout items={candidateNav}>
                <CandidateInterviews />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Recruiter */}
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute role="recruiter">
              <DashboardLayout items={recruiterNav}>
                <RecruiterJobs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/post-job"
          element={
            <ProtectedRoute role="recruiter">
              <DashboardLayout items={recruiterNav}>
                <PostJob />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id/applicants"
          element={
            <ProtectedRoute role="recruiter">
              <DashboardLayout items={recruiterNav}>
                <RecruiterApplicants />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/interviews"
          element={
            <ProtectedRoute role="recruiter">
              <DashboardLayout items={recruiterNav}>
                <RecruiterInterviews />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/analytics"
          element={
            <ProtectedRoute role="recruiter">
              <DashboardLayout items={recruiterNav}>
                <RecruiterAnalytics />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout items={[{ to: "/admin", label: "Overview", end: true }]}>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
      <ChatbotWidget />
    </div>
  );
}
