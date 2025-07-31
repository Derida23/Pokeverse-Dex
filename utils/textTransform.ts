import { types } from "@/constants/types"
import { generations } from "~/constants/filter"

export const getPokemonId = (id: number) => {
  return String(id).padStart(4, '0')
}

export const getName = (name: string): string => {
  return name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

export const getNameTypes = (id: number) => {
  const type = types.find(item => item.id === id)

  return type?.name ?? ''
}

export const getID = (url: string) => {
  return url.split('/')[6]
}

export const getEggName = (name: string): string => {
  if (name === 'no-eggs') {
    return "Undiscovered"
  }

  if (name === 'water1') {
    return "water 1"
  }

  if (name === 'water2') {
    return "water 2"
  }

  if (name === 'water3') {
    return "water 3"
  }
  return name
}

export const getSize = (size: number) => {
  return size/10
}

export const getGenName = (id: number) => {
  const gen = generations[0].find(item => item.id === id)?.label.split(" ")[1]

  return gen
}

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
