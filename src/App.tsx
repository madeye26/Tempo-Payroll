import React, { Suspense, lazy, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { MainLayout } from "./components/layout/main-layout";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./lib/hooks/use-auth.tsx";
import { ProtectedRoute } from "./components/auth/protected-route";

// Lazy load pages
const Home = lazy(() => import("./components/home"));
const LoginPage = lazy(() => import("./pages/login"));
const EmployeesPage = lazy(() => import("./pages/employees"));
const AdvancesPage = lazy(() => import("./pages/advances"));
const AttendancePage = lazy(() => import("./pages/attendance"));
const ReportsPage = lazy(() => import("./pages/reports"));
const SalariesPage = lazy(() => import("./pages/salaries"));
const SalaryHistoryPage = lazy(() => import("./pages/salaries/salary-history"));
const SettingsPage = lazy(() => import("./pages/settings"));
const FormulasPage = lazy(() => import("./pages/settings/formulas"));
const UsersPage = lazy(() => import("./pages/settings/users"));
const ActivityLogsPage = lazy(() => import("./pages/settings/activity-logs"));
const BackupPage = lazy(() => import("./pages/settings/backup"));
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

    // Initialize users
    if (!localStorage.getItem("users")) {
      localStorage.setItem(
        "users",
        JSON.stringify([
          {
            id: "1",
            name: "المدير",
            email: "admin@example.com",
            role: "admin",
            created_at: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "2",
            name: "مدير الموارد البشرية",
            email: "manager@example.com",
            role: "manager",
            created_at: "2024-01-02T00:00:00.000Z",
          },
          {
            id: "3",
            name: "المحاسب",
            email: "accountant@example.com",
            role: "accountant",
            created_at: "2024-01-03T00:00:00.000Z",
          },
          {
            id: "4",
            name: "مستخدم عادي",
            email: "viewer@example.com",
            role: "viewer",
            created_at: "2024-01-04T00:00:00.000Z",
          },
        ]),
      );
    }

    // Initialize mock auth users
    if (!localStorage.getItem("mock_auth_users")) {
      localStorage.setItem(
        "mock_auth_users",
        JSON.stringify([
          {
            id: "1",
            email: "admin@example.com",
            password: "password123",
            role: "admin",
            name: "المدير",
          },
          {
            id: "2",
            email: "manager@example.com",
            password: "password123",
            role: "manager",
            name: "مدير الموارد البشرية",
          },
          {
            id: "3",
            email: "accountant@example.com",
            password: "password123",
            role: "accountant",
            name: "المحاسب",
          },
          {
            id: "4",
            email: "viewer@example.com",
            password: "password123",
            role: "viewer",
            name: "مستخدم عادي",
          },
        ]),
      );
    }

    // Initialize activity logs
    if (!localStorage.getItem("activity_logs")) {
      localStorage.setItem("activity_logs", JSON.stringify([]));
    }
  }, []);

  return (
    <AuthProvider>
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
            <Route path="login" element={<LoginPage />} />

            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={
                  <ProtectedRoute requiredPermission="view_dashboard">
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="employees"
                element={
                  <ProtectedRoute requiredPermission="manage_employees">
                    <EmployeesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="advances"
                element={
                  <ProtectedRoute requiredPermission="manage_advances">
                    <AdvancesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="attendance"
                element={
                  <ProtectedRoute requiredPermission="manage_attendance">
                    <AttendancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ProtectedRoute requiredPermission="view_reports">
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="salaries"
                element={
                  <ProtectedRoute requiredPermission="manage_salaries">
                    <SalariesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="salaries/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="manage_salaries">
                    <SalariesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="salaries/history"
                element={
                  <ProtectedRoute requiredPermission="manage_salaries">
                    <SalaryHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute requiredPermission="manage_settings">
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings/formulas"
                element={
                  <ProtectedRoute requiredPermission="manage_settings">
                    <FormulasPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings/users"
                element={
                  <ProtectedRoute requiredPermission="manage_users">
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings/activity-logs"
                element={
                  <ProtectedRoute requiredPermission="manage_settings">
                    <ActivityLogsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings/backup"
                element={
                  <ProtectedRoute requiredPermission="manage_settings">
                    <BackupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="test-connection"
                element={
                  <ProtectedRoute requiredPermission="manage_settings">
                    <TestConnectionPage />
                  </ProtectedRoute>
                }
              />
              {/* Add the tempobook route to prevent catchall issues */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="tempobook/*" />
              )}
            </Route>

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
