import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Operator from './pages/Operator';
import Track from './pages/Track';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
return (
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/track" element={<Track />} />
<Route path="/operator" element={ <ProtectedRoute> <Operator /> </ProtectedRoute>
  }
/>
</Routes>
);
}


export default App;
