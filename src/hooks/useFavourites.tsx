import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface FavouritesContextType {
  favourites: string[];
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favouriteCoins');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favouriteCoins', JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (id: string) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const isFavourite = (id: string) => favourites.includes(id);

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
} 