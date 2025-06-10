import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Grid,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  useColorMode,
  Select,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  StatGroup,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  useToast,
  IconButton
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { getCoins, type Coin } from '../services/api'
import { QuestionOutlineIcon, StarIcon } from '@chakra-ui/icons'
import { useFavourites } from '../hooks/useFavourites'

interface CoinListProps {
  searchQuery?: string;
  showFavouritesOnly?: boolean;
}

const CoinCard = ({ coin }: { coin: Coin }) => {
  const { colorMode } = useColorMode()
  const priceChange = coin.price_change_percentage_24h
  const isPositive = priceChange >= 0
  const { isFavourite, toggleFavourite } = useFavourites()

  return (
    <Box position="relative">
      <Link to={`/coin/${coin.id}`}>
        <Box
          p={6}
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          borderRadius="lg"
          shadow="sm"
          transition="all 0.2s"
          _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.100'}
        >
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Box boxSize="32px" display="flex" alignItems="center" justifyContent="center">
                <Image
                  src={coin.image}
                  alt={coin.name}
                  boxSize="32px"
                  objectFit="contain"
                  fallback={<QuestionOutlineIcon boxSize="20px" color="gray.400" />}
                />
              </Box>
              <StatGroup>
                <Stat>
                  <Badge colorScheme={isPositive ? 'green' : 'red'}>
                    <StatArrow type={isPositive ? 'increase' : 'decrease'} />
                    {Math.abs(priceChange).toFixed(2)}%
                  </Badge>
                </Stat>
              </StatGroup>
            </HStack>
            
            <VStack align="stretch" spacing={1}>
              <Text fontWeight="bold" fontSize="lg" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
                {coin.name}
              </Text>
              <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} fontSize="sm">
                {coin.symbol.toUpperCase()}
              </Text>
            </VStack>
            
            <StatGroup w="100%" display="flex" alignItems="center" justifyContent="space-between">
              <Stat>
                <StatLabel color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>Price</StatLabel>
                <StatNumber fontSize="xl" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
                  {coin.current_price < 0.01
                    ? `$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 8 })}`
                    : `$${coin.current_price.toLocaleString()}`}
                </StatNumber>
              </Stat>
              <Box pr={0} pl={0}>
                <Stat>
                  <StatLabel color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>Rank</StatLabel>
                  <StatNumber fontSize="xl" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
                    #{coin.market_cap_rank}
                  </StatNumber>
                </Stat>
              </Box>
            </StatGroup>

            <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>
              Volume: ${coin.total_volume.toLocaleString()}
            </Text>
          </VStack>
        </Box>
      </Link>
      <IconButton
        aria-label={isFavourite(coin.id) ? 'Unfavourite' : 'Favourite'}
        icon={<StarIcon color={isFavourite(coin.id) ? 'yellow.400' : 'gray.400'} />}
        size="sm"
        variant="ghost"
        position="absolute"
        top={2}
        right={2}
        onClick={(e) => {
          e.preventDefault();
          toggleFavourite(coin.id);
        }}
        zIndex={2}
      />
    </Box>
  )
}

const CoinList = ({ searchQuery = '', showFavouritesOnly = false }: CoinListProps) => {
  const [sortBy, setSortBy] = useState<string>('market_cap_rank')
  const { colorMode } = useColorMode()
  const toast = useToast()
  const { favourites } = useFavourites()

  const { data: coins, isLoading, error, isError } = useQuery({
    queryKey: ['coins'],
    queryFn: async () => {
      try {
        return await getCoins();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw error;
      }
    },
    refetchInterval: 120000, // Refetch every 2 minutes
    retry: 3,
  })

  const sortedCoins = coins ? [...coins].sort((a, b) => {
    switch (sortBy) {
      case 'price_high':
        return b.current_price - a.current_price
      case 'price_low':
        return a.current_price - b.current_price
      case 'change_high':
        return b.price_change_percentage_24h - a.price_change_percentage_24h
      case 'change_low':
        return a.price_change_percentage_24h - b.price_change_percentage_24h
      default:
        return a.market_cap_rank - b.market_cap_rank
    }
  }) : []

  const filteredCoins = sortedCoins.filter(
    (coin) =>
      (coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!showFavouritesOnly || favourites.includes(coin.id))
  );

  if (isError && error instanceof Error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        {error.message}
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Center py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
            Loading cryptocurrency data...
          </Text>
        </VStack>
      </Center>
    )
  }

  if (!filteredCoins || filteredCoins.length === 0) {
    return (
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        No cryptocurrency data available at the moment.
      </Alert>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="flex-end">
        <Select
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
          maxW="200px"
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
          color={colorMode === 'dark' ? 'white' : 'gray.800'}
        >
          <option value="market_cap_rank">Rank</option>
          <option value="price_high">Price (High to Low)</option>
          <option value="price_low">Price (Low to High)</option>
          <option value="change_high">Change % (High to Low)</option>
          <option value="change_low">Change % (Low to High)</option>
        </Select>
      </Flex>

      <Grid 
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)"
        }} 
        gap={6}
      >
        {filteredCoins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </Grid>
    </VStack>
  )
}

export default CoinList 