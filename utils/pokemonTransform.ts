import { pokemons } from "@/constants/pokemons";

 export const pokemonTransform = pokemons.flatMap(pokemon => {
    const baseForm = {
      name: pokemon.name,
      id: pokemon.id,
      type: pokemon.types[0], // take the first type set
      generation: pokemon.generation
    };

    const formVariants = (pokemon.form_variants || []).map(form => ({
      name: form.form_name,
      id: form.form_id,
      type: form.types,
      generation: pokemon.generation
    }));

    return [baseForm, ...formVariants];
  });
