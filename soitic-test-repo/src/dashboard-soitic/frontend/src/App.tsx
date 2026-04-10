import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MobileNav } from './components/MobileNav';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { DashboardPage } from './pages/DashboardPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { AppointmentsPage } from './pages/AppointmentsPage';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-base text-text-primary transition-colors duration-300">
        <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} onNewAppointment={() => setModalOpen(true)} />

        <div
          className="min-h-screen flex flex-col transition-all duration-300 ease-in-out"
          style={{ marginLeft: collapsed ? '72px' : '256px' }}
        >
          <TopBar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route
                path="/patients"
                element={
                  <PlaceholderPage
                    title="Pacientes"
                    icon="group"
                    description="Acesse prontuários e histórico clínico de cada paciente. Implementado na próxima iteração."
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <PlaceholderPage
                    title="Configurações"
                    icon="settings"
                    description="Personalize preferências da clínica e integrações. Implementado na próxima iteração."
                  />
                }
              />
            </Routes>
          </main>
        </div>

        <MobileNav />

        <NewAppointmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </BrowserRouter>
  );
}