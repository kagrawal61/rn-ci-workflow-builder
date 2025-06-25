# React Native CI/CD Web Builder

A modern web interface for the rn-ci-workflow-builder library, allowing users to visually create GitHub Actions workflows for React Native projects.

## Setup Instructions

### Prerequisites

- Node.js 18 or newer
- Yarn or npm

### Installation

1. Navigate to the app directory:

```bash
cd app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `app/` - Next.js app router structure
- `components/` - React components
  - `ui/` - Base UI components from Shadcn UI
  - `*.tsx` - Application-specific components
- `providers/` - React context providers
- `utils/` - Utility functions and services
  - `workflow-service.ts` - Integration with rn-ci-workflow-builder library

## Key Features

- Modern UI with animations using Framer Motion
- Real-time YAML preview with syntax highlighting
- Form-based workflow configuration
- Integration with local rn-ci-workflow-builder library
- Dark/light mode support

## Known Issues

- TypeScript errors are present due to missing type definitions
- This is an initial implementation that will need refinement

## Next Steps

1. Resolve TypeScript errors by adding proper type definitions
2. Create missing dependencies or install them properly
3. Implement proper error handling for the form validation
4. Add unit tests for components and services
5. Improve the integration with the core library