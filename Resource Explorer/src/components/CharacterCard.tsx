import { Character } from '@/types/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons';
import { useFavorites } from '@/hooks/use-favorites';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(character.id);

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

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
          loading="lazy"
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/95"
          onClick={(e) => {
            e.preventDefault(); // Prevent triggering Link
            toggleFavorite(character);
          }}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          {favorited ? (
            <HeartFilledIcon className="h-4 w-4 text-red-500" />
          ) : (
            <HeartIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className={`h-2 w-2 rounded-full ${getStatusColor(character.status)}`} />
          <Badge variant="outline">{character.status}</Badge>
        </div>
        <h3 className="font-bold text-lg truncate">{character.name}</h3>
        <p className="text-muted-foreground text-sm">{character.species}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/character/${character.id}`} className="w-full">
          <Button variant="secondary" className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}