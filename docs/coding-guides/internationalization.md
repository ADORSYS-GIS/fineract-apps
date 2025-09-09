# Internationalization (i18n) Guide

This document outlines the strategy for implementing and managing multi-language support in our applications. The goal is to support **English (en)** and **French (fr)**.

## Core Library

We will use [i18next](https://www.i18next.com/) with the [react-i18next](https://react.i18next.com/) hook-based bindings. This is a powerful and flexible solution for handling translations in React.

## Translation File Structure

Translation files will be stored as JSON within each application's `public` directory. This allows them to be loaded without being bundled with the JavaScript, which is efficient for loading only the required language.

The structure for each app will be:

```
/packages/apps/[app-name]
└── /public
    └── /locales
        ├── /en
        │   ├── common.json
        │   └── home.json
        └── /fr
            ├── common.json
            └── home.json
```

*   **`locales`**: The root directory for all translation files.
*   **`en`**, **`fr`**: Language codes for each supported language.
*   **`common.json`**: Contains translations for strings that are shared across the entire application (e.g., "Save", "Cancel", "Error").
*   **`[feature].json`**: A separate file for each feature or page (e.g., `home.json`, `profile.json`). This is called "namespacing" and it helps keep translation files organized and manageable.

## Usage in Components

We will use the `useTranslation` hook from `react-i18next` to access translations within our components.

```tsx
// Example: src/features/authentication/components/LoginForm.view.tsx
import { useTranslation } from 'react-i18next';

export const LoginFormView = () => {
  const { t } = useTranslation('common'); // Specify the namespace

  return (
    <form>
      <label>{t('username')}</label>
      <input type="text" />
      <button type="submit">{t('login')}</button>
    </form>
  );
};
```

## Adding New Translations

1.  **Identify the Namespace**: Decide if the new text belongs in `common.json` or a feature-specific file.
2.  **Add to English File**: Add the new key-value pair to the appropriate English JSON file (e.g., `en/common.json`). The key should be descriptive and concise.
    ```json
    // en/common.json
    {
      "login": "Log In",
      "username": "Username",
      "password": "Password"
    }
    ```
3.  **Add to French File**: Add the same key with the translated value to the corresponding French file.
    ```json
    // fr/common.json
    {
      "login": "Se connecter",
      "username": "Nom d'utilisateur",
      "password": "Mot de passe"
    }
    ```

## Interpolation

To include dynamic values in your translations, use double curly braces `{{...}}`.

```json
// en/common.json
{
  "welcomeMessage": "Welcome, {{name}}!"
}
```

```tsx
// In the component
const { t } = useTranslation('common');
t('welcomeMessage', { name: user.name }); // Renders "Welcome, John!"
```

This approach ensures our applications are ready for multi-language support from day one.
