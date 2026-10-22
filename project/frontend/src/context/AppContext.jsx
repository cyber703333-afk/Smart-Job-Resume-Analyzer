import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api/client";

const AppContext = createContext(null);
const TOKEN_KEY = "sjrmp_token";
const USER_KEY = "sjrmp_user";

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [authError, setAuthError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState([]); // job ids saved by current candidate
  const [notifications, setNotifications] = useState([]);

  function persistSession(newToken, user) {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setCurrentUser(null);
    setSavedJobIds([]);
    setNotifications([]);
  }

  // ---- Public jobs (loaded once, used by JobListings / JobDetails / Home) ----
  const refreshJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const data = await api.get("/jobs");
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs:", err.message);
    } finally {
      setJobsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  // Load saved jobs + notifications whenever a candidate logs in
  useEffect(() => {
    if (currentUser?.role === "candidate" && token) {
      refreshSavedJobs();
      refreshNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, token]);

  // ---- Auth ----
  async function login(email, password) {
    setAuthError("");
    try {
      const data = await api.post("/auth/login", { email, password });
      persistSession(data.token, data.user);
      return true;
    } catch (err) {
      setAuthError(err.message || "Invalid email or password.");
      return false;
    }
  }

  async function register({ name, email, password, role, company }) {
    setAuthError("");
    try {
      const data = await api.post("/auth/register", { name, email, password, role, company });
      persistSession(data.token, data.user);
      return true;
    } catch (err) {
      setAuthError(err.message || "Registration failed.");
      return false;
    }
  }

  function logout() {
    clearSession();
  }

  // ---- Jobs ----
  async function postJob(jobData) {
    const created = await api.post("/jobs", jobData, token);
    await refreshJobs();
    return created;
  }

  async function fetchMyJobs() {
    return api.get("/jobs/mine", token);
  }

  async function fetchMyJobStats() {
    return api.get("/jobs/stats/mine", token);
  }

  // ---- Applications ----
  async function applyToJob(jobId, resumeFile) {
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resume", resumeFile);
    return api.postForm("/applications", formData, token); // includes AI matchScore
  }

  async function fetchMyApplications() {
    return api.get("/applications/mine", token);
  }

  async function fetchApplicantsForJob(jobId) {
    return api.get(`/applications/job/${jobId}`, token);
  }

  async function updateApplicationStatus(applicationId, status) {
    return api.patch(`/applications/${applicationId}`, { status }, token);
  }

  // ---- Saved / bookmarked jobs ----
  async function refreshSavedJobs() {
    try {
      const saved = await api.get("/saved-jobs", token);
      setSavedJobIds(saved.map((j) => j.id));
    } catch (err) {
      console.error("Failed to load saved jobs:", err.message);
    }
  }

  function isJobSaved(jobId) {
    return savedJobIds.includes(jobId);
  }

  async function toggleSaveJob(jobId) {
    if (!currentUser || currentUser.role !== "candidate") return;
    try {
      const { saved } = await api.post(`/saved-jobs/${jobId}`, {}, token);
      setSavedJobIds((prev) => (saved ? [...prev, jobId] : prev.filter((id) => id !== jobId)));
    } catch (err) {
      console.error("Failed to toggle saved job:", err.message);
    }
  }

  async function getSavedJobs() {
    return api.get("/saved-jobs", token);
  }

  // ---- Notifications ----
  async function refreshNotifications() {
    try {
      const data = await api.get("/notifications", token);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err.message);
    }
  }

  async function markNotificationsRead() {
    try {
      await api.patch("/notifications/read", {}, token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications read:", err.message);
    }
  }

  function getMyNotifications() {
    return notifications;
  }

  // ---- Interview scheduling ----
  async function proposeInterview(applicationId, slots, notes) {
    return api.post("/interviews", { applicationId, slots, notes }, token);
  }

  async function confirmInterviewSlot(interviewId, slot) {
    return api.patch(`/interviews/${interviewId}/confirm`, { slot }, token);
  }

  async function fetchMyInterviewsAsCandidate() {
    return api.get("/interviews/candidate", token);
  }

  async function fetchMyInterviewsAsRecruiter() {
    return api.get("/interviews/recruiter", token);
  }

  // ---- Chatbot ----
  async function sendChatMessage(message) {
    const data = await api.post("/chatbot", { message }, token || undefined);
    return data.reply;
  }

  // ---- Profile ----
  async function updateProfile(updates) {
    const data = await api.patch("/users/profile", updates, token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setCurrentUser(data.user);
    return data.user;
  }

  const value = {
    token,
    currentUser,
    authError,
    jobs,
    jobsLoading,
    login,
    register,
    logout,
    postJob,
    fetchMyJobs,
    fetchMyJobStats,
    applyToJob,
    fetchMyApplications,
    fetchApplicantsForJob,
    updateApplicationStatus,
    isJobSaved,
    toggleSaveJob,
    getSavedJobs,
    getMyNotifications,
    refreshNotifications,
    markNotificationsRead,
    updateProfile,
    proposeInterview,
    confirmInterviewSlot,
    fetchMyInterviewsAsCandidate,
    fetchMyInterviewsAsRecruiter,
    sendChatMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
