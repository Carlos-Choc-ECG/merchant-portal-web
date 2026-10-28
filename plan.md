# Merchant Portal Architecture Plan

## Objective

Define a scalable foundation for white-label branding, localization, and styling so the Merchant Portal can support multiple brands and languages without hardcoded assumptions.

## Recommended architecture

### 1. Brand configuration layer

- Add a `src/branding/` directory containing a typed registry for supported brands.
- Each brand config should include:
  - `id`
  - `name`
  - `logoPath`
  - `defaultLocale`
  - `colors`
  - `legal` URLs or references
- Use a single resolver to select the active brand based on environment, subdomain, or tenant config.
- Apply brand values to CSS custom properties so SCSS and Tailwind can use them consistently.

### 2. Localization layer

- Add a `src/locales/` directory with JSON files per locale (for example `en-US.json`, `es-ES.json`).
- Keep translation content organized by section (`auth`, `dashboard`, `reports`, `footer`) and stable keys.
- Use a central loader that resolves locale and returns the active message bundle.

### 3. Styling system

- Keep Tailwind as the utility-first styling layer.
- Use SCSS for shared variables, design tokens, and page/component partials when needed.
- Centralize colors and theme primitives via CSS variables sourced from the active brand.

### 4. App-level provider pattern

- Create a `BrandProvider` that writes brand CSS variables to `document.documentElement`.
- Resolve brand and locale once at the app root, then feed them to downstream components without repeated ad hoc logic.

## Proposed file structure

```txt
src/
  app/
    layout.tsx
    globals.scss
  branding/
    brands.ts
    resolveBrand.ts
  locales/
    en-US.json
    es-ES.json
  i18n/
    getMessages.ts
    resolveLocale.ts
  providers/
    BrandProvider.tsx
  styles/
    abstracts/
    base/
    components/
    pages/
```

## Why this is scalable

- All tenant-specific configuration lives outside UI code.
- Brand and locale can be switched without rewriting page logic.
- New brands or languages are additive changes rather than invasive rewrites.
- SCSS and Tailwind can coexist cleanly with a shared variable system.

## Decisions to review before implementation

- Brand source: static config vs API-driven config vs tenant-specific runtime lookup.
- Logo storage: local assets in `public/` vs remote URLs.
- Terms/privacy storage: static files, external documents, or CMS-managed content.
- Locale source: browser preference, account preference, or tenant default.

## Suggested next step

- Review this architecture as a proposal only.
- If approved, implement the brand registry and locale structure first, then wire in the provider and CSS variables.

## Example locale file

An example of the expected structure for `src/locales/en-US.json`:

```json
{
  "navigation": {
    "dashboard": "Dashboard",
    "funds": "Funds",
    "reports": "Reports"
  },
  "footer": {
    "copyright": "© 2026 {brandName}", // brandName = ECG
    "terms": "Terms of Service",
    "privacy": "Privacy Policy"
  },
  "authPage": {
    "welcome": "Welcome back",
    "signIn": "Sign in",
    "emailLabel": "Email address"
  }
}
```

This keeps copy organized by feature area and makes it easier to support additional languages without changing component logic.

## Frontend usage example

Example of how the locale object might be consumed in a component:

```tsx
import messages from '@/locales/en-US.json';

const locale = messages;

export default function SignInPage() {
  return (
    <main>
      <h1>{locale.authPage.welcome}</h1>
      <label htmlFor="email">{locale.authPage.emailLabel}</label>
      <button type="button">{locale.authPage.signIn}</button>
    </main>
  );
}
```

This pattern keeps the UI code clean and makes it easy to swap out locale files for different languages or brands.

## Frontend brand + locale example

A more realistic example for the app shell would combine the active brand config from a store or API response with the locale file. This allows the header and footer to render branding dynamically while still using localized copy.

