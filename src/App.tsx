import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import { Loading } from "./components/StatusViews";
import Home from "./pages/Home";
import About from "./pages/About";
import Donate from "./pages/Donate";
import CmsPage from "./pages/CmsPage";

// The CMS dashboard is loaded only when someone visits /admin.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<Loading />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />
        {/* Any other published page created in the CMS, for example /our-story */}
        <Route path="/:slug" element={<CmsPage />} />
      </Route>
    </Routes>
  );
}

export default App;