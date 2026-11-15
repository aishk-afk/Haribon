import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AuthProvider from "./AuthProvider";
import AnnouncementsAdmin from "./AnnouncementsAdmin";
import Dashboard from "./Dashboard";
import Login from "./Login";
import MediaAdmin from "./MediaAdmin";
import PageEditor from "./PageEditor";
import PagesAdmin from "./PagesAdmin";
import ProgramsAdmin from "./ProgramsAdmin";
import SettingsAdmin from "./SettingsAdmin";
import "./admin.css";

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pages" element={<PagesAdmin />} />
          <Route path="pages/:id" element={<PageEditor />} />
          <Route path="programs" element={<ProgramsAdmin />} />
          <Route path="announcements" element={<AnnouncementsAdmin />} />
          <Route path="media" element={<MediaAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
