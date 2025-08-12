# Rick & Morty Resource Explorer

A modern React application for exploring characters from the Rick & Morty universe with features like searching, filtering, sorting, and saving favorites.

## How to Run

### Prerequisites
- Node.js 16.x or higher
- pnpm (recommended) or npm

### Development
1. Install dependencies:
```bash
pnpm install
# or
npm install
```

2. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Production Build
1. Build the project:
```bash
pnpm build
# or
npm run build
```

2. Preview the production build locally (optional):
```bash
pnpm preview
# or
npm run preview
```

## Architecture Overview

### Tech Stack
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **State Management**: React hooks + URL state synchronization
- **Data Fetching**: Fetch API with AbortController for cancellation
- **Routing**: React Router v6

### Project Structure
```
src/
├── components/        # UI components
│   ├── layout/        # Layout components (Header, Layout)
│   ├── skeletons/     # Loading placeholder components
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and API handlers
├── pages/             # Page components
└── types/             # TypeScript type definitions
```

### Key Features
1. **Character Search and Filtering**:
   - Real-time search with debouncing
   - Multiple filter options (status, gender, species)
   - Sorting by character attributes

2. **Favorites System**:
   - Local storage persistence
   - Toggle favorites from both list and detail views

3. **URL State Synchronization**:
   - All search and filter parameters stored in URL
   - Shareable links with preserved state

4. **Responsive UI**:
   - Mobile-first design approach
   - Theme switching (light/dark mode)

5. **Error Handling and Loading States**:
   - Skeleton loaders during data fetching
   - Proper error handling and user feedback

## Design Decisions and Trade-offs

### State Management
- **Decision**: Used React's built-in hooks rather than a state management library
- **Trade-off**: Simplifies the codebase for this size of application but might require refactoring if the application grows significantly
- **Benefit**: Lower bundle size and fewer dependencies

### URL-based State
- **Decision**: Store filter, sort, and pagination state in the URL
- **Trade-off**: More complex initial implementation but provides better user experience
- **Benefit**: Shareable links and browser history navigation

### API Integration
- **Decision**: Direct API calls with fetch instead of a query library like React Query
- **Trade-off**: Less automated caching and refetching but simpler implementation
- **Benefit**: Smaller bundle size for this focused application

### Local Storage for Favorites
- **Decision**: Store favorites in localStorage instead of a backend
- **Trade-off**: Data is device-specific but doesn't require user accounts
- **Benefit**: Zero-friction user experience with immediate feedback

## Future Enhancements

If development were to continue, the following features would be prioritized:

1. **Virtualized Lists**:
   - Implement virtualization for the character grid to improve performance when displaying large datasets

2. **Comprehensive Testing**:
   - Add unit tests for components and hooks
   - Add integration tests for key user flows

3. **Notes Feature**:
   - Allow users to add and save personal notes about favorite characters

4. **Offline Support**:
   - Implement service workers for offline functionality
   - Cache API responses for improved performance

5. **Advanced Filtering**:
   - Add more advanced filtering options
   - Implement combination filters (e.g., female AND alive characters)

6. **User Accounts**:
   - Add authentication to allow cross-device access to favorites
   - Enable social features like sharing character collections

## Performance Considerations

- The application uses code splitting to reduce initial load time
- Images are lazy-loaded to improve performance
- API requests are debounced to prevent excessive calls during typing
- Request cancellation prevents race conditions when rapidly changing filters

## Accessibility

- The application follows WCAG guidelines for accessibility
- All interactive elements are keyboard navigable
- Proper ARIA attributes are used throughout the application
- Color contrast ratios meet accessibility standards
