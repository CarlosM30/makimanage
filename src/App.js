import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

import Home from './Home';
import Login from './Login/Login';
import Register from './Register/Register';
import Inventory from './Inventory/Inventory';
import ManualInv from './ManualInv/ManualInv';
import GerenteS from './GerenteS';
import EInventario from './EInventario.js';
import Usuarios from './Usuarios';
import AddProduct from './AddProduct/AddProduct';
import AddCategoria from './AddCategoria/AddCategoria';
import AddProveedor from './AddProveedor/AddProveedor';
import CrearPedido from './CrearPedido/CrearPedido';
import ADM from './ADM/ADM.js';

function App() {
  return (
    <AuthProvider>
      <Router basename="/makimanage">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adm" element={<ADM />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/inventory" element={<ProtectedRoute> <Inventory /> </ProtectedRoute>}/>
          <Route path="/manualinv" element={<ProtectedRoute> <ManualInv /> </ProtectedRoute>}/>
          <Route path="/gerentes" element={<ProtectedRoute> <GerenteS /> </ProtectedRoute>}/>
          <Route path="/einventario" element={<ProtectedRoute> <EInventario /> </ProtectedRoute>}/>
          <Route path="/usuarios" element={<ProtectedRoute> <Usuarios /> </ProtectedRoute>}/>
          <Route path="/addproduct" element={<ProtectedRoute> <AddProduct /> </ProtectedRoute>}/>
          <Route path="/addcategoria" element={<ProtectedRoute> <AddCategoria /> </ProtectedRoute>}/>
          <Route path="/addproveedor" element={<ProtectedRoute> <AddProveedor /> </ProtectedRoute>}/>
          <Route path="/crearpedido" element={<ProtectedRoute> <CrearPedido /> </ProtectedRoute>}/>
          
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
