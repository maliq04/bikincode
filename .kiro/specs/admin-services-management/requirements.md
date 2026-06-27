# Requirements Document - Admin Services Management

## Introduction

This document outlines the requirements for implementing a Services Management feature in the admin panel. This feature will allow administrators to create, read, update, and delete (CRUD) services that appear in the services dropdown and detail pages.

## Glossary

- **Admin Panel**: The administrative interface for managing website content
- **Service**: A business offering that can be displayed on the website
- **CRUD**: Create, Read, Update, Delete operations
- **Firebase Realtime Database**: The database system used for storing service data
- **Service Card**: Visual representation of a service in the dropdown menu
- **Service Detail Page**: Full page showing complete service information

## Requirements

### Requirement 1

**User Story:** As an administrator, I want to view a list of all services in the admin panel, so that I can see what services are currently available on the website.

#### Acceptance Criteria

1. WHEN an administrator navigates to the Services section THEN the system SHALL display a list of all services
2. WHEN displaying services THEN the system SHALL show service title, subtitle, price, and status
3. WHEN the services list is empty THEN the system SHALL display a message indicating no services exist
4. WHEN services are loaded THEN the system SHALL show a loading indicator
5. WHEN there is an error loading services THEN the system SHALL display an error message

### Requirement 2

**User Story:** As an administrator, I want to create a new service, so that I can add new offerings to the website.

#### Acceptance Criteria

1. WHEN an administrator clicks "Add New Service" THEN the system SHALL display a service creation form
2. WHEN creating a service THEN the system SHALL require title in both English and Indonesian
3. WHEN creating a service THEN the system SHALL require subtitle, description, and price in both languages
4. WHEN creating a service THEN the system SHALL auto-generate a URL slug from the English title
5. WHEN a service is successfully created THEN the system SHALL save it to Firebase and display a success message

### Requirement 3

**User Story:** As an administrator, I want to edit an existing service, so that I can update service information when needed.

#### Acceptance Criteria

1. WHEN an administrator clicks "Edit" on a service THEN the system SHALL display a form pre-filled with current service data
2. WHEN editing a service THEN the system SHALL allow modification of all service fields
3. WHEN saving edits THEN the system SHALL validate all required fields
4. WHEN a service is successfully updated THEN the system SHALL save changes to Firebase and display a success message
5. WHEN editing is cancelled THEN the system SHALL discard changes and return to the services list

### Requirement 4

**User Story:** As an administrator, I want to delete a service, so that I can remove services that are no longer offered.

#### Acceptance Criteria

1. WHEN an administrator clicks "Delete" on a service THEN the system SHALL display a confirmation dialog
2. WHEN deletion is confirmed THEN the system SHALL remove the service from Firebase
3. WHEN a service is successfully deleted THEN the system SHALL update the services list and display a success message
4. WHEN deletion is cancelled THEN the system SHALL keep the service and close the dialog
5. WHEN a service is deleted THEN the system SHALL remove it from the dropdown menu immediately

### Requirement 5

**User Story:** As an administrator, I want to upload images for services, so that service detail pages can display relevant visuals.

#### Acceptance Criteria

1. WHEN creating or editing a service THEN the system SHALL provide an image upload field
2. WHEN an image is uploaded THEN the system SHALL store it in the uploads directory
3. WHEN an image is uploaded THEN the system SHALL save the image URL to the service data
4. WHEN displaying a service THEN the system SHALL show the uploaded image on the detail page
5. WHEN no image is uploaded THEN the system SHALL display a placeholder image

### Requirement 6

**User Story:** As an administrator, I want to manage service features, process steps, and packages, so that I can provide detailed information about each service.

#### Acceptance Criteria

1. WHEN creating or editing a service THEN the system SHALL provide fields for features, process steps, and packages
2. WHEN adding features THEN the system SHALL allow multiple features in both English and Indonesian
3. WHEN adding process steps THEN the system SHALL allow multiple steps in both languages
4. WHEN adding packages THEN the system SHALL allow multiple package options in both languages
5. WHEN saving THEN the system SHALL store all arrays properly in Firebase

### Requirement 7

**User Story:** As an administrator, I want services to be stored in Firebase Realtime Database, so that they persist across sessions and are accessible to the frontend.

#### Acceptance Criteria

1. WHEN a service is created THEN the system SHALL store it in Firebase under `/services/{serviceId}`
2. WHEN services are loaded THEN the system SHALL fetch them from Firebase Realtime Database
3. WHEN a service is updated THEN the system SHALL update the corresponding Firebase entry
4. WHEN a service is deleted THEN the system SHALL remove it from Firebase
5. WHEN Firebase operations fail THEN the system SHALL display appropriate error messages

### Requirement 8

**User Story:** As a website visitor, I want to see dynamically managed services in the dropdown and detail pages, so that I always see up-to-date service information.

#### Acceptance Criteria

1. WHEN services are loaded in the navbar dropdown THEN the system SHALL fetch them from Firebase
2. WHEN a service detail page is accessed THEN the system SHALL fetch the service data from Firebase
3. WHEN a service is added in admin THEN the system SHALL appear in the dropdown immediately after refresh
4. WHEN a service is deleted in admin THEN the system SHALL remove it from the dropdown after refresh
5. WHEN service data is updated THEN the system SHALL reflect changes on the frontend after refresh

## Service Data Structure

Each service in Firebase should include:
- **id**: Unique identifier (auto-generated)
- **slug**: URL-friendly identifier
- **title**: { en: string, id: string }
- **subtitle**: { en: string, id: string }
- **description**: { en: string, id: string }
- **price**: { en: string, id: string }
- **image**: string (URL to uploaded image)
- **features**: { en: string[], id: string[] }
- **process**: { en: string[], id: string[] }
- **packages**: { en: string[], id: string[] }
- **createdAt**: timestamp
- **updatedAt**: timestamp
- **status**: 'active' | 'inactive'

## Admin Panel Integration

The Services management should be accessible from:
- Admin sidebar with "Services" menu item
- Route: `/admin/services`
- Icon: Briefcase or similar service-related icon
