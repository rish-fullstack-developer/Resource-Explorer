import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchCharacterById } from '@/lib/api';
import { Character } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFavorites } from '@/hooks/use-favorites';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, HeartIcon, HeartFilledIcon, ReloadIcon } from '@radix-ui/react-icons';

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const characterId = parseInt(id || '0', 10);
  const favorited = character ? isFavorite(character.id) : false;
  
  // Fetch character data
  const fetchCharacter = useCallback(async () => {
    if (!characterId) {
      setError(new Error('Invalid character ID'));
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchCharacterById(characterId);
      setCharacter(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [characterId]);
  
  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive':
        return 'bg-green-500';
      case 'Dead':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center mb-8">
          <Skeleton className="h-10 w-24 mr-4" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/2" />
            <div className="pt-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full mt-2" />
              <Skeleton className="h-6 w-2/3 mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !character) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Character Details</h1>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Character not found</h2>
            <p className="text-muted-foreground mb-6">
              {error?.message || 'The character you are looking for does not exist or has been removed.'}
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Home
              </Button>
              <Button onClick={fetchCharacter}>
                <ReloadIcon className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Character Details</h1>
        </div>
        <Button
          variant={favorited ? "default" : "outline"}
          onClick={() => toggleFavorite(character)}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className={favorited ? "bg-red-500 hover:bg-red-600" : ""}
        >
          {favorited ? (
            <>
              <HeartFilledIcon className="mr-2 h-4 w-4" />
              Favorited
            </>
          ) : (
            <>
              <HeartIcon className="mr-2 h-4 w-4" />
              Add to Favorites
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src={character.image}
            alt={character.name}
            className="w-full rounded-lg shadow-lg"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              <span className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(character.status)}`} />
              {character.status}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{character.name}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant="secondary">{character.species}</Badge>
              {character.type && <Badge variant="outline">{character.type}</Badge>}
              <Badge>{character.gender}</Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Origin</h3>
              <p className="text-muted-foreground">{character.origin.name}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Last known location</h3>
              <p className="text-muted-foreground">{character.location.name}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">First seen in</h3>
              {character.episode.length > 0 ? (
                <p className="text-muted-foreground">Episode #{character.episode[0].split('/').pop()}</p>
              ) : (
                <p className="text-muted-foreground">Unknown</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Total episodes</h3>
              <p className="text-muted-foreground">{character.episode.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Episodes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {character.episode.map((episodeUrl) => {
            const episodeNumber = episodeUrl.split('/').pop();
            return (
              <Badge key={episodeUrl} variant="outline" className="py-2 px-3 justify-center">
                Ep. {episodeNumber}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}