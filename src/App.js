import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Inventory from './Inventory';
import ManualInv from './ManualInv';

function App(){
  return (
    <Router basename="/makimanage">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/manualinv' element={<ManualInv />} />
        <Route path='*' element={<h2>Pagina no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;