import React, { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import { MainLayout } from "./components/layout/main-layout";

// Lazy load pages
const Home = lazy(() => import("./components/home"));
const EmployeesPage = lazy(() => import("./pages/employees"));
const AdvancesPage = lazy(() => import("./pages/advances"));
const AttendancePage = lazy(() => import("./pages/attendance"));
const ReportsPage = lazy(() => import("./pages/reports"));
const SalariesPage = lazy(() => import("./pages/salaries"));
const SettingsPage = lazy(() => import("./pages/settings"));
const FormulasPage = lazy(() => import("./pages/settings/formulas"));
const TestConnectionPage = lazy(() => import("./pages/test-connection"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          جاري التحميل...
        </div>
      }
    >
      <>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/advances" element={<AdvancesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/salaries" element={<SalariesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/formulas" element={<FormulasPage />} />
            <Route path="/test-connection" element={<TestConnectionPage />} />
            {/* Add the tempobook route to prevent catchall issues */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
