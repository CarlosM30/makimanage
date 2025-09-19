import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

import Home from './pages/Home/Home.js';
import Login from './pages/Login/Login.js';
import Register from './pages/Register/Register.js';
import Inventory from './features/inventory/Inventory.js';
import ManualInv from './features/manualinv/ManualInv.js';
import Usuarios from './features/user/Usuarios.js';
import AddProduct from './features/products/AddProduct.js';
import AddCategoria from './features/categories/AddCategoria.js';
import AddProveedor from './features/providers/AddProveedor.js';
import CrearPedido from './features/order/CrearPedido.js';
import PedidoTemplate from './features/order/PedidoTemplate.js';
import ADM from './ADM/ADM.js';
import GerenteS from './pages/Pantallas/GerenteS.js';
import EInventario from './pages/Pantallas/EInventario.js';
import Ginventario from './pages/Pantallas/Ginventario.js';
import Gproveedores from './pages/Pantallas/Gproveedores.js';
import GinventariosE from './pages/Pantallas/GinventariosE.js';
import ADMC from './pages/Pantallas/ADMC.js';

function App() {
  return (
    <AuthProvider>
      <Router basename="/makimanage">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adm" element={<ProtectedRoute> <ADM /> </ProtectedRoute>}/>
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
          <Route path="/ginventario" element={<ProtectedRoute> <Ginventario /> </ProtectedRoute>}/>
          <Route path="/gproveedores" element={<ProtectedRoute> <Gproveedores /> </ProtectedRoute>}/>
          <Route path="/ginventariose" element={<ProtectedRoute> <GinventariosE /> </ProtectedRoute>}/>
          <Route path="/admc" element={<ProtectedRoute> <ADMC /> </ProtectedRoute>}/>
          <Route path="/pedidotemplate" element={<ProtectedRoute> <PedidoTemplate /> </ProtectedRoute>}/>
          
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
