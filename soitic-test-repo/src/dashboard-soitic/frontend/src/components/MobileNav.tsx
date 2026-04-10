import { NavLink } from "react-router-dom";

const items = [
  { to: "/", icon: "dashboard", label: "Home" },
  { to: "/appointments", icon: "calendar_month", label: "Agendas" },
  { to: "/patients", icon: "group", label: "Pacientes" },
  { to: "/settings", icon: "menu", label: "Menu" },
];

export function MobileNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 px-4 z-50 border-t"
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(192,199,208,0.4)",
      }}
    >
      {items.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "" : ""}`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined"
                style={{
                  color: isActive ? "#004b74" : "#a0aab4",
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {icon}
              </span>
              <span
                className="text-[10px] font-medium"
                style={{
                  color: isActive ? "#004b74" : "#a0aab4",
                  fontFamily: "Inter, sans-serif",
                }}
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
