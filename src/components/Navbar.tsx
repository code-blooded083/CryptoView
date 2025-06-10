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
  HStack
} from '@chakra-ui/react'
import { Search2Icon, MoonIcon, SunIcon, StarIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface NavbarProps {
  onSearch?: (query: string) => void;
  showFavouritesOnly: boolean;
  setShowFavouritesOnly: (show: boolean) => void;
}

const Navbar = ({ onSearch, showFavouritesOnly, setShowFavouritesOnly }: NavbarProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()

  // Persist color mode in localStorage
  useEffect(() => {
    localStorage.setItem('colorMode', colorMode)
  }, [colorMode])

  // On mount, set color mode from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem('colorMode')
    if (stored && stored !== colorMode) {
      toggleColorMode()
    }
    // eslint-disable-next-line
  }, [])

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
            <Heading
              size="lg"
              color={colorMode === 'dark' ? 'blue.300' : 'blue.500'}
              cursor="pointer"
              onClick={() => {
                setShowFavouritesOnly(false);
                navigate('/');
              }}
            >
              CryptoView
            </Heading>
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
            <IconButton
              aria-label={showFavouritesOnly ? 'Show All' : 'Show Favourites'}
              icon={<StarIcon color={showFavouritesOnly ? 'yellow.400' : 'gray.400'} />}
              onClick={() => {
                setShowFavouritesOnly(!showFavouritesOnly);
                navigate('/');
              }}
              variant="ghost"
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar 