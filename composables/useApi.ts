import { defu } from 'defu'
import type { UseFetchOptions } from 'nuxt/app'

export interface ErrorApiResponse {
  status: number
  body: {
    code: number
    messages: string[]
  }
}

export type ApiFetchOptions<T> = UseFetchOptions<T> & {
  excludeInterceptor?: number[]
  onSuccess?: (response: {
    status: number
    body: T
  }) => Promise<void> | void
  onError?: (response: ErrorApiResponse) => Promise<void> | void
}

export function useApi<T>(
  url: string | Request | Ref<string | Request> | (() => string) | Request,
  opts: ApiFetchOptions<T> = {}) {
  const { excludeInterceptor, ...options } = opts

  const nuxtApp = useNuxtApp()

  const defaults: UseFetchOptions<T> = {
    async onRequest({ options }) {
      options.headers = new Headers(options.headers)
      options.headers.set('X-Requested-With', 'XMLHttpRequest')
    },
    
    async onResponse({ response }) {
      if (typeof opts.onSuccess === 'function' && response.status >= 200 && response.status < 300) {
        await opts.onSuccess({
          status: response.status,
          body: response._data,
        })
      }
    },

    async onResponseError(ctx) {
      const excludedInterceptor = (statusCode: number): boolean => {
        if (!excludeInterceptor)
          return false

        return excludeInterceptor.includes(statusCode)
      }

      const toast = await nuxtApp.runWithContext(() => useToast())

      if (!excludedInterceptor(ctx.response.status)) {
        if (ctx.response.status === 401) {
          toast.add({
            color: 'red',
            title: 'Session Expired',
            description: 'Your session has expired, please log in.',
          })

          if (typeof window !== 'undefined')
            window.location.reload()
        }

        if (ctx.response.status === 403) {
          toast.add({
            color: 'red',
            title: 'Access Forbiden',
            description: 'Your Account is not permitted to request to some endpoints.',
          })
        }

        if (ctx.response.status >= 500) {
          toast.add({
            color: 'red',
            title: 'Error',
            description: 'We\'re sorry but we\'re having some technical difficulties.',
          })
        }
      }

      if (typeof opts.onError === 'function') {
        await opts.onError({
          status: ctx.response.status,
          body: ctx.response._data,
        })
      }
    },
  }

  const params = defu(options, defaults)

  return useFetch(url, params)
}
