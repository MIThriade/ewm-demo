
import { Routes, Route, Link } from 'react-router-dom'
import Landing from '../pages/Landing'
import Configurator from '../pages/Configurator'

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/configurator" element={<Configurator />} />
      <Route path="*" element={
        <div style={{padding:20}}>
          <h2>404</h2>
          <p>Pagina nu a fost găsită.</p>
          <p><Link to="/">Înapoi la Landing</Link></p>
        </div>
      } />
    </Routes>
  )
}
