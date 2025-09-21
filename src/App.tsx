import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ManageOrganization from "./pages/Organisation/ManageOrganisation";
import ManageRole from "./pages/Organisation/ManageRole";
import ManageMenu from "./pages/Organisation/ManageMenu";
import ManageUser from "./pages/Organisation/ManageUser";
import ManageEdgeTemplate from "./pages/Edge/ManageEdgeTemplate";
import Edge from "./pages/Edge/Edge";
import ManageAssetTemplate from "./pages/Asset/ManageAssetTemplate";
import Asset from "./pages/Asset/Asset";
import AddOrganization from "./pages/Organisation/AddOrganisation";
import EditOrganization from "./pages/Organisation/EditOrganisation";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            {/* Organization and User Management */}
            <Route path="/organization/manage" element={<ManageOrganization />} />
            <Route path="/organization/manage/add" element={<AddOrganization />} />
            <Route path="/organization/manage/edit/:id" element={<EditOrganization />} />
            <Route path="/organization/roles" element={<ManageRole />} />
            <Route path="/organization/menus" element={<ManageMenu />} />
            <Route path="/organization/users" element={<ManageUser />} />

            {/* Backward-compat redirects from /organisation/... to /organization/... */}
            <Route path="/organisation/manage" element={<Navigate to="/organization/manage" replace />} />
            <Route path="/organisation/manage/add" element={<Navigate to="/organization/manage/add" replace />} />
            <Route path="/organisation/manage/edit/:id" element={<Navigate to="/organization/manage/edit/:id" replace />} />
            <Route path="/organisation/roles" element={<Navigate to="/organization/roles" replace />} />
            <Route path="/organisation/menus" element={<Navigate to="/organization/menus" replace />} />
            <Route path="/organisation/users" element={<Navigate to="/organization/users" replace />} />

            {/* Edge Management */}
            <Route path="/edge/templates" element={<ManageEdgeTemplate />} />
            <Route path="/edge" element={<Edge />} />

            {/* Asset Management */}
            <Route path="/asset/templates" element={<ManageAssetTemplate />} />
            <Route path="/asset" element={<Asset />} />

            {/* Others Page */}
            
          </Route>

          {/* Auth Layout */}


          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
