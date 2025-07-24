import { pokemon_types } from '@/constants/types'

export default defineEventHandler(async (event) => {
  try {
    const response = [...pokemon_types]

    return {
      success: true,
      message: 'Fetched successfully',
      data: response
    }
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string }
    return sendError(event, createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error',
    }))
  }
})
