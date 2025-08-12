// Rick & Morty API types

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

export interface FilterParams {
  name?: string;
  status?: 'alive' | 'dead' | 'unknown' | '';
  gender?: 'female' | 'male' | 'genderless' | 'unknown' | '';
  species?: string;
}

export interface SortParams {
  sortBy: 'name' | 'id' | 'species';
  sortOrder: 'asc' | 'desc';
}

export interface SearchParams extends FilterParams {
  page?: number;
  sort?: SortParams;
  favorites?: boolean;
}