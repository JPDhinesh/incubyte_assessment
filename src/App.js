import './App.css';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const PokemonCatalogPage = lazy(() => import('./pages/PokemonCatalogPage'));
const PokemonProfilePage = lazy(() => import('./pages/PokemonProfilePage'));

function App() {
  return (
    <div className="app-shell">
      <Suspense fallback={<p className="page-loading" role="status">Loading...</p>}>
        <Routes>
          <Route path="/" element={<PokemonCatalogPage />} />
          <Route path="/pokemon/:pokemonName" element={<PokemonProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
