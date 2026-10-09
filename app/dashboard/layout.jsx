import Sidebar from "../components/shared/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";
import { ThemeProvider } from "../components/ThemeProvider";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <ThemeProvider>
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
          <Sidebar />
          {/* Main content with left padding on desktop */}
          <main className="md:pl-64 py-6 min-h-screen overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
}
