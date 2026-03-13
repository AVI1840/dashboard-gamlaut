import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ViewModeProvider } from "@/context/ViewModeContext";
import { BranchFilterProvider } from "@/context/BranchFilterContext";
import OverviewPage from "./pages/OverviewPage";
import BenefitAnalysisPage from "./pages/BenefitAnalysisPage";
import ComparePage from "./pages/ComparePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ViewModeProvider>
        <BranchFilterProvider>
          <BrowserRouter basename="/dashboard-gamlaut">
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/benefit/:benefitId" element={<BenefitAnalysisPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          </BrowserRouter>
        </BranchFilterProvider>
      </ViewModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

