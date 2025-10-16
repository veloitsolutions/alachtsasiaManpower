# Intralink Admin Panel

This is the admin panel for the Intralink website, built with React and TypeScript.

## Features

- Secure admin authentication
- Dashboard with overview statistics
- Gallery management (upload/delete images and videos)
- Client logo management
- Contact form submissions management

## Pages

### Admin Login
- Path: `/admin/login`
- Allows administrators to log in with email and password
- Stores authentication token in local storage

### Admin Dashboard
- Path: `/admin`
- Displays overview statistics
- Protected route (requires admin authentication)

### Gallery Management
- Path: `/admin/gallery`
- Upload new images and videos
- Delete existing gallery items
- Protected route (requires admin authentication)

### Client Logo Management
- Path: `/admin/clients`
- Upload new client logos
- Delete existing client logos
- Protected route (requires admin authentication)

### Contact Submissions
- Path: `/admin/contacts`
- View contact form submissions
- Mark submissions as read
- Delete submissions
- Protected route (requires admin authentication)

## Components

- `AdminSidebar`: Navigation sidebar for the admin panel
- `AdminRoute`: Protected route component that redirects to login if not authenticated

## Styling

- Uses CSS modules for component-specific styling
- Follows the main website's color scheme and design language

## Authentication

- JWT-based authentication
- Token stored in local storage
- Protected routes redirect to login if not authenticated
