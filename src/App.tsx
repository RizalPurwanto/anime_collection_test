import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes,  } from 'react-router-dom';
import Home from './views/Home';
import AnimeDetails from './views/AnimeDetails';
import Collections from './views/Collections';
import CollectionDetails from './views/CollectionDetails';


function App() {
  return (
    <div style={{overflowX:'hidden'}} className="App">
      <div  className=''>
        <Routes>
          <Route path='/' element={
            <Home></Home>
          }/>
           <Route path='/anime/:animeId' element={
            <AnimeDetails></AnimeDetails>
          }/>
          <Route path='/collections' element={
            <Collections></Collections>
          }/>
          <Route path='/collections/:collectionId' element={
            <CollectionDetails></CollectionDetails>
          }/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
