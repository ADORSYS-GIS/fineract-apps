# Internationalization (i18n) Guide

This document outlines the intended strategy for implementing and managing multi-language support in our applications. **Note: This feature is not yet implemented.**

## 1. Future Goal

The goal is to support multiple languages, starting with **English (en)** and **French (fr)**. The architecture should be designed with internationalization in mind, even if the full implementation is pending.

## 2. Proposed Core Library

When this feature is implemented, the proposed solution is [i18next](https://www.i18next.com/) with the [react-i18next](https://react.i18next.com/) hook-based bindings. This is a powerful and flexible solution for handling translations in React.

## 3. Proposed Translation File Structure

Translation files will be stored as JSON within each application's `public` directory. This allows them to be loaded without being bundled with the JavaScript, which is efficient for loading only the required language.

The proposed structure for each app will be:

```
/frontend/[app-name]
└── /public
    └── /locales
        ├── /en
        │   ├── common.json
        │   └── [feature].json
        └── /fr
            ├── common.json
            └── [feature].json
```

- **`common.json`**: Will contain translations for strings that are shared across the entire application (e.g., "Save", "Cancel").
- **`[feature].json`**: A separate file for each feature or page. This is called "namespacing" and it helps keep translation files organized.

## 4. Implementation Steps

When work begins on internationalization, the following steps will be necessary:

1.  Add `i18next` and `react-i18next` dependencies to the relevant application.
2.  Create the `i18n` initialization file.
3.  Create the `locales` directory and translation files as described above.
4.  Wrap the root application component with the `I18nextProvider`.
5.  Begin replacing hardcoded text in components with the `useTranslation` hook.