export const getId = (url: string): number => {
  const parts = url.split('/')
  const id = parts[parts.length - 2] // Get the second last part of the URL
  return parseInt(id)
}


export const getName = (name: string): string => {
  return name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}
