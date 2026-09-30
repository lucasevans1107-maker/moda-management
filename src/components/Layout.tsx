import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Home,
  Users,
  Wrench,
  Phone,
  Settings,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { useStore } from "../store";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/requests", label: "Requests", icon: ClipboardList },
  { to: "/properties", label: "Properties", icon: Home },
  { to: "/vendors", label: "Vendors", icon: Wrench },
  { to: "/receptionist", label: "Receptionist", icon: Phone },
  { to: "/settings", label: "Settings", icon: Settings },
];

function DemoRoleSwitcher() {
  const demoRole = useStore((s) => s.demoRole);
  const demoHomeownerId = useStore((s) => s.demoHomeownerId);
  const homeowners = useStore((s) => s.homeowners);
  const setDemoRole = useStore((s) => s.setDemoRole);
  const setDemoHomeownerId = useStore((s) => s.setDemoHomeownerId);
  const navigate = useNavigate();

  function handleRoleChange(role: "coordinator" | "homeowner") {
    setDemoRole(role);
    if (role === "coordinator") {
      setDemoHomeownerId(undefined);
    } else {
      setDemoHomeownerId(homeowners[0]?.id);
    }
    navigate("/");
  }

  return (
    <div className="border-t border-line pt-4 mt-4">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">
        Demo Only
      </p>
      <p className="text-xs text-muted mb-3 px-1 leading-relaxed">
        Not secure access control.
      </p>
      <div className="flex rounded-lg overflow-hidden border border-line text-xs font-medium">
        <button
          onClick={() => handleRoleChange("coordinator")}
          className={clsx(
            "flex-1 py-2 transition-colors",
            demoRole === "coordinator"
              ? "bg-accent text-canvas"
              : "bg-surface text-muted hover:bg-canvas",
          )}
        >
          Coordinator
        </button>
        <button
          onClick={() => handleRoleChange("homeowner")}
          className={clsx(
            "flex-1 py-2 transition-colors border-l border-line",
            demoRole === "homeowner"
              ? "bg-accent text-canvas"
              : "bg-surface text-muted hover:bg-canvas",
          )}
        >
          Homeowner
        </button>
      </div>
      {demoRole === "homeowner" && (
        <div className="mt-2 relative">
          <select
            value={demoHomeownerId ?? ""}
            onChange={(e) => setDemoHomeownerId(e.target.value)}
            className="w-full text-xs text-ink bg-surface border border-line rounded-lg px-3 py-2 appearance-none pr-7"
          >
            {homeowners.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="w-64 bg-surface app-sidebar border-r border-line flex flex-col fixed top-0 left-0 h-full z-10">
        <div className="px-6 py-5 border-b border-line">
          <NavLink
            to="/"
            className="moda-brand"
            aria-label="Moda Management dashboard"
          >
            MODA<small>MANAGEMENT</small>
          </NavLink>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-raised text-ink"
                        : "text-muted hover:bg-canvas hover:text-ink",
                    )
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-3 pb-6">
          <DemoRoleSwitcher />
        </div>
      </aside>

      <main className="flex-1 ml-64 app-main min-h-screen overflow-auto">
        <div className="app-topline">
          <span>CLIENT CARE & OPERATIONS</span>
          <span>Demo workspace · Central Time</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
