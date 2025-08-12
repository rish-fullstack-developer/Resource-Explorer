import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FilterParams, SearchParams, SortParams } from '@/types/api';

// Default values for search parameters
const DEFAULT_PARAMS: SearchParams = {
  page: 1,
  name: '',
  status: '',
  gender: '',
  species: '',
  sort: {
    sortBy: 'id',
    sortOrder: 'asc',
  },
  favorites: false,
};

export function useUrlState(initialState: Partial<SearchParams> = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL params on initial load
  const parseUrlParams = useCallback((): SearchParams => {
    const params = new URLSearchParams(location.search);
    
    return {
      page: params.has('page') ? Number(params.get('page')) : DEFAULT_PARAMS.page,
      name: params.get('name') || DEFAULT_PARAMS.name,
      status: params.get('status') as FilterParams['status'] || DEFAULT_PARAMS.status,
      gender: params.get('gender') as FilterParams['gender'] || DEFAULT_PARAMS.gender,
      species: params.get('species') || DEFAULT_PARAMS.species,
      sort: {
        sortBy: params.get('sortBy') as SortParams['sortBy'] || DEFAULT_PARAMS.sort!.sortBy,
        sortOrder: params.get('sortOrder') as SortParams['sortOrder'] || DEFAULT_PARAMS.sort!.sortOrder,
      },
      favorites: params.get('favorites') === 'true',
    };
  }, [location.search]);
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    ...DEFAULT_PARAMS,
    ...initialState,
    ...parseUrlParams(),
  });
  
  // Update URL whenever searchParams change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchParams.page !== DEFAULT_PARAMS.page) {
      params.set('page', searchParams.page!.toString());
    }
    
    if (searchParams.name) {
      params.set('name', searchParams.name);
    }
    
    if (searchParams.status) {
      params.set('status', searchParams.status);
    }
    
    if (searchParams.gender) {
      params.set('gender', searchParams.gender);
    }
    
    if (searchParams.species) {
      params.set('species', searchParams.species);
    }
    
    if (searchParams.sort?.sortBy !== DEFAULT_PARAMS.sort?.sortBy) {
      params.set('sortBy', searchParams.sort!.sortBy);
    }
    
    if (searchParams.sort?.sortOrder !== DEFAULT_PARAMS.sort?.sortOrder) {
      params.set('sortOrder', searchParams.sort!.sortOrder);
    }
    
    if (searchParams.favorites) {
      params.set('favorites', 'true');
    }
    
    const search = params.toString();
    const newUrl = `${location.pathname}${search ? `?${search}` : ''}`;
    
    if (newUrl !== `${location.pathname}${location.search}`) {
      navigate(newUrl, { replace: true });
    }
  }, [searchParams, navigate, location.pathname]);
  
  // Sync URL changes with state
  useEffect(() => {
    setSearchParams(parseUrlParams());
  }, [location.search, parseUrlParams]);
  
  // Update individual params
  const updateParams = useCallback((newParams: Partial<SearchParams>) => {
    setSearchParams((prev) => {
      // When changing filters, reset to page 1
      if (
        newParams.name !== undefined ||
        newParams.status !== undefined ||
        newParams.gender !== undefined ||
        newParams.species !== undefined ||
        newParams.favorites !== undefined
      ) {
        return { ...prev, ...newParams, page: 1 };
      }
      return { ...prev, ...newParams };
    });
  }, []);
  
  return { searchParams, updateParams };
}