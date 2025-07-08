import { FORM_KEYWORDS } from '~/constants/names';
import { getId, getName } from '~/utils/textTransform'

export const groupPokemonForms = (pokemons: { name: string; url: string }[]) => {
  const result = []
  const map = new Map()

  for (const pokemon of pokemons) {
    const hasForm = FORM_KEYWORDS.some(keyword => pokemon.name.includes(keyword))
    let baseName

    if (hasForm) {
      baseName = FORM_KEYWORDS.reduce((name, keyword) => {
        const index = name.indexOf(`-${keyword}`)
        return index !== -1 ? name.substring(0, index) : name
      }, pokemon.name)
    } else {
      baseName = pokemon.name
    }

    if (!map.has(baseName)) {
      // Add base Pokémon
      const basePokemon = pokemons.find(p => p.name === baseName) || { name: baseName, url: '' }
      const group = {
        id: getId(basePokemon.url),
        name: basePokemon.name,
        title: getName(baseName),
        url: basePokemon.url,
        form: hasForm ? [pokemon] : 
        [ {
          id: getId(basePokemon.url),
          name: basePokemon.name, 
          title: getName(baseName), 
          url: basePokemon.url } ]
      }
      map.set(baseName, group)
      result.push(group)
    } else {
      // Add form to existing base
      const group = map.get(baseName)
      // Avoid duplicate base name if already inserted
      if (pokemon.name !== baseName || hasForm) {
        group.form.push(
          {
            id: getId(pokemon.url), 
            name: pokemon.name,
            title: getName(pokemon.name), 
            url: pokemon.url,
          })
      }
    }
  }

  return result
}
