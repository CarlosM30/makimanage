import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login/Login';
import Register from './Register/Register';
import Inventory from './Inventory/Inventory';
import ManualInv from './ManualInv/ManualInv';
import GerenteS from './GerenteS';
import Usuarios from './Usuarios';

function App(){
  return (
    <Router basename="/makimanage">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/manualinv' element={<ManualInv />} />
        <Route path='/gerentes' element={<GerenteS />} />
        <Route path='/usuarios' element={<Usuarios />} />
        <Route path='*' element={<h2>Pagina no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;