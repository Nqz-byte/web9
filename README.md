# Open Tickets — Website Redesign

## Project Overview

Open Tickets is a ticketing website redesign project focused on creating a modern, professional, responsive, and user-friendly interface.

The project aims to improve the website's visual presentation and usability while preserving the existing structure and functionality. The interface uses a clean layout, consistent typography, clear navigation, and responsive components to provide a better experience across desktop, tablet, and mobile devices.

The current development focuses on the frontend implementation using HTML, CSS, Bootstrap, and vanilla JavaScript.

## Project Objectives

- Redesign the website with a modern and professional visual identity.
- Create responsive layouts for different screen sizes.
- Improve navigation and content readability.
- Provide interactive components using JavaScript.
- Maintain consistency across the website's pages.
- Preserve existing functionality wherever possible.
- Prepare the frontend for future backend or third-party service integration.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure and semantic content |
| CSS3 | Styling, layouts, animations, and responsive design |
| Bootstrap 5 | Responsive components and layout utilities |
| Bootstrap Icons | Interface icons |
| JavaScript (Vanilla) | Interactive functionality and DOM manipulation |
| Google Fonts | Typography using DM Sans and Manrope |

## Pages and Development Scope

### 1. Homepage

The homepage serves as the main entry point to the Open Tickets website.

The overall redesign direction emphasizes a modern visual hierarchy, accessible navigation, and a consistent interface.

### 2. FAQ Page

The FAQ page is intended to help users find answers to common questions about the ticketing platform.

Its purpose is to organize information clearly and make support resources easier to access.

### 3. Event Detail Page

The event detail page provides a dedicated interface for displaying event information.

The page is part of the website's event discovery and ticketing experience.

### 4. Search Results Page

The search results page is intended to present relevant events or content based on a user's search query.

Its layout should remain consistent with the overall website design.

### 5. Support Page

The Support page is the latest implementation in the current development stage.

It uses a navy-and-blue visual theme with responsive layouts and interactive elements designed to help users access support resources.

The page includes:

- **Navigation bar:** Website navigation and header search interface.
- **Support hero section:** Introduces the support area and directs users to available resources.
- **Help categories:** Organizes support topics into clickable category cards.
- **Quick FAQ section:** Displays frequently asked questions in an accordion layout.
- **FAQ search:** Filters available questions based on the user's input.
- **Contact form:** Provides a form interface with basic client-side validation.
- **Live chat interface:** Provides a starting point for future live chat integration.
- **Language selector:** Provides a language selection interface.
- **Footer:** Contains supporting navigation and automatically updated copyright year.
- **Responsive layout:** Adapts the interface to different screen sizes.
- **Scroll reveal animations:** Adds subtle entrance animations when supported by the browser.

## Project Structure

The following is the intended organization of the main project files. Existing filenames and directories should be preserved where they differ.

```text
open-tickets/
├── index.html
├── faq.html
├── event-detail.html
├── search-results.html
├── Support.html
├── css/
│   └── support.css
├── javascript/
│   └── support.js
└── README.md
```

Additional CSS, JavaScript, images, and other assets may exist elsewhere in the project.

## Support Page Implementation

### HTML — `Support.html`

The HTML file defines the structure and content of the Support page.

It contains the navigation, support introduction, help categories, FAQ accordion, contact form, live chat interface, language selector, and footer.

### CSS — `css/support.css`

The stylesheet handles the page's visual appearance, including:

- Navy-and-blue color palette.
- Typography and spacing.
- Navigation and responsive menu styling.
- Help category cards.
- FAQ accordion presentation.
- Contact form styling.
- Footer layout.
- Responsive breakpoints.
- Scroll reveal and reduced-motion styling.

### JavaScript — `javascript/support.js`

The JavaScript file provides client-side interactions, including:

- Automatic copyright year updates.
- Mobile navigation behavior.
- FAQ accordion interactions.
- FAQ search and result counting.
- Header search integration with the FAQ section.
- Help category filtering.
- Contact form validation and status messages.
- Placeholder notifications for unconnected live chat and language selection.
- Scroll reveal animations.
- Temporary notification messages.

## Setup and Installation

### Prerequisites

- A modern web browser.
- A code editor, such as Visual Studio Code.
- An internet connection for externally hosted Bootstrap, Bootstrap Icons, and Google Fonts resources.

### Running the Project

1. Download or clone the project repository.
2. Open the project folder in your preferred code editor.
3. Verify that the CSS and JavaScript file paths match the HTML references.
4. Open `index.html` in a browser to view the homepage.
5. Open `Support.html` to inspect the Support page.

For a more convenient development workflow, the project can also be opened using the Live Server extension in Visual Studio Code.

### Script Reference

The Support page should load its JavaScript file before the closing body tag:

```html
<script src="javascript/support.js" defer></script>
```

Make sure Bootstrap's JavaScript bundle is also loaded if the page uses Bootstrap's interactive components.

## Current Development Status

### Implemented in the Support Page

- Responsive support page layout.
- FAQ accordion interactions.
- Client-side FAQ filtering.
- Header search integration with the FAQ section.
- Basic contact form validation.
- User-facing status and notification messages.
- Mobile navigation behavior.
- Copyright year automation.
- Scroll reveal animations.

### Pending Integration

Some interfaces currently provide frontend behavior only and are not connected to external services.

- **Contact form:** Requires a backend endpoint or email service to deliver submitted messages.
- **Live chat:** Requires integration with a live chat provider or a dedicated messaging system.
- **Language selector:** Requires translation resources and language-switching logic.
- **Search:** Currently filters available FAQ content on the Support page; a site-wide event search requires additional implementation.
- **Backend and database:** No new backend or database implementation is claimed as part of the current frontend work.

## Future Improvements

Potential next steps include:

1. Test all pages across desktop, tablet, and mobile devices.
2. Verify navigation links and interactions between pages.
3. Improve accessibility, including keyboard navigation and focus states.
4. Optimize images, fonts, and page loading performance.
5. Connect the contact form to a backend or email service.
6. Integrate a live chat provider.
7. Implement multilingual content if required.
8. Add automated testing and cross-browser checks.
9. Review the final implementation against the client's original requirements.

## Development Notes

- Keep the visual identity consistent across all pages.
- Use semantic HTML and maintain a clear separation between HTML, CSS, and JavaScript.
- Preserve existing project functionality unless a change is explicitly required.
- Keep code comments concise and relevant.
- Avoid introducing unnecessary backend infrastructure when the project requirements call for frontend work only.

## License

This project was developed as part of a website redesign project for Open Tickets.

License and redistribution terms should be determined by the project owner or client.

---

**Project:** Open Tickets Website Redesign  
**Current Focus:** Frontend Development  
**Status:** Support Page Frontend Implemented; Integration and Testing Pending
