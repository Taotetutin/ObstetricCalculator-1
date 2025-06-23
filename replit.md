# Overview

ObsteriX Legend is a comprehensive bilingual (Spanish/English) medical web application focused on obstetrics, providing medical calculators, educational content, and resources for healthcare professionals. The application features gestational calculations, medication risk assessment with complete FDA database integration, interactive drug interaction analysis, and educational tools, with critical emphasis on accurate FDA pregnancy safety classifications, mobile-optimized interfaces, and universal access to ALL FDA-classified medications.

# System Architecture

## Frontend Architecture
- **React + TypeScript**: Modern client-side application using React 18 with TypeScript for type safety
- **Vite**: Fast build tool and development server for optimal development experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **ShadCN UI Components**: Pre-built, accessible UI components based on Radix UI
- **Framer Motion**: Animation library for enhanced user interactions
- **TanStack Query**: Data fetching and state management for API interactions

## Backend Architecture
- **Node.js + Express**: RESTful API server built with Express.js
- **TypeScript**: Full type safety across the backend
- **Authentication**: Passport.js with local and Google OAuth strategies
- **Session Management**: Express sessions with PostgreSQL store

## Database Layer
- **PostgreSQL**: Primary database for data persistence
- **Drizzle ORM**: Type-safe database operations and migrations
- **Neon Serverless**: PostgreSQL hosting solution with connection pooling

# Recent Changes

## December 2024 - Complete FDA Database Integration
- **FDA API Integration**: Direct access to complete FDA medication database (thousands of medications)
- **Spanish-English Translation Mapping**: Automatic translation for 100+ common medications (naproxeno→naproxen, losartán→losartan, etc.)
- **Hybrid Data Sources**: FDA Official → Local Curated Database → AI Analysis priority system
- **Medical-Grade Accuracy**: Eliminated systematic FDA classification errors through verified official sources
- **User Requirement Met**: Complete access to FDA database, not limited to "a few medications"

# Key Components

## Medical Calculators
1. **FPP Calculator**: Due date calculation based on last menstrual period
2. **BMI Calculator**: Body mass index calculation for pregnancy
3. **Gestational Age Calculator**: Accurate pregnancy dating using ultrasound measurements
4. **Amniotic Fluid Calculator**: Assessment of amniotic fluid levels
5. **Fetal Weight Calculator**: Estimated fetal weight using biometric measurements
6. **Growth Curve Calculator**: Fetal growth percentile assessment
7. **Preeclampsia Risk Calculator**: Comprehensive risk assessment using multiple factors
8. **Medication Safety Evaluator with Complete FDA Integration**: Real-time access to complete FDA database with Spanish-English translation mapping for all approved medications
9. **MEFI Classification**: Electronic fetal monitoring classification system
10. **Premature Birth Risk Calculator**: Risk assessment for preterm delivery

## Authentication System
- User registration and login functionality
- Google OAuth integration
- Session-based authentication with secure password hashing using scrypt
- Role-based access control (user/admin roles)

## Data Management
- Patient record management
- Calculation history tracking
- Comparison tools for longitudinal monitoring
- Export capabilities for clinical documentation

# Data Flow

## Client-Side Flow
1. User interacts with calculator forms
2. Form validation using Zod schemas
3. Data submitted to backend API endpoints
4. Results displayed with visualizations and recommendations
5. Optional saving to patient records

## Server-Side Flow
1. API receives calculation requests
2. Input validation using shared schemas
3. Mathematical computations using medical algorithms
4. Database operations for persistence
5. Structured response with clinical recommendations

## External Integrations
- FDA medication database queries
- Real-time drug interaction checking
- Comprehensive medication safety database

# External Dependencies

## Frontend Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- UI libraries (Radix UI components, Lucide React icons)
- Development tools (Vite, TypeScript, Tailwind CSS)
- Animation and visualization (Framer Motion)

## Backend Dependencies
- Express.js and middleware
- Authentication (Passport.js, bcryptjs)
- Database (Drizzle ORM, Neon serverless PostgreSQL)
- External APIs (Axios for HTTP requests)
- Development tools (tsx for TypeScript execution)

## Third-Party Services
- Neon Database (PostgreSQL hosting)
- Google OAuth (authentication)
- FDA API (medication data)

# Deployment Strategy

## Development Environment
- Replit-based development with hot reloading
- Local PostgreSQL database connection
- Environment variables for sensitive configuration

## Production Deployment
- Google Cloud Run as deployment target
- Build process using Vite for frontend and esbuild for backend
- PostgreSQL database with connection pooling
- Secure session management with proper cookie settings

## Build Configuration
- Frontend: Vite build generates optimized static assets
- Backend: esbuild bundles server code for production
- Shared schemas ensure type consistency between client and server

# Changelog

- June 22, 2025. Initial setup

# User Preferences

Preferred communication style: Simple, everyday language.