# DOCX to PDF Converter

## Overview

A full-stack web application for converting DOCX files to PDF format. The application provides a modern drag-and-drop interface for file uploads, real-time conversion progress tracking, and comprehensive file management capabilities. Built with React frontend, Express.js backend, and integrates with AWS services for file storage and serverless document processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Tailwind CSS** for styling with shadcn/ui component library
- **React Router** via Wouter for client-side routing
- **TanStack Query** for server state management and data fetching
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with endpoints for file upload, conversion tracking, and statistics
- **In-memory storage** implementation with abstract storage interface for future database integration
- **Multer** middleware for handling multipart file uploads with validation
- **ESBuild** for production builds

### Database Design
- **Drizzle ORM** configured for PostgreSQL with Neon database
- **Users table** for authentication (username/password)
- **Conversions table** tracking file metadata, conversion status, progress, and S3 storage keys
- Migration system using Drizzle Kit

### File Storage and Processing
- **AWS S3** for storing uploaded DOCX files and converted PDF files
- **AWS Lambda** for serverless document conversion processing
- **Presigned URLs** for secure file downloads
- **File validation** restricting uploads to DOCX format with 10MB size limit

### Authentication and Security
- Session-based authentication architecture prepared (schema defined)
- File type validation and size limits
- CORS configuration for cross-origin requests
- Input sanitization and validation using Zod schemas

### State Management
- **TanStack Query** for server state caching and synchronization
- **Real-time polling** every 2 seconds for conversion status updates
- **Optimistic updates** with automatic cache invalidation
- Toast notifications for user feedback

### UI/UX Design
- **Responsive design** using Tailwind CSS breakpoints
- **Drag-and-drop file upload** with visual feedback
- **Real-time progress indicators** for file conversion status
- **Statistics dashboard** showing total uploads, conversions, and processing times
- **Dark/light theme support** via CSS custom properties

## External Dependencies

### AWS Services
- **S3 Client** (@aws-sdk/client-s3) - File storage and retrieval
- **Lambda Client** (@aws-sdk/client-lambda) - Serverless function invocation for document processing
- **S3 Request Presigner** (@aws-sdk/s3-request-presigner) - Secure download URLs

### Database
- **Neon Database** (@neondatabase/serverless) - Serverless PostgreSQL database
- **Drizzle ORM** - Type-safe database queries and migrations
- **PostgreSQL** as the underlying database engine

### UI Components
- **Radix UI** primitives for accessible component foundation
- **Lucide React** for consistent iconography
- **shadcn/ui** component system built on Radix UI and Tailwind

### Development Tools
- **Vite** with React plugin for fast development and hot reload
- **TypeScript** for type safety across frontend and backend
- **ESBuild** for efficient production bundling
- **Replit integration** with runtime error overlay and cartographer plugin