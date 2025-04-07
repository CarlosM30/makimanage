import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

import Home from './Home';
import Login from './Login/Login';
import Register from './Register/Register';
import Inventory from './Inventory/Inventory';
import ManualInv from './ManualInv/ManualInv';
import GerenteS from './GerenteS';
import Usuarios from './Usuarios';
import AddProduct from './AddProduct/AddProduct';
import AddTable from './AddTable/AddTable';
import AddProveedor from './AddProveedor/AddProveedor';
import CrearPedido from './CrearPedido/CrearPedido';

function App() {
  return (
    <AuthProvider>
      <Router basename="/makimanage">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/inventory" element={<ProtectedRoute> <Inventory /> </ProtectedRoute>}/>
          <Route path="/manualinv" element={<ProtectedRoute> <ManualInv /> </ProtectedRoute>}/>
          <Route path="/gerentes" element={<ProtectedRoute> <GerenteS /> </ProtectedRoute>}/>
          <Route path="/usuarios" element={<ProtectedRoute> <Usuarios /> </ProtectedRoute>}/>
          <Route path="/addproduct" element={<ProtectedRoute> <AddProduct /> </ProtectedRoute>}/>
          <Route path="/addtable" element={<ProtectedRoute> <AddTable /> </ProtectedRoute>}/>
          <Route path="/addproveedor" element={<ProtectedRoute> <AddProveedor /> </ProtectedRoute>}/>
          <Route path="/crearpedido" element={<ProtectedRoute> <CrearPedido /> </ProtectedRoute>}/>
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
