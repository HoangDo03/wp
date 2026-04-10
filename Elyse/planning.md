# Project Structure: Luxuo Longform Template

This project is a modular template for creating high-end longform articles (Luxuo Longform).

## Asset Naming Convention (Recommended)

To keep the project organized and reusable, follow this naming convention for images in the `Assets/` directory:

- `hero.png`: The main hero banner at the top.
- `section-[N]-title.png`: The title image for section N.
- `section-[N]-quote.png`: The quote image for section N.
- `credit.png`: The footer image.

## File Directory

- `index.html`: The structural template.
- `style.css`: The stylesheet with CSS variables for easy branding.
- `main.js`: Scroll animation logic and utility functions.
- `content.js`: (Optional) Centralized storage for article content.
- `Assets/`: Directory for images.

## Key Features

- **Responsive Design**: Fluid typography with `clamp()`.
- **Scroll Animations**: Smooth entrance animations for all content blocks.
- **CSS Variables**: Easily change colors, fonts, and widths in one place.

## How to Create a New Article

1. Clone this template into a new directory.
2. Put your new images into the `Assets/` folder.
3. Update the content in `index.html` (or `content.js` if using dynamic loading).
4. Adjust branding variables in `:root` inside `style.css`.
