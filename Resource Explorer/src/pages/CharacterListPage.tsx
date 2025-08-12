import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiResponse, Character, SearchParams } from '@/types/api';
import { fetchCharacters, sortCharacters } from '@/lib/api';
import SearchFilters from '@/components/SearchFilters';
import CharacterGrid from '@/components/CharacterGrid';
import Pagination from '@/components/Pagination';
import { useUrlState } from '@/hooks/use-url-state';
import { useFavorites } from '@/hooks/use-favorites';

export default function CharacterListPage() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [apiResponse, setApiResponse] = useState<ApiResponse<Character> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { searchParams, updateParams } = useUrlState();
  const { filterFavorites, isLoaded: favoritesLoaded } = useFavorites();
  
  // Scroll position restoration
  const scrollPositionRef = useRef<number>(0);
  
  // Store scroll position when navigating away
  useEffect(() => {
    // Store current scroll position when component unmounts
    return () => {
      scrollPositionRef.current = window.scrollY;
    };
  }, []);
  
  // Restore scroll position when coming back
  useEffect(() => {
    // Check if we have a stored position to restore
    if (scrollPositionRef.current > 0) {
      // Use requestAnimationFrame to ensure the DOM is ready
      window.requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
        // Reset the stored position
        scrollPositionRef.current = 0;
      });
    }
  }, []);
  
  const fetchData = useCallback(async () => {
    // Don't fetch if favorites aren't loaded yet
    if (!favoritesLoaded) return;
    
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    
    try {
      // If we're showing favorites only, we don't need to fetch from API
      if (searchParams.favorites) {
        // We still need to simulate the API response format with empty results
        // Real favorites will be filtered from localStorage later
        setApiResponse({
          info: {
            count: 0,
            pages: 1,
            next: null,
            prev: null,
          },
          results: [],
        });
        return;
      }
      
      // Only include non-favorite filters when fetching
      const apiParams = { ...searchParams };
      delete apiParams.favorites;
      delete apiParams.sort;
      
      const response = await fetchCharacters(apiParams, abortControllerRef.current.signal);
      setApiResponse(response);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err as Error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, favoritesLoaded]);
  
  // Process the API response and apply client-side operations like favorites filtering and sorting
  useEffect(() => {
    if (!apiResponse || !favoritesLoaded) return;
    
    let processedCharacters = [...apiResponse.results];
    
    // Apply favorites filter if enabled
    if (searchParams.favorites) {
      // When favorites filter is on, we need to get all favorites from localStorage
      // For a real app, we would use an API endpoint for this to avoid performance issues
      processedCharacters = filterFavorites(processedCharacters);
    }
    
    // Apply sorting
    if (searchParams.sort) {
      processedCharacters = sortCharacters(
        processedCharacters,
        searchParams.sort.sortBy,
        searchParams.sort.sortOrder
      );
    }
    
    setCharacters(processedCharacters);
  }, [apiResponse, searchParams.sort, searchParams.favorites, filterFavorites, favoritesLoaded]);
  
  // Fetch data when search parameters change
  useEffect(() => {
    fetchData();
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);
  
  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ page });
      // Scroll to top on page change
      window.scrollTo(0, 0);
    },
    [updateParams]
  );
  
  // Handle clearing all filters
  const handleClearFilters = useCallback(() => {
    updateParams({
      name: '',
      status: '',
      gender: '',
      species: '',
      favorites: false,
      page: 1,
    });
  }, [updateParams]);
  
  // Handle character click to navigate to detail view
  const handleCharacterClick = useCallback(
    (character: Character) => {
      navigate(`/character/${character.id}`);
    },
    [navigate]
  );
  
  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Rick & Morty Characters</h1>
          <p className="text-muted-foreground mb-6">
            Explore characters from the Rick & Morty universe. Use the filters below to find specific characters.
          </p>
        </div>
        
        <SearchFilters
          searchParams={searchParams}
          onSearchChange={updateParams}
          isLoading={isLoading}
          onClearFilters={handleClearFilters}
        />
        
        <CharacterGrid
          characters={characters}
          isLoading={isLoading}
          error={error}
          onRetry={fetchData}
        />
        
        {!isLoading && !error && apiResponse && (
          <Pagination
            currentPage={searchParams.page || 1}
            totalPages={apiResponse.info.pages}
            onPageChange={handlePageChange}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}