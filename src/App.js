import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Searching from "./Components/Searching.jsx";
import Home from './Components/Home.jsx';
import Sorting from "./Components/Sorting.jsx";
import SodSolver from './Components/SodSolver.jsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/searching' element={<Searching/>}/>
      <Route path='/sorting' element={<Sorting/>}/>
      <Route path='/solver' element={<SodSolver/>}/>
    </Routes>
  );
}

export default App;