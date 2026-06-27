# Requirements Document

## Introduction

This document outlines the requirements for implementing a Services Dropdown Menu feature in the navbar. The feature will allow users to view available services in a dropdown menu and navigate to detailed service pages.

## Glossary

- **Navbar**: The navigation bar component at the top of the website
- **Services Dropdown**: A dropdown menu that appears when hovering/clicking the Services link
- **Service Card**: An individual service item displayed in the dropdown menu
- **Service Detail Page**: A dedicated page showing complete information about a specific service

## Requirements

### Requirement 1

**User Story:** As a visitor, I want to see a dropdown menu when I hover over or click the Services link in the navbar, so that I can quickly browse available services without navigating away from the current page.

#### Acceptance Criteria

1. WHEN a user hovers over the Services link in the navbar THEN the system SHALL display a dropdown menu containing all available services
2. WHEN a user clicks the Services link on mobile THEN the system SHALL toggle the dropdown menu visibility
3. WHEN the dropdown menu is displayed THEN the system SHALL show service cards with title and brief description
4. WHEN a user moves the mouse away from the dropdown THEN the system SHALL close the dropdown after a short delay
5. WHEN a user clicks outside the dropdown THEN the system SHALL close the dropdown immediately

### Requirement 2

**User Story:** As a visitor, I want to see service information organized in cards within the dropdown, so that I can quickly scan and understand what services are offered.

#### Acceptance Criteria

1. WHEN the dropdown displays services THEN the system SHALL show each service with a title and subtitle/description
2. WHEN displaying service cards THEN the system SHALL use consistent styling with dark background and white text
3. WHEN a user hovers over a service card THEN the system SHALL provide visual feedback (highlight or color change)
4. WHEN services are displayed THEN the system SHALL show them in a grid layout (2-3 columns on desktop)
5. WHEN on mobile THEN the system SHALL display services in a single column layout

### Requirement 3

**User Story:** As a visitor, I want to click on a service card to view detailed information, so that I can learn more about specific services before making a decision.

#### Acceptance Criteria

1. WHEN a user clicks on a service card THEN the system SHALL navigate to the service detail page
2. WHEN navigating to a service detail page THEN the system SHALL display comprehensive service information
3. WHEN on a service detail page THEN the system SHALL show service title, description, pricing, process steps, and available packages
4. WHEN on a service detail page THEN the system SHALL provide a "Consult Now" button for user engagement
5. WHEN on a service detail page THEN the system SHALL include a "View Other Services" link to return to the services overview

### Requirement 4

**User Story:** As a visitor, I want the dropdown menu to work seamlessly in both English and Indonesian, so that I can view services in my preferred language.

#### Acceptance Criteria

1. WHEN the language is changed THEN the system SHALL update all service titles and descriptions in the dropdown
2. WHEN displaying service details THEN the system SHALL show content in the currently selected language
3. WHEN switching languages THEN the system SHALL maintain the current page/service being viewed
4. WHEN translations are missing THEN the system SHALL fall back to English content
5. WHEN service data is loaded THEN the system SHALL use the language context to determine which content to display

### Requirement 5

**User Story:** As a visitor, I want the services dropdown to include a "View All Services" link, so that I can navigate to a comprehensive services page if needed.

#### Acceptance Criteria

1. WHEN the dropdown menu is displayed THEN the system SHALL show a "View All Services" link at the bottom
2. WHEN a user clicks "View All Services" THEN the system SHALL navigate to the main services page
3. WHEN on the main services page THEN the system SHALL display all services in a grid layout
4. WHEN on the main services page THEN the system SHALL allow filtering or searching services
5. WHEN navigating from dropdown to services page THEN the system SHALL close the dropdown menu

### Requirement 6

**User Story:** As a developer, I want service data to be managed centrally, so that adding or updating services is easy and consistent across the application.

#### Acceptance Criteria

1. WHEN services are defined THEN the system SHALL store them in a centralized data structure
2. WHEN service data is updated THEN the system SHALL reflect changes in both dropdown and detail pages
3. WHEN adding a new service THEN the system SHALL automatically include it in the dropdown menu
4. WHEN service data includes translations THEN the system SHALL support both English and Indonesian content
5. WHEN services are loaded THEN the system SHALL validate required fields (title, description, slug)

## Service Data Structure

Each service should include:
- **id**: Unique identifier
- **slug**: URL-friendly identifier for routing
- **title**: Service name (EN/ID)
- **subtitle**: Brief description (EN/ID)
- **description**: Detailed description (EN/ID)
- **price**: Starting price
- **features**: List of key features
- **process**: Steps involved in the service
- **packages**: Available service packages
- **icon**: Optional icon or image

## Example Services

1. **Company Profile Website**
   - Professional appearance for your business
   - Starting from Rp 15 juta

2. **E-Commerce Website**
   - E-commerce solution for online sales
   - Starting from Rp 25 juta

3. **Custom Website & System**
   - Custom solution for business needs
   - Starting from Rp 30 juta

4. **Mobile Application**
   - Android & iOS apps for your business
   - Starting from Rp 40 juta

5. **Landing Page**
   - Special page for marketing campaigns
   - Starting from Rp 5 juta

6. **News Portal Website**
   - News platform with complete CMS
   - Starting from Rp 20 juta
