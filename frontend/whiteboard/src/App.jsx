import {BrowserRouter, Route, Routes} from 'react-router-dom'

import HomePage from './components/HomePage'

import WhiteBoardExtention from './components/WhiteBoardExtention'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/:id' element={<WhiteBoardExtention/>}/>
    </Routes>
  </BrowserRouter>
)

export default App