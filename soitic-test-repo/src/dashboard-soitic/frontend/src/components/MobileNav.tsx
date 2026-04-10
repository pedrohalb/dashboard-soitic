import { NavLink } from "react-router-dom";

const items = [
  { to: "/", icon: "dashboard", label: "Home" },
  { to: "/appointments", icon: "calendar_month", label: "Agendas" },
  { to: "/patients", icon: "group", label: "Pacientes" },
  { to: "/settings", icon: "menu", label: "Menu" },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 px-4 z-50 border-t border-border-subtle bg-surface/90 backdrop-blur-xl">
      {items.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className="flex flex-col items-center gap-1"
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined transition-colors ${isActive ? "text-primary-500" : "text-text-muted"}`}
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {icon}
              </span>
              <span
                className={`text-[10px] font-medium font-body transition-colors ${isActive ? "text-primary-500" : "text-text-muted"}`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
