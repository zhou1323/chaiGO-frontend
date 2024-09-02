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

Figma is used to create the design of the application. [Here](https://www.figma.com/design/Yb1g9RlYwV8o2kN8g5Q59U/ChaiGO-Frontend?node-id=0%3A1&t=Z8Z8Z8Z8Z8Z8Z8Z8Z8) is the link to the design.

## Project wikis

[Here](https://chai-go.notion.site/ChaiGO-Frontend-944924824444444444444444444) is the link to the project wiki.

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
