# Contributing to rn-ci-workflow-builder

Thank you for considering contributing to rn-ci-workflow-builder! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Environment information (OS, Node.js version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please create an issue with:
- A clear, descriptive title
- Detailed description of the proposed feature
- Any relevant examples or mock-ups
- Explanation of why this feature would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/kagrawal61/rn-ci-workflow-builder.git
cd rn-ci-workflow-builder

# Install dependencies
npm install
# or
yarn install

# Build the project
npm run build
# or
yarn build
```

## Project Structure

The project consists of two main components:

### CLI Tool (Root Directory)

The CLI tool is built with TypeScript and is located in the root directory. It provides command-line functionality for generating workflow files.

```
src/
├── cli.ts              # Command-line interface
├── generator.ts        # Main workflow generator
├── helpers.ts          # Utility functions
├── types.ts            # TypeScript type definitions
├── helpers/            # Helper modules
├── presets/            # Workflow preset configurations
└── validation/         # Schema validation
```

### Web App (`app` Directory)

The web application provides a UI for configuring and generating workflows. It's built with Next.js and React.

```
app/
├── app/                # Next.js app router pages
├── components/         # React components
│   ├── ui/             # UI components (buttons, inputs, etc.)
│   └── workflow-*.tsx  # Workflow-specific components
├── public/             # Static assets
└── styles/             # CSS and styling
```

## Development Commands

### CLI Development

```bash
# Run in development mode (generates static-analysis workflow)
npm run dev
# or
yarn dev

# Generate workflow using static-analysis preset
npm run generate:health
# or
yarn generate:health

# Generate workflow using build preset
npm run generate:build
# or
yarn generate:build

# Run tests
npm test
# or
yarn test

# Linting
npm run lint
# or
yarn lint
```

### Web App Development

```bash
# Change to the app directory
cd app

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build

# Linting
npm run lint
# or
yarn lint

# Format code
npm run format
# or
yarn format
```

## Contributing to the CLI

When contributing to the CLI:

1. Ensure your code follows TypeScript best practices
2. Update types in `src/types.ts` for any new features
3. Add tests for new functionality
4. Create or update appropriate presets in `src/presets/`
5. Document any new configuration options
6. Update CLI command documentation if necessary

### Adding New Workflow Presets

To add a new workflow preset:

1. Create a new file in `src/presets/` (e.g., `myCustomPreset.ts`)
2. Implement the builder function for your preset
3. Register your preset in `src/presets/index.ts`
4. Add appropriate validation in `src/validation/`
5. Create sample configurations in `samples/`

## Contributing to the Web App

When contributing to the web application:

1. Follow React/Next.js best practices
2. Use the existing component structure in `app/components/`
3. Maintain consistency with the UI design system
4. Test your changes across different browsers and devices
5. Ensure accessibility standards are met
6. Update documentation for any new features

### UI Component Guidelines

1. Use the existing UI components in `app/components/ui/`
2. Follow the established styling patterns using Tailwind CSS
3. Maintain responsive design principles
4. Ensure proper state management for form inputs

## Code Style

We use ESLint and Prettier to maintain code quality. Please ensure your code:
- Passes the linter check (`npm run lint`)
- Follows the TypeScript style guidelines
- Includes appropriate comments
- Includes tests for new functionality

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).