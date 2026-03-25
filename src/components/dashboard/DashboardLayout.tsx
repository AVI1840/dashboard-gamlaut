import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Accessibility,
  Heart,
  Wallet,
  TrendingDown,
  Baby,
  Car,
  Scale,
  BarChart3,
  Menu,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { benefitTypes } from "@/data/welfareData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ViewModeToggle } from "@/components/dashboard/ViewModeToggle";
import { BranchFilter } from "@/components/dashboard/BranchFilter";
import { FeedbackModal } from "@/components/FeedbackModal";


interface DashboardLayoutProps {
  children: ReactNode;
}

const iconMap: Record<string, React.ElementType> = {
  "old-age": Users,
  "disability": Accessibility,
  "nursing": Heart,
  "income-support": Wallet,
  "unemployment": TrendingDown,
  "child-support": Baby,
  "disabled-child": Baby,
  "mobility": Car,
  "alimony": Scale,
  "work-disability": Accessibility,
  "work-injury": Accessibility,
};

const navItems = [
  { path: "/", label: "סקירה כללית", icon: LayoutDashboard },
  ...benefitTypes.map((b) => ({
    path: `/benefit/${b.id}`,
    label: b.name,
    icon: iconMap[b.id] || BarChart3,
  })),
  { path: "/compare", label: "השוואת רשויות", icon: BarChart3, highlight: true },
];

function NavigationContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        const isHighlight = (item as any).highlight;
        return (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isHighlight && !isActive && "bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 hover:text-amber-100 border border-amber-400/30",
                isActive
                  ? "bg-white/20 text-white"
                  : !isHighlight && "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col gradient-header text-white sticky top-0">
      {/* Logo */}
      <div className="flex h-20 items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">דשבורד פערי גמלאות</h1>
            <p className="text-xs text-white/70">מינהל גמלאות | ביטוח לאומי</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <NavigationContent />
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-white/60 text-center">
          אביעד יצחקי, מינהל גמלאות | ביטוח לאומי | v1.0 | מרץ 2026
        </p>
        <p className="text-xs text-white/40 text-center mt-1">עדכון אחרון: 24.03.2026</p>
      </div>
    </aside>
  );
}

function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0 gradient-header border-l-0">
        <SheetHeader className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-white text-right">
                דשבורד פערי גמלאות
              </SheetTitle>
              <p className="text-xs text-white/70 text-right">מינהל גמלאות | ביטוח לאומי</p>
            </div>
          </div>
        </SheetHeader>
        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          <NavigationContent />
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <p className="text-xs text-white/60 text-center">
            אביעד יצחקי, מינהל גמלאות | ביטוח לאומי | v1.0 | מרץ 2026
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
          <MobileNavigation />
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold truncate">
              {isMobile ? "פערי גמלאות רווחה" : "ניתוח פערי גמלאות רווחה ברשויות המקומיות"}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">מינהל גמלאות | ביטוח לאומי</p>
          </div>
          <BranchFilter />
          <Button
            variant="default"
            size="sm"
            onClick={() => setFeedbackOpen(true)}
            className="gap-1.5 hidden sm:flex bg-amber-500 hover:bg-amber-600 text-white shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            משוב פיילוט AI
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={() => setFeedbackOpen(true)}
            className="sm:hidden bg-amber-500 hover:bg-amber-600 text-white shadow-md"
            aria-label="משוב פיילוט"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <ViewModeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-3 text-center text-xs text-muted-foreground">
          אביעד יצחקי, מינהל גמלאות | ביטוח לאומי | v1.0 | מרץ 2026
        </footer>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
