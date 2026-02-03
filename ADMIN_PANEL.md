# RENTLY Admin Panel

## Overview
The RENTLY Admin Panel is a comprehensive management dashboard that allows administrators to monitor and control the car rental platform. It provides real-time insights into fleet status, bookings, and revenue.

## Access Credentials
- **Email:** justme13680@gmail.com
- **Password:** Aditya1234

## Accessing the Admin Panel

### Method 1: Direct URL
Navigate directly to the admin sign-in screen by using the route `/admin-sign-in`

### Method 2: Long Press (Hidden Access)
On the onboarding/welcome screen, **long-press (2 seconds)** on the "RENTLY PRO" logo in the top-left corner to access the admin sign-in page.

## Features

### 1. Dashboard (`/admin/dashboard`)
The main admin dashboard provides:
- **Statistics Cards:**
  - Total Cars (with available count)
  - Total Bookings (with active count)
  - Upcoming Bookings
  - Total Revenue
  
- **Quick Actions:**
  - Manage Cars
  - Manage Bookings
  - View Analytics

### 2. Manage Cars (`/admin/cars`)
Comprehensive car fleet management:
- **View all vehicles** in the fleet
- **Search functionality** to find specific cars by brand or model
- **Status toggle** - Switch between 'available' and 'rented'
- **Delete cars** from the fleet
- **Real-time updates** with pull-to-refresh

Each car card displays:
- Car image
- Brand and model
- Current status (Available/Rented)
- Rating
- Number of seats
- Transmission type
- Price per day

### 3. Manage Bookings (`/admin/bookings`)
Complete booking oversight:
- **View all bookings** across the platform
- **Filter by status:**
  - All
  - Active
  - Upcoming
  - Completed
  - Cancelled
  
- **Update booking status** - Change any booking to active, upcoming, completed, or cancelled
- **Detailed booking information:**
  - Car details with image
  - User ID
  - Start and end dates
  - Pickup and drop-off locations
  - Total price
  - Current status

### 4. Analytics (`/admin/analytics`)
Business insights and metrics:
- **Key Metrics:**
  - Fleet utilization rate (percentage of cars in use)
  - Average revenue per booking
  
- **Revenue Overview:**
  - Total revenue
  - Active rentals count
  - Upcoming rentals count
  
- **Fleet Status:**
  - Available cars
  - Cars in use
  - Total fleet size
  
- **Recent Activity:**
  - Latest 5 bookings with details

## Database Setup

### Running the SQL Setup
1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL file: `admin_setup.sql`

This will create:
- `admin_users` table for admin authentication
- Default admin user with the specified credentials
- `admin_dashboard_stats` view for aggregated statistics
- Necessary indexes and Row Level Security policies

## Technical Implementation

### Services
- **adminService.ts** - Core admin functionality including:
  - Admin authentication
  - Dashboard statistics fetching
  - Car management (update status, delete)
  - Booking management (fetch all, update status)

### Screens
- **admin-sign-in.tsx** - Secure admin login with premium design
- **admin/dashboard.tsx** - Main admin dashboard
- **admin/cars.tsx** - Car fleet management
- **admin/bookings.tsx** - Booking management
- **admin/analytics.tsx** - Business analytics

### Navigation
All admin routes are registered in `app/_layout.tsx`:
- `/admin-sign-in`
- `/admin/dashboard`
- `/admin/cars`
- `/admin/bookings`
- `/admin/analytics`

## Security Features
- Session-based authentication using AsyncStorage
- Protected routes - redirects to sign-in if not authenticated
- Hardcoded credentials for demo (should use proper authentication in production)
- Row Level Security enabled on database tables

## Design
The admin panel features a premium, cyber-inspired design:
- **Color Scheme:**
  - Primary: Acid Green (#00FF00)
  - Background: Pure Black (#000)
  - Cards: Dark Gray (#1C1C1E)
  - Borders: Subtle Gray (#27272A)
  
- **Typography:**
  - Inter font family (400-900 weights)
  - Bold, uppercase labels
  - High contrast for readability

## Usage Tips
1. **Pull to refresh** on any screen to get the latest data
2. **Long-press** the brand logo for quick admin access
3. **Filter bookings** by status for easier management
4. **Search cars** by brand or model name
5. **Monitor analytics** regularly for business insights

## Future Enhancements
- Add new cars directly from the admin panel
- Edit car details (price, status, etc.)
- User management section
- Advanced analytics with charts and graphs
- Export reports (CSV, PDF)
- Push notifications for new bookings
- Real-time updates using Supabase subscriptions

## Support
For any issues or questions regarding the admin panel, please contact the development team.

---

**Last Updated:** February 2026  
**Version:** 1.0.0
