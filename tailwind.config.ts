import type { Config } from 'tailwindcss'
export const typeColors = {
  normal:   '#E6E6D6',
  fire:     '#FFD8B5',
  water:    '#B3D4FF',
  electric: '#FFF2B2',
  grass:    '#CDECCB',
  ice:      '#D4F1F9',
  fighting: '#E9B4B4',
  poison:   '#D9B8E3',
  ground:   '#F0E1C2',
  flying:   '#D9D2F2',
  psychic:  '#F9C7D9',
  bug:      '#E0EEAA',
  rock:     '#E2D6A6',
  ghost:    '#CFC1E7',
  dragon:   '#D2C5FF',
  dark:     '#C9BEB9',
  steel:    '#E3E3F0',
  fairy:    '#F9D2EB'
}

export const typeColors2 = {
  normal:   '#A8A77A',
  fire:     '#EE8130',
  water:    '#6390F0',
  electric: '#F7D02C',
  grass:    '#7AC74C',
  ice:      '#96D9D6',
  fighting: '#C22E28',
  poison:   '#A33EA1',
  ground:   '#E2BF65',
  flying:   '#A98FF3',
  psychic:  '#F95587',
  bug:      '#A6B91A',
  rock:     '#B6A136',
  ghost:    '#735797',
  dragon:   '#6F35FC',
  dark:     '#705746',
  steel:    '#B7B7CE',
  fairy:    '#D685AD'
}


const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        type: typeColors,
        skill: typeColors2
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif']
      }
    }
  },
  plugins: [],
  safelist: [
    ...Object.keys(typeColors).map(t => `bg-type-${t}`),
    ...Object.keys(typeColors2).map(t => `bg-skill-${t}`)
  ]
}

export default config
