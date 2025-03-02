import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Register from './components/register/register';
import Home from './components/home/home';
import CastVote from './components/castvote/castvote';
import AuthoriseVoter from './components/authorisevoter/authorisevoter';
import TallyVotes from './components/tallyvotes/tallyvotes';

const App = () => {
  
  return <Routes>
    <Route path='/' element={<Home></Home>}></Route>
    <Route path='/register' element={<Register></Register>}></Route>
    <Route path='/vote' element={<CastVote></CastVote>}></Route>
    <Route path='/authorise' element={<AuthoriseVoter></AuthoriseVoter>}></Route>
    <Route path='/tally' element={<TallyVotes></TallyVotes>}></Route>
  </Routes>
  
}


export default App