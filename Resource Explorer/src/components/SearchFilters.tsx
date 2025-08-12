import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchParams, SortParams } from '@/types/api';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ReloadIcon, Cross2Icon } from '@radix-ui/react-icons';

interface SearchFiltersProps {
  searchParams: SearchParams;
  onSearchChange: (params: Partial<SearchParams>) => void;
  isLoading: boolean;
  onClearFilters: () => void;
}

export default function SearchFilters({ searchParams, onSearchChange, isLoading, onClearFilters }: SearchFiltersProps) {
  // Use local state for search input to debounce
  const [searchInput, setSearchInput] = useState(searchParams.name || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update search param when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== searchParams.name) {
      onSearchChange({ name: debouncedSearch });
    }
  }, [debouncedSearch, onSearchChange, searchParams.name]);

  const hasActiveFilters = !!(
    searchParams.name ||
    searchParams.status ||
    searchParams.gender ||
    searchParams.species ||
    searchParams.favorites
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search input */}
        <div className="relative">
          <Input
            placeholder="Search characters..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchInput('')}
              aria-label="Clear search"
            >
              <Cross2Icon className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Status filter */}
        <Select
          value={searchParams.status || 'all'}
          onValueChange={(value) => onSearchChange({ status: value === 'all' ? '' : value as 'alive' | 'dead' | 'unknown' })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="alive">Alive</SelectItem>
            <SelectItem value="dead">Dead</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>

        {/* Gender filter */}
        <Select
          value={searchParams.gender || 'all'}
          onValueChange={(value) => onSearchChange({ gender: value === 'all' ? '' : value as 'female' | 'male' | 'genderless' | 'unknown' })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genders</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="genderless">Genderless</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>

        {/* Species filter */}
        <Input
          placeholder="Filter by species..."
          value={searchParams.species || ''}
          onChange={(e) => onSearchChange({ species: e.target.value })}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          {/* Favorites filter */}
          <div className="flex items-center space-x-2">
            <Switch
              id="favorites-filter"
              checked={searchParams.favorites}
              onCheckedChange={(checked) => onSearchChange({ favorites: checked })}
              disabled={isLoading}
            />
            <Label htmlFor="favorites-filter">Show favorites only</Label>
          </div>

          {/* Sort options */}
          <div className="flex items-center gap-2">
            <Select
              value={searchParams.sort?.sortBy || 'id'}
              onValueChange={(value) => {
                const newSort: SortParams = {
                  sortBy: value as SortParams['sortBy'],
                  sortOrder: searchParams.sort?.sortOrder || 'asc'
                };
                onSearchChange({ sort: newSort });
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="species">Species</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchParams.sort?.sortOrder || 'asc'}
              onValueChange={(value) => {
                const newSort: SortParams = {
                  sortBy: searchParams.sort?.sortBy || 'id',
                  sortOrder: value as SortParams['sortOrder']
                };
                onSearchChange({ sort: newSort });
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Cross2Icon className="mr-2 h-4 w-4" />
            )}
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}