import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ManageOrganisation from "./pages/Organisation/ManageOrganisation";
import ManageRole from "./pages/Organisation/ManageRole";
import ManageMenu from "./pages/Organisation/ManageMenu";
import ManageUser from "./pages/Organisation/ManageUser";
import ManageEdgeTemplate from "./pages/Edge/ManageEdgeTemplate";
import Edge from "./pages/Edge/Edge";
import ManageAssetTemplate from "./pages/Asset/ManageAssetTemplate";
import Asset from "./pages/Asset/Asset";
import AddOrganisation from "./pages/Organisation/AddOrganisation";
import EditOrganisation from "./pages/Organisation/EditOrganisation";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            {/* Organisation and User Management */}
            <Route path="/organisation/manage" element={<ManageOrganisation />} />
            <Route path="/organisation/manage/add" element={<AddOrganisation />} />
            <Route path="/organisation/manage/edit/:id" element={<EditOrganisation />} />
            <Route path="/organisation/roles" element={<ManageRole />} />
            <Route path="/organisation/menus" element={<ManageMenu />} />
            <Route path="/organisation/users" element={<ManageUser />} />

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
