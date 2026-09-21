import Sidebar from "../components/shared/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <Sidebar />
      {/* Main content with left padding on desktop */}
      <main className="md:pl-64 bg-[#F8FAFC] py-6 min-h-screen overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
          {children}
        </div>
      </main>
    </ProtectedRoute>
  );
}
