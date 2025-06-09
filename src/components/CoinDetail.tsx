import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  StatGroup,
  Skeleton,
  Alert,
  AlertIcon,
  Center,
  Spinner,
  useColorMode
} from '@chakra-ui/react'
import { getCoinDetail } from '../services/api'
import { QuestionOutlineIcon } from '@chakra-ui/icons'

const CoinDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { colorMode } = useColorMode()
  const { data: coin, isLoading, isError, error } = useQuery({
    queryKey: ['coin', id],
    queryFn: () => getCoinDetail(id!),
    retry: 3,
    staleTime: 30000
  })

  if (isError) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        {error instanceof Error ? error.message : 'Error loading cryptocurrency details. Please try again later.'}
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Center py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
            Loading cryptocurrency details...
          </Text>
        </VStack>
      </Center>
    )
  }

  if (!coin) {
    return (
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        No data available for this cryptocurrency.
      </Alert>
    )
  }

  // Debug logging
  console.log('Coin detail:', coin);
  console.log('Coin image:', coin.image);

  // Defensive image URL selection
  let imageUrl = '';
  if (coin.image) {
    if (typeof coin.image === 'string') {
      imageUrl = coin.image;
    } else if (typeof coin.image === 'object') {
      imageUrl = coin.image.large || coin.image.small || coin.image.thumb || '';
    }
  }

  return (
    <VStack spacing={8} align="stretch">
      <Box bg={colorMode === 'dark' ? 'gray.700' : 'white'} p={6} borderRadius="lg" shadow="sm">
        <HStack spacing={4}>
          <Box boxSize="64px" display="flex" alignItems="center" justifyContent="center">
            <Image
              src={imageUrl}
              alt={coin.name}
              boxSize="64px"
              objectFit="contain"
              fallback={<QuestionOutlineIcon boxSize="40px" color="gray.400" />}
            />
          </Box>
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="bold">{coin.name}</Text>
            <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>{coin.symbol?.toUpperCase?.() || ''}</Text>
            <StatGroup>
              <Stat>
                <HStack>
                  <StatArrow type={coin.price_change_percentage_24h >= 0 ? 'increase' : 'decrease'} />
                  <Text color={coin.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}>
                    {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                  </Text>
                </HStack>
              </Stat>
            </StatGroup>
          </VStack>
        </HStack>
      </Box>

      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
        <GridItem>
          <Box bg={colorMode === 'dark' ? 'gray.700' : 'white'} p={6} borderRadius="lg" shadow="sm" height="100%">
            <StatGroup>
              <Stat>
                <StatLabel>Current Price</StatLabel>
                <StatNumber fontSize="2xl">
                  ${coin.current_price?.toLocaleString()}
                </StatNumber>
              </Stat>
            </StatGroup>
          </Box>
        </GridItem>

        <GridItem>
          <Box bg={colorMode === 'dark' ? 'gray.700' : 'white'} p={6} borderRadius="lg" shadow="sm" height="100%">
            <StatGroup>
              <Stat>
                <StatLabel>Market Cap</StatLabel>
                <StatNumber fontSize="2xl">
                  ${coin.market_cap?.toLocaleString()}
                </StatNumber>
                <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.500'} mt={2}>
                  Rank #{coin.market_cap_rank}
                </Text>
              </Stat>
            </StatGroup>
          </Box>
        </GridItem>

        <GridItem>
          <Box bg={colorMode === 'dark' ? 'gray.700' : 'white'} p={6} borderRadius="lg" shadow="sm" height="100%">
            <StatGroup>
              <Stat>
                <StatLabel>24h Volume</StatLabel>
                <StatNumber fontSize="2xl">
                  ${coin.total_volume?.toLocaleString()}
                </StatNumber>
              </Stat>
            </StatGroup>
          </Box>
        </GridItem>
      </Grid>

      <Box bg={colorMode === 'dark' ? 'gray.700' : 'white'} p={6} borderRadius="lg" shadow="sm">
        <Text fontSize="xl" fontWeight="bold" mb={4}>Price Change</Text>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          <Box>
            <StatGroup>
              <Stat>
                <StatLabel>7 Days</StatLabel>
                <HStack spacing={2} mt={2}>
                  <StatArrow type={coin.market_data?.price_change_percentage_7d >= 0 ? 'increase' : 'decrease'} />
                  <Text fontSize="lg" fontWeight="bold" color={coin.market_data?.price_change_percentage_7d >= 0 ? 'green.500' : 'red.500'}>
                    {Math.abs(coin.market_data?.price_change_percentage_7d || 0).toFixed(2)}%
                  </Text>
                </HStack>
              </Stat>
            </StatGroup>
          </Box>

          <Box>
            <StatGroup>
              <Stat>
                <StatLabel>30 Days</StatLabel>
                <HStack spacing={2} mt={2}>
                  <StatArrow type={coin.market_data?.price_change_percentage_30d >= 0 ? 'increase' : 'decrease'} />
                  <Text fontSize="lg" fontWeight="bold" color={coin.market_data?.price_change_percentage_30d >= 0 ? 'green.500' : 'red.500'}>
                    {Math.abs(coin.market_data?.price_change_percentage_30d || 0).toFixed(2)}%
                  </Text>
                </HStack>
              </Stat>
            </StatGroup>
          </Box>

          <Box>
            <StatGroup>
              <Stat>
                <StatLabel>1 Year</StatLabel>
                <HStack spacing={2} mt={2}>
                  <StatArrow type={coin.market_data?.price_change_percentage_1y >= 0 ? 'increase' : 'decrease'} />
                  <Text fontSize="lg" fontWeight="bold" color={coin.market_data?.price_change_percentage_1y >= 0 ? 'green.500' : 'red.500'}>
                    {Math.abs(coin.market_data?.price_change_percentage_1y || 0).toFixed(2)}%
                  </Text>
                </HStack>
              </Stat>
            </StatGroup>
          </Box>
        </Grid>
      </Box>

      {coin.description?.en && (
        <Box bg={colorMode === 'dark' ? 'gray.700' : 'white'} p={6} borderRadius="lg" shadow="sm">
          <Text fontSize="xl" fontWeight="bold" mb={4}>About {coin.name}</Text>
          <Text color={colorMode === 'dark' ? 'gray.300' : 'gray.700'} dangerouslySetInnerHTML={{ __html: coin.description.en }} />
        </Box>
      )}
    </VStack>
  )
}

export default CoinDetail 