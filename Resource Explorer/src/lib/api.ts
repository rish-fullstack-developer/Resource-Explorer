import { ApiResponse, Character, FilterParams, SearchParams } from '@/types/api';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

export class AbortError extends Error {
  constructor(message = 'The request was aborted') {
    super(message);
    this.name = 'AbortError';
  }
}

// Function to fetch characters with filtering and pagination
export async function fetchCharacters(
  params: SearchParams = {},
  signal?: AbortSignal
): Promise<ApiResponse<Character>> {
  try {
    // Extract the parameters
    const { name, status, gender, species, page = 1 } = params;
    
    // Build the query string
    const queryParams = new URLSearchParams();
    if (name) queryParams.append('name', name);
    if (status) queryParams.append('status', status);
    if (gender) queryParams.append('gender', gender);
    if (species) queryParams.append('species', species);
    if (page) queryParams.append('page', page.toString());
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/character${queryString ? `?${queryString}` : ''}`;
    
    // Make the API call with abort controller
    const response = await fetch(url, { signal });
    
    if (!response.ok) {
      if (response.status === 404) {
        // Return empty results for 404 (no matching characters)
        return {
          info: {
            count: 0,
            pages: 0,
            next: null,
            prev: null,
          },
          results: [],
        };
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AbortError();
    }
    throw error;
  }
}

// Function to fetch a single character by ID
export async function fetchCharacterById(
  id: number,
  signal?: AbortSignal
): Promise<Character> {
  try {
    const response = await fetch(`${API_BASE_URL}/character/${id}`, { signal });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AbortError();
    }
    throw error;
  }
}

// Function to apply sorting to characters
export function sortCharacters(characters: Character[], sortBy: string, sortOrder: 'asc' | 'desc'): Character[] {
  return [...characters].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'id':
        comparison = a.id - b.id;
        break;
      case 'species':
        comparison = a.species.localeCompare(b.species);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}