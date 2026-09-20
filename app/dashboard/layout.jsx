import Sidebar from "../components/shared/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <Sidebar />
      {/* Main content with left padding on desktop */}
      <main className="md:pl-64 bg-gradient-to-tr from-slate-900 via-gray-900 to-emerald-950 py-6 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </ProtectedRoute>
  );
}
