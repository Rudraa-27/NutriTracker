import { Activity, LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-white">
              <Activity size={20} />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                NutriTrack
              </h1>

              <p className="text-xs text-gray-400">
                Nutrition tracker
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <p className="text-sm text-gray-400 mb-2">
            Logged in as
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}!
          </h2>

          <p className="text-gray-500 mt-3">
            Your NutriTrack dashboard will be built in Phase 3.
          </p>
        </div>

      </main>

    </div>
  );
};

export default Dashboard;