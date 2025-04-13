
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Index from "./pages/Index";
import ResumeScreener from "./pages/ResumeScreener";
import InterviewerAvailability from "./pages/InterviewerAvailability";
import CandidateSlotSelection from "./pages/CandidateSlotSelection";
import HRPanel from "./pages/HRPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout component to wrap pages with sidebar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  
  return (
    <div className="flex min-h-screen">
      {!isHomepage && <Sidebar />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Index />
            </Layout>
          } />
          <Route path="/resume-screener" element={
            <Layout>
              <ResumeScreener />
            </Layout>
          } />
          <Route path="/interviewer-availability" element={
            <Layout>
              <InterviewerAvailability />
            </Layout>
          } />
          <Route path="/candidate-slot-selection" element={
            <Layout>
              <CandidateSlotSelection />
            </Layout>
          } />
          <Route path="/hr-panel" element={
            <Layout>
              <HRPanel />
            </Layout>
          } />
          <Route path="*" element={
            <Layout>
              <NotFound />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
