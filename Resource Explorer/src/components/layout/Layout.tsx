import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 bg-background">
        <div className="container flex flex-col items-center justify-center gap-2 text-center text-sm">
          <p className="text-muted-foreground">
            Data provided by the <a href="https://rickandmortyapi.com/" className="underline underline-offset-4 hover:text-primary" target="_blank" rel="noopener noreferrer">Rick and Morty API</a>
          </p>
          <p className="text-muted-foreground">
            Built with React, TypeScript, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}