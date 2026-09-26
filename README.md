# Storefront frontend

## Product image uploads

Product management supports either a public image URL or a local file upload
through Cloudinary's unsigned upload endpoint. Cloudinary's free plan is
enough for development and does not require Firebase Storage.

1. Create a free Cloudinary account.
2. In **Settings → Upload**, create an **unsigned upload preset**.
3. Copy `.env.example` to `.env.local`.
4. Set `VITE_CLOUDINARY_CLOUD_NAME` to your Cloudinary cloud name.
5. Set `VITE_CLOUDINARY_UPLOAD_PRESET` to the unsigned preset name.
6. Restart the Vite dev server.

Only the cloud name and unsigned preset are exposed in the frontend. Never put
the Cloudinary API secret in a `VITE_` variable or commit it to the project.

The upload flow validates image type and size in the browser, uploads the
selected file to Cloudinary, then saves the returned secure image URL with the
product through the backend API.

## Deployment

For Vercel, configure these environment variables for the production
environment and redeploy after changing them:

- `VITE_API_URL`: the Render API URL ending in `/api`
- `VITE_CLOUDINARY_CLOUD_NAME`: the Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET`: an unsigned upload preset

The backend must be deployed separately on Render with `MONGO_URI`,
`FIREBASE_SERVICE_ACCOUNT_KEY`, `FRONTEND_URL` set to the Vercel origin, and
`PORT` supplied by Render or left unset. Do not put the Firebase service
account key or a Cloudinary API secret in frontend variables.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
