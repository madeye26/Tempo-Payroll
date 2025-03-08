import React, { Suspense, lazy, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import { MainLayout } from "./components/layout/main-layout";
import { Toaster } from "./components/ui/toaster";

// Lazy load pages
const Home = lazy(() => import("./components/home"));
const EmployeesPage = lazy(() => import("./pages/employees"));
const AdvancesPage = lazy(() => import("./pages/advances"));
const AttendancePage = lazy(() => import("./pages/attendance"));
const ReportsPage = lazy(() => import("./pages/reports"));
const SalariesPage = lazy(() => import("./pages/salaries"));
const SalaryHistoryPage = lazy(() => import("./pages/salaries/salary-history"));
const SettingsPage = lazy(() => import("./pages/settings"));
const FormulasPage = lazy(() => import("./pages/settings/formulas"));
const TestConnectionPage = lazy(() => import("./pages/test-connection"));

function App() {
  // Initialize localStorage with default data if empty
  useEffect(() => {
    // Initialize employees
    if (!localStorage.getItem("employees")) {
      localStorage.setItem(
        "employees",
        JSON.stringify([
          {
            id: "1",
            name: "أحمد محمد",
            monthly_incentives: 500,
            position: "مهندس برمجيات",
            department: "تكنولوجيا المعلومات",
            base_salary: 5000,
            join_date: "2024-01-01",
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "فاطمة علي",
            monthly_incentives: 400,
            position: "محاسب",
            department: "المالية",
            base_salary: 4500,
            join_date: "2024-01-01",
            status: "active",
            created_at: new Date().toISOString(),
          },
        ]),
      );
    }

    // Initialize advances
    if (!localStorage.getItem("advances")) {
      localStorage.setItem(
        "advances",
        JSON.stringify([
          {
            id: "1",
            employeeId: "1",
            employeeName: "أحمد محمد",
            amount: 1000,
            requestDate: "2024-05-01",
            expectedRepaymentDate: "2024-06-01",
            status: "pending",
            remainingAmount: 1000,
          },
          {
            id: "2",
            employeeId: "2",
            employeeName: "فاطمة علي",
            amount: 500,
            requestDate: "2024-04-15",
            expectedRepaymentDate: "2024-05-15",
            status: "paid",
            actualRepaymentDate: "2024-05-15",
            remainingAmount: 0,
          },
        ]),
      );
    }

    // Initialize absences
    if (!localStorage.getItem("absences")) {
      localStorage.setItem(
        "absences",
        JSON.stringify([
          {
            id: "1",
            employeeId: "1",
            employeeName: "أحمد محمد",
            startDate: "2024-05-01",
            endDate: "2024-05-05",
            reason: "إجازة سنوية",
            type: "annual",
            status: "approved",
          },
          {
            id: "2",
            employeeId: "2",
            employeeName: "فاطمة علي",
            startDate: "2024-05-10",
            endDate: "2024-05-12",
            reason: "إجازة مرضية",
            type: "sick",
            status: "pending",
          },
        ]),
      );
    }
  }, []);
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          جاري التحميل...
        </div>
      }
    >
      <>
        {/* Tempo routes need to be defined before regular routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="advances" element={<AdvancesPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="salaries" element={<SalariesPage />} />
            <Route path="salaries/history" element={<SalaryHistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="settings/formulas" element={<FormulasPage />} />
            <Route path="test-connection" element={<TestConnectionPage />} />
            {/* Add the tempobook route to prevent catchall issues */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="tempobook/*" />
            )}
          </Route>
        </Routes>
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
