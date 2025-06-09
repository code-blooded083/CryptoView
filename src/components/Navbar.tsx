import React from 'react'
import {
  Box,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Heading,
  IconButton,
  useColorMode,
  HStack,
  Text,
  Badge,
  StatGroup,
  Stat,
  StatArrow
} from '@chakra-ui/react'
import { Search2Icon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCoins } from '../services/api'

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box 
      bg={colorMode === 'dark' ? 'gray.900' : 'white'} 
      px={4} 
      py={4} 
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={1000}
      transition="background-color 0.2s"
    >
      <Container maxW="container.xl">
        <Flex
          align="center"
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 0 }}
        >
          <HStack spacing={8} w="100%" justify={{ base: "center", md: "flex-start" }}>
            <Link to="/">
              <Heading size="lg" color={colorMode === 'dark' ? 'blue.300' : 'blue.500'}>
                CryptoTracker
              </Heading>
            </Link>
          </HStack>
          <HStack spacing={4} w="100%" justify={{ base: "center", md: "flex-end" }}>
            <InputGroup
              maxW={{ base: '100%', md: '400px' }}
              w={{ base: '100%', md: 'auto' }}
              mt={{ base: 2, md: 0 }}
            >
              <InputLeftElement pointerEvents="none">
                <Search2Icon color={colorMode === 'dark' ? 'gray.300' : 'gray.400'} />
              </InputLeftElement>
              <Input
                placeholder="Search cryptocurrencies..."
                onChange={(e) => onSearch?.(e.target.value)}
                borderRadius="full"
                bg={colorMode === 'dark' ? 'gray.800' : 'white'}
                _focus={{
                  borderColor: colorMode === 'dark' ? 'blue.300' : 'blue.500',
                  boxShadow: `0 0 0 1px var(--chakra-colors-${colorMode === 'dark' ? 'blue-300' : 'blue-500'})`
                }}
              />
            </InputGroup>
            <IconButton
              aria-label="Toggle dark mode"
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme={colorMode === 'dark' ? 'yellow' : 'blue'}
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar 