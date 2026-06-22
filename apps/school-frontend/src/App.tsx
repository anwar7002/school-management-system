import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useAuthStore } from './store/auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { StudentsPage } from './pages/students/StudentsPage';
import { ViolationsPage } from './pages/violations/ViolationsPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { SchedulesPage } from './pages/schedules/SchedulesPage';
import { VisitorsPage } from './pages/visitors/VisitorsPage';

const queryClient = new QueryClient();

function App() {
  const { token } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AttendancePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StudentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/violations"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ViolationsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MessagesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SchedulesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitors"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <VisitorsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
