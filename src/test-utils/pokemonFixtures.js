export const pokemonListSample = [
  {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
  },
  {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
  },
];

export const bulbasaurProfile = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    other: {
      'official-artwork': {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
    },
  },
  abilities: [
    {
      ability: {
        name: 'overgrow',
      },
    },
  ],
};
