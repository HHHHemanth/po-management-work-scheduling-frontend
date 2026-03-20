import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminAssociates from "./pages/AdminAssociates";
import { Toaster } from "react-hot-toast";
import StaffAssociates from "./pages/StaffAssociates";
import RoleSelection from "./pages/RoleSelection";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AssociateDashboard from "./pages/AssociateDashboard";
import AssociateWorks from "./pages/AssociateWorks";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRecords from "./pages/AdminRecords";
import AdminUsers from "./pages/AdminUsers";
import AdminLayout from "./pages/AdminLayout";
import TrashRecords from "./pages/TrashRecords";
import Works from "./pages/Works";
import Profile from "./pages/Profile";
import WorkDocuments from "./pages/WorkDocuments";

function App() {
  return (
    <BrowserRouter>
      
      <Toaster
        position="top-center"
        containerStyle={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
/>

      <Routes>

        <Route path="/" element={<RoleSelection />} />
        <Route path="/login/:role" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="records" element={<AdminRecords />} />
          
          <Route path="users" element={<AdminUsers />} />
          <Route path="associates" element={<AdminAssociates />} /> 
          <Route path="work-documents" element={<WorkDocuments />} /> 
        
          <Route path="works" element={<Works />} />
          <Route path="trash" element={<TrashRecords />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
  path="/staff"
  element={
    <ProtectedRoute allowedRole="staff">
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<StaffDashboard />} />
  <Route path="records" element={<AdminRecords />} />
  <Route path="associates" element={<StaffAssociates />} /> 
  <Route path="trash" element={<TrashRecords />} />
  <Route path="work-documents" element={<WorkDocuments />} />
  <Route path="works" element={<Works />} />
  <Route path="profile" element={<Profile />} />
  
</Route>


<Route
  path="/associate"
  element={
    <ProtectedRoute allowedRole="project-associate">
      <AdminLayout />
    </ProtectedRoute>
  }
> 
  <Route index element={<AssociateDashboard />} />
  <Route path="works" element={<Works />} />
  <Route path="work-documents" element={<WorkDocuments />} />
  <Route path="profile" element={<Profile />} />
</Route>


      </Routes>
    </BrowserRouter>
  );
}


export default App;
