export function useApiPokemon(){
  interface Pokemons {
    count: number
    next: string
    previous?: string
    results: Result[]
  }

  interface Result {
    name: string
    url: string
  }

  const getAll = async () => {
    const { data } = await useApi<Pokemons>('/api/pokemon?limit=20')
    const pokemons = data.value?.results?.map(item => item.url) || []

    const pokemon = await Promise.all(
      pokemons.map(url => $fetch(url.slice(0, -1)))
    )

    return pokemon
  }

  return {
    getAll
  }
}
