import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/appointments', icon: 'calendar_today', label: 'Agendamentos' },
  { to: '/patients', icon: 'group', label: 'Pacientes' },
  { to: '/settings', icon: 'settings', label: 'Configurações' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {

  return (
    <aside
      className="h-screen fixed left-0 top-0 hidden md:flex flex-col py-6 z-40 transition-all duration-300 ease-in-out bg-surface border-r border-border-subtle"
      style={{ width: collapsed ? '72px' : '256px' }}
    >
      {/* Logo + toggle */}
      <div className="px-4 mb-10 flex items-center justify-between overflow-hidden">
        {!collapsed && (
          <div>
            <h1 className="font-headline font-extrabold text-2xl tracking-tighter whitespace-nowrap text-secondary-500">
              Clínica Bem Viver
            </h1>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-surface-hover text-text-muted"
          style={{ marginLeft: collapsed ? 'auto' : '0', marginRight: collapsed ? 'auto' : '0' }}
          title={collapsed ? 'Expandir menu' : 'Minimizar menu'}
        >
          <span className="material-symbols-outlined text-xl">
            {collapsed ? 'menu_open' : 'menu'}
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg text-sm font-medium transition-all ${
                collapsed ? 'justify-center' : 'gap-3'
              } ${
                isActive
                  ? 'bg-primary-500 text-white shadow-sm font-semibold'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-primary-500'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <span className="material-symbols-outlined text-xl flex-shrink-0">{icon}</span>
            {!collapsed && (
              <span className="font-body">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* CTA */}
      <div className="px-2 mt-auto">
        {collapsed ? (
          <button
            className="w-full h-10 rounded-xl flex items-center justify-center transition-transform active:scale-95 shadow-lg bg-gradient-to-r from-secondary-500 to-primary-500 text-white"
            title="Novo Agendamento"
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
        ) : (
          <button
            className="w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg font-body bg-gradient-to-r from-secondary-500 to-primary-500 text-white hover:opacity-90"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Novo Agendamento</span>
          </button>
        )}
      </div>
    </aside>
  );
}