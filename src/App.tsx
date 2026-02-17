import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { PatientNewPage } from './pages/PatientNewPage';
import { PatientEditPage } from './pages/PatientEditPage';
import { PatientListPage } from './pages/PatientListPage';
import { ExaminationNewPage } from './pages/ExaminationNewPage';
import { ExaminationEditPage } from './pages/ExaminationEditPage';
import { ReferenceChartsPage } from './pages/ReferenceChartsPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';

export function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/patients/dashboard" element={<DashboardPage />} />
                <Route path="/patients/detail/:id" element={<PatientDetailPage />} />
                <Route path="/patients/new" element={<PatientNewPage />} />
                <Route path="/patients/edit/:id" element={<PatientEditPage />} />
                <Route path="/patients/list" element={<PatientListPage />} />
                <Route path="/examinations/new/:patientId" element={<ExaminationNewPage />} />
                <Route path="/examinations/edit/:patientId/:examinationId" element={<ExaminationEditPage />} />
                <Route path="/charts" element={<ReferenceChartsPage />} />
                <Route path="/doctor/profile" element={<DoctorProfilePage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/patients/dashboard" replace />} />
          </Routes>
        </HashRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </DatabaseProvider>
  );
}