```tsx
import { useEffect, useState } from 'react';
import messages from '@/locales/en-US.json';

type BrandConfig = {
  id: string;
  name: string;
  logoPath: string;
  colors: {
    primary: string;
    secondary: string;
  };
};

const locale = messages;

export default function MerchantShell() {
  const [brand, setBrand] = useState<BrandConfig | null>(null);

  useEffect(() => {
    // This could come from a Merchant Portal API we create that extracts information from Admin Console and stores it in global store, tenant context, or something else we decide.
    setBrand({
      id: 'ecg',
      name: 'ECG',
      logoPath: '/logos/ecg-logo.svg',
      colors: {
        primary: '#1d4ed8',
        secondary: '#0f172a',
      },
    });
  }, []);

  if (!brand) return null;

  return (
    <div>
      <header style={{ background: brand.colors.primary }}>
        <img src={brand.logoPath} alt={`${brand.name} logo`} />
        <nav>
          <a href="#">{locale.navigation.dashboard}</a>
          <a href="#">{locale.navigation.funds}</a>
          <a href="#">{locale.navigation.reports}</a>
        </nav>
      </header>

      <main>
        <h1>{locale.authPage.welcome}</h1>
        <label htmlFor="email">{locale.authPage.emailLabel}</label>
        <input id="email" name="email" type="text">
        <button type="button">{locale.authPage.signIn}</button>
      </main>

      <footer>
        <p>
          {locale.footer.copyright.replace('{brandName}', brand.name)}
        </p>
        <a href="#">{locale.footer.terms}</a>
        <a href="#">{locale.footer.privacy}</a>
      </footer>
    </div>
  );
}
```

This shows the pattern clearly:

- locale files provide human-readable copy
- the brand config provides the actual brand identity
- the app renders both together in the shell, header, and footer
- the placeholder `{brandName}` is replaced at runtime with the active brand name from state or API data

## Pros and cons of this localization approach

### Pros

- Simple and easy to understand for a small-to-medium app that doesn't have a lot of pages.
- Keeps copy out of component logic and makes content easier to update from single source.
- Easy to add new locales by creating another JSON file.
- Good fit for a white-label app where brands may share base content but vary by language.

### Cons

- JSON files can become large as the app grows and may become harder to maintain without structure. So more pages on the site means more variables within each locale file.
- It can be difficult to manage translation quality and consistency across teams without a localization workflow.
- When adding a new feature onto the Merchant Portal, each locale file must be updated and the new feature must be built with the localization file handling copy/verbiage in mind and not hard coding the text onto the feature itself.
- For after initial MVP will move to next-i18next for scalablity.

## BrandProvider implementation example

A `BrandProvider` is a small app-level component that applies the active brand's design tokens to the DOM so the rest of the app can consume them consistently without repeated hardcoded values.

```tsx
'use client';

import { useEffect } from 'react';

type BrandConfig = {
  id: string;
  name: string;
  logoPath: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
};

export function BrandProvider({ brand }: { brand: BrandConfig }) {
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--brand-primary', brand.colors.primary);
    root.style.setProperty('--brand-secondary', brand.colors.secondary);
    root.style.setProperty('--brand-background', brand.colors.background);
    root.style.setProperty('--brand-accent', brand.colors.accent);
    root.style.setProperty('--brand-name', brand.name);
    root.style.setProperty('--brand-logo', `url(${brand.logoPath})`);
  }, [brand]);

  return null;
}
```

This is meant to live near the app root, usually in `src/providers/BrandProvider.tsx`.

```tsx
import { BrandProvider } from '@/providers/BrandProvider';

const brand = {
  id: 'ecg',
  name: 'ECG',
  logoPath: '/logos/ecg-logo.svg',
  colors: {
    primary: '#1d4ed8',
    secondary: '#0f172a',
    background: '#f8fafc',
    accent: '#e0f2fe',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BrandProvider brand={brand} />
        {children}
      </body>
    </html>
  );
}
```

Why this is useful:

- the brand is set once at the app root
- colors and logo values are available everywhere via CSS variables
- each page or component can stay focused on structure rather than hardcoded brand values
- switching brands becomes a configuration change instead of a code rewrite

This pattern is especially helpful for a white-label Merchant Portal because the brand identity should be consistent across the app without scattering CSS variables or constants across many files.
