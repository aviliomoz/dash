import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { RedirectPage } from "./pages/RedirectPage";
import { ConsultaPage } from "./pages/ConsultaPage";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./layouts/MainLayout";
import { EmpresasPage } from "./pages/EmpresasPage";
import { EmpresasForm } from "./pages/EmpresasForm";
import { PrivateRoutesLayout } from "./layouts/PrivateRoutesLayout";
import { EmpleadosPage } from "./pages/EmpleadosPage";
import { EmpleadosForm } from "./pages/EmpleadosForm";
import { ComprasPage } from "./pages/ComprasPage";
import { ComprasForm } from "./pages/ComprasForm";
import { DashboardPage } from "./pages/DashboardPage";
import { ComparadorPage } from "./pages/ComparadorPage";
import { HistoricoPage } from "./pages/HistoricoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectPage />} />
        <Route element={<MainLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/club/consulta" element={<ConsultaPage />} />
          <Route element={<PrivateRoutesLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ventas" element={<p>Ventas page</p>} />
            <Route path="/compras" element={<ComprasPage />} />
            <Route path="/compras/actualizar" element={<ComprasForm />} />
            <Route path="/compras/comparador" element={<ComparadorPage />} />
            <Route path="/compras/historico" element={<HistoricoPage />} />
            <Route path="/servicios" element={<p>Servicios page</p>} />
            <Route path="/club/empleados" element={<EmpleadosPage />} />
            <Route path="/club/empleados/:n" element={<EmpleadosForm />} />
            <Route path="/club/empresas" element={<EmpresasPage />} />
            <Route path="/club/empresas/:n" element={<EmpresasForm />} />
          </Route>
        </Route>
        <Route path="*" element={<RedirectPage />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;
