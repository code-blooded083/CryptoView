import { useState, useEffect } from 'react'
import { Box, Container, useColorMode, Alert, AlertIcon, AlertTitle, AlertDescription, Button } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Suspense, Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import Navbar from './components/Navbar'
import CoinList from './components/CoinList'
import CoinDetail from './components/CoinDetail'
import { FavouritesProvider } from './hooks/useFavourites'

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="lg"
          my={4}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Something went wrong
          </AlertTitle>
          <AlertDescription maxWidth="sm" mb={4}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </AlertDescription>
          <Button
            colorScheme="red"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Alert>
      )
    }

    return this.props.children
  }
}

function LoadingFallback() {
  const { colorMode } = useColorMode()
  return (
    <Box
      minH="200px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
    >
      Loading...
    </Box>
  )
}

function AppContent() {
  const { colorMode } = useColorMode()
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Persist last visited path
  useEffect(() => {
    if (location.pathname !== '/') {
      localStorage.setItem('lastVisitedPath', location.pathname + location.search + location.hash);
    } else {
      localStorage.removeItem('lastVisitedPath');
    }
  }, [location]);

  // Restore last visited path on initial load
  useEffect(() => {
    const lastPath = localStorage.getItem('lastVisitedPath');
    if (lastPath && location.pathname === '/') {
      navigate(lastPath, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <FavouritesProvider>
      <Box 
        minH="100vh" 
        bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'} 
        transition="background-color 0.2s"
        display="flex"
        flexDirection="column"
      >
        <ErrorBoundary>
          <Navbar onSearch={setSearchQuery} showFavouritesOnly={showFavouritesOnly} setShowFavouritesOnly={setShowFavouritesOnly} />
          <Container 
            maxW="container.xl" 
            py={8} 
            px={4}
            flex="1"
            display="flex"
            flexDirection="column"
          >
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<CoinList searchQuery={searchQuery} showFavouritesOnly={showFavouritesOnly} />} />
                <Route path="/coin/:id" element={<CoinDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Container>
        </ErrorBoundary>
      </Box>
    </FavouritesProvider>
  )
}

function App() {
  return (
    <Router basename="/CryptoView">
      <AppContent />
    </Router>
  )
}

export default App
