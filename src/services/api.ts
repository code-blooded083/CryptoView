import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Accept': 'application/json'
  }
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.')
      throw new Error('Rate limit exceeded. Please try again later.')
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. Please check your connection.')
      throw new Error('Request timed out. Please check your connection.')
    }

    if (error.response?.status === 404) {
      console.error('Resource not found.')
      throw new Error('Resource not found.')
    }

    console.error('API Error:', error.message)
    throw new Error('Failed to fetch data. Please try again later.')
  }
)

export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  total_volume: number
}

export interface CoinDetail {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  description: {
    en: string
  }
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    total_volume: { usd: number }
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    price_change_percentage_1y: number
  }
}

export const getCoins = async (page = 1): Promise<Coin[]> => {
  try {
    const { data } = await api.get<Coin[]>('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page,
        sparkline: false
      }
    })
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format')
    }
    
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch cryptocurrency data')
  }
}

export const getCoinDetail = async (id: string): Promise<CoinDetail> => {
  if (!id) {
    throw new Error('Coin ID is required')
  }

  try {
    const { data } = await api.get<CoinDetail>(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    })
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format')
    }

    // Map the nested market data to the top level for easier access
    return {
      ...data,
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      total_volume: data.market_data.total_volume.usd,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Failed to fetch details for ${id}`)
  }
}

export const searchCoins = async (query: string) => {
  if (!query) {
    return []
  }

  try {
    const { data } = await api.get('/search', {
      params: {
        query
      }
    })
    
    if (!data || !Array.isArray(data.coins)) {
      throw new Error('Invalid response format')
    }
    
    return data.coins
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to search cryptocurrencies')
  }
} 