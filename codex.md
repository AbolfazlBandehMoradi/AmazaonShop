# Codex Project Instructions — Amazon Mobile Store

## Project Identity

This repository is being repurposed into a completely new e-commerce website.

The previous project was used only as a technical starting point. Do NOT treat the previous shop, its branding, content, products, terminology, or business identity as part of this project.

The new project is:

**Amazon — Mobile Store**

A modern Iranian mobile phone and accessories store focused on buying and selling mobile devices and related products.

---

## Business Information

### Brand
**Amazon**

### Business Type
Mobile phone store / e-commerce

### Main Services
- 📲 خرید و فروش
- 💎 کیفیت و تنوع بالا
- 🎖️ بزرگترین و بروزترین مجموعه

### Physical Address
قبل بهشتی، ۱۵ برج ملکی، آمازون

### Phone
09156304012

### Instagram
https://www.instagram.com/amazon_zahedan

### WhatsApp
https://wa.me/989306608299

---

## Important Migration Rule

This project was created by copying an existing e-commerce project.

Treat the existing code as a **technical foundation only**.

When modifying the project:

- Remove or replace all previous shop branding.
- Remove previous shop names.
- Remove previous business information.
- Remove previous addresses and contact information.
- Remove previous social media links.
- Remove previous logos and brand assets when applicable.
- Remove previous product-specific content that does not belong to Amazon.
- Remove previous marketing copy.
- Do not preserve old shop-specific assumptions in components.
- Do not rename the new business to match the previous project.
- Do not reference the previous project in user-facing UI.
- Do not assume existing categories, products, banners, or content belong to Amazon.

If old content is found, replace it with Amazon-specific content rather than simply hiding it.

---

## Development Philosophy

Do not rebuild working infrastructure unnecessarily.

Before creating a new implementation:

1. Inspect the existing architecture.
2. Identify reusable components, hooks, utilities, API integrations, layouts, and UI patterns.
3. Reuse technically sound code where appropriate.
4. Refactor code when it contains assumptions tied to the previous shop.
5. Remove obsolete business logic instead of carrying it forward blindly.

The goal is:

**Reuse the engineering foundation, rebuild the business identity and user experience.**

---

## Brand Direction

The website should feel like a modern, trustworthy mobile store.

The visual direction should communicate:

- Modern technology
- Premium quality
- Trust
- Product variety
- Clean e-commerce experience
- Professional local business
- Strong mobile-first experience

Avoid making the website look like a generic template.

The design should feel intentionally built for a mobile store.

---

## Content Language

The primary customer-facing language is **Persian (FA)**.

The UI must support RTL correctly.

Use natural Persian copy rather than literal translations or generic placeholder text.

Do not use fake English marketing copy unless it is intentionally part of the design.

---

## Store Categories

The project should be structured around mobile-store products.

Potential categories include:

- موبایل
- آیفون
- سامسونگ
- شیائومی
- لوازم جانبی
- هندزفری
- شارژر
- کابل
- قاب و گلس
- ساعت هوشمند
- سایر محصولات دیجیتال

Do not hard-code these categories if the existing architecture supports dynamic categories.

---

## Product Data

Products should be treated as mobile/electronics products.

Typical product information may include:

- Product name
- Brand
- Model
- Price
- Discount price
- Images
- Storage
- RAM
- Color
- Warranty
- Availability
- Product description
- Specifications
- Category
- Tags
- Featured status
- New-arrival status
- Best-selling status

Do not invent real product information unless explicitly requested.

Use placeholders/mock data only when necessary during development.

Clearly separate mock/demo data from real business data.

---

## Contact / CTA Behavior

Important customer contact points:

**Phone:** 09156304012

**Instagram:** https://www.instagram.com/amazon_zahedan

**WhatsApp:** https://wa.me/989306608299

When implementing contact CTAs, prefer appropriate actions:

- Phone → `tel:09156304012`
- WhatsApp → `https://wa.me/989306608299`
- Instagram → `https://www.instagram.com/amazon_zahedan`

Do not use the long Instagram redirect URL provided by the source data for the actual WhatsApp link. Use the clean WhatsApp URL.

---

## User Experience

Prioritize:

- Fast product discovery
- Clear pricing
- Strong product imagery
- Easy category navigation
- Search
- Filtering
- Product comparison where appropriate
- Mobile responsiveness
- Clear CTAs
- Trust signals
- Simple checkout/contact flow

The mobile experience is especially important because the business itself is a mobile store.

---

## Existing Codebase

Before changing major parts of the application, inspect:

- package.json
- project structure
- routing
- API/data layer
- authentication
- product components
- category components
- cart
- checkout
- admin functionality
- hooks
- utilities
- styling system
- assets
- environment variables

Do not introduce a new library if the existing project already provides an adequate solution.

Avoid unnecessary dependency changes.

---

## Code Quality

Follow the existing project's established conventions unless they conflict with the new project requirements.

Prefer:

- Reusable components
- Clear component boundaries
- Strong TypeScript typing
- Small focused utilities
- Consistent naming
- Responsive design
- Accessible interactive elements
- Semantic HTML
- Proper loading states
- Proper error states
- Empty states

Avoid:

- Duplicated components
- Hard-coded business information across many files
- Magic strings when configuration is appropriate
- Dead code
- Unused dependencies
- Temporary hacks becoming permanent architecture

Business information should ideally have a single source of truth.

---

## SEO

The project is an e-commerce website for a local mobile store.

Keep SEO in mind when implementing:

- Page titles
- Meta descriptions
- Product metadata
- Open Graph metadata
- Canonical URLs
- Structured data
- Product schema
- Organization/local business information
- Category pages
- Internal linking

Use Persian SEO content where appropriate.

Do not copy SEO metadata from the previous project.

---

## Assets

When encountering assets from the previous project:

1. Determine whether they are generic/reusable.
2. If they are shop-specific, replace them.
3. Do not expose old branding in the new website.
4. Prefer meaningful filenames for new Amazon assets.

The new project should eventually contain only assets relevant to Amazon.

---

## Before Implementing Features

For every significant feature:

1. Inspect the existing implementation.
2. Understand why it was built the way it was.
3. Determine whether it can be reused.
4. Remove old business assumptions.
5. Implement the Amazon-specific version.
6. Check desktop and mobile behavior.
7. Check RTL behavior.
8. Check loading, empty, and error states.

---

## Design Principle

Do not simply "rename the old shop."

This is a **new product built on an existing codebase**.

The final result should look and behave as though Amazon was designed and developed specifically as its own e-commerce product.

Technical reuse is encouraged.

Visual, content, and business-logic reuse should only happen when it genuinely makes sense for Amazon.

---

## Definition of Done

A feature is not considered complete merely because it works technically.

Before considering work complete, verify:

- No previous-shop branding remains.
- No previous-shop contact information remains.
- No previous-shop URLs remain.
- Persian RTL layout works correctly.
- Responsive layout works on mobile/tablet/desktop.
- Loading states work.
- Empty states work.
- Error states work.
- Existing functionality has not been unnecessarily broken.
- TypeScript/build checks pass.
- No obvious console errors remain.