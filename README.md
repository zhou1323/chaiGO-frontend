# ChaiGO Frontend

A web application built with Next.js and TypeScript for managing ChaiGO services. The frontend is optimized for performance, developer productivity, and ease of deployment using Docker and GitHub Actions.

## Technology Stack

- **React(Next.js) & TypeScript**: Scalable, maintainable, and strongly-typed for robustness.
- **Material UI Components**: Reusable UI components.
- **Tailwind CSS**: Efficient styling with utility-first CSS.
- **Zustand**: Toolkit for state management.
- **Playwright**: Robust testing framework for End-to-End testing.
- **Sentry**: Robust error handling and monitoring.
- **ESLint/Prettier**: Code style enforcement.
- **Docker**: Simplifies deployment and consistency across environments.
- **GitHub Actions**: Integrations with GitHub Actions for automated testing and deployments.

## Design files

Figma is used to create the design of the application. [Here](https://www.figma.com/design/GeZxtUnTDjQyR3V4rTd5EW/ChaiGO-pages?node-id=0-1&t=cMFcwynIqNB3sNOL-1) is the link to the design.

## Project wikis

[Here](https://midnight-scarf-544.notion.site/ChaiGo-Development-Wiki-5b29040746e74457a3afe218f0c634e5?pvs=4) is the link to the project wiki.

## Project Structure

```bash
.
├── Dockerfile             # Docker configuration
├── next.config.mjs         # Next.js settings
├── public/                # Static files
├── src/                   # Application source code
│   ├── app/              # Next.js app router
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Library code
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   ├── paths.ts          # Paths for the app
```

## Configuration

- Create a `.env` file in the root directory and set the following environment variables:
  - `NEXT_PUBLIC_BASE_URL`: The base URL of the backend API.
  - `NEXT_PUBLIC_SENTRY_DSN`: The Sentry DSN for error monitoring.
  - `SENTRY_AUTH_TOKEN`: The Sentry authentication token.
  - `SENTRY_ORG`: The Sentry organization.
  - `SENTRY_PROJECT`: The Sentry project.

## How to run

- Install dependencies: `npm install`
- Run the development server: `npm run dev`
- Then open http://localhost:3000 in your browser
