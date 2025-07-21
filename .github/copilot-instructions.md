<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions for React + Vite + TailwindCSS Project

This is a modern React project built with Vite as the build tool and TailwindCSS for styling.

## Project Setup
- **Build Tool**: Vite for fast development and optimized builds
- **Framework**: React with JSX
- **Styling**: TailwindCSS utility-first CSS framework
- **Package Manager**: npm

## Development Guidelines
- Use TailwindCSS classes for all styling instead of custom CSS
- Follow React best practices for component structure
- Utilize Vite's fast HMR (Hot Module Replacement) for development
- Use responsive design principles with TailwindCSS breakpoints
- Prefer functional components with hooks over class components

## File Structure
- Components should be placed in `src/components/`
- Styles are handled through TailwindCSS classes
- Static assets go in the `public/` directory
- Source files are in the `src/` directory

## Styling Conventions
- Use TailwindCSS utility classes for styling
- Implement dark mode support using `dark:` variants
- Use semantic color names (e.g., `bg-blue-500` instead of custom colors)
- Leverage TailwindCSS responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
