import {
  Activity,
  Flame,
  Settings,
  LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Header = ({ streak, onOpenGoals }) => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-xl items-center justify-between px-6 py-4">

        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-emerald-500 p-2 text-white">
            <Activity size={20} />
          </div>

          <h1 className="text-xl font-bold tracking-tight">
            NutriTrack
          </h1>
        </div>

        <div className="flex items-center gap-3">

          <div className="flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-600">
            <Flame
              size={16}
              className={streak > 0 ? "fill-orange-500" : ""}
            />

            {streak} Day{streak !== 1 ? "s" : ""}
          </div>

          <button
            type="button"
            onClick={onOpenGoals}
            title="Daily targets"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <Settings size={21} />
          </button>

          <button
            type="button"
            onClick={logout}
            title="Logout"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
          >
            <LogOut size={20} />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;