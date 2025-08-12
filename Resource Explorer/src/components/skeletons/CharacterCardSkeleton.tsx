import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CharacterCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-square relative overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}