import { Navigate, useParams } from 'react-router-dom';
import PokemonDetailSection from '../components/organisms/PokemonDetailSection';

function PokemonProfilePage() {
  const { pokemonName } = useParams();

  if (!pokemonName) {
    return <Navigate to="/" replace />;
  }

  return <PokemonDetailSection pokemonName={pokemonName} />;
}

export default PokemonProfilePage;
