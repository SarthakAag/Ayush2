import { Routes, Route } from "react-router-dom";

import HomePage from "./HomePage/HomePage";
import PatientLogin from "./Patient/PatientLogin";
import PatientRegister from "./Patient/PatientRegister";
import PatientPortal from "./Patient/PatientPortal";

import ClinicianLogin from "./Clinician/ClinicianLogin";
import ClinicianRegister from "./Clinician/ClinicianRegister";
import DoctorDetails from "./Clinician/DoctorDetails";
import ClinicianDashboard from "./Clinician/ClinicianDashboard";
import InsuranceRegister from "./InsuranceCompany/InsuranceRegister";
import InsuranceDashboard from "./InsuranceCompany/InsuranceDashboard";

import InsuranceLogin from "./InsuranceCompany/InsuranceLogin";

const App = () => {
  return (
    <Routes>
   
      <Route path="/" element={<HomePage />} />

     
      <Route path="/patient/register" element={<PatientRegister />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/portal" element={<PatientPortal />} />

      <Route path="/clinician/login" element={<ClinicianLogin />} />
      <Route path="/clinician/register" element={<ClinicianRegister />} />
      <Route path="/clinician/details" element={<DoctorDetails />} />
      <Route path="/clinician/dashboard" element={<ClinicianDashboard />} />
      <Route path="/insurance/register" element={<InsuranceRegister />} />
      <Route path="/insurance/dashboard" element={<InsuranceDashboard />} />
      <Route path="/insurance/login" element={<InsuranceLogin />} />
    </Routes>
  );
};

export default App;

