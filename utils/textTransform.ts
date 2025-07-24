import { types } from "@/constants/types"

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
