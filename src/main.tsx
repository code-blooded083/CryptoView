import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from './theme'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if (error instanceof Error && error.message.includes('404')) {
          return false
        }
        // Retry up to 3 times
        return failureCount < 3
      },
      staleTime: 30000, // Consider data stale after 30 seconds
      gcTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchInterval: 30000 // Refetch every 30 seconds
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
