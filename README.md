# Grupo L — AFIP Presentaciones Digitales (Backoffice)

> **Portfolio demo.** This is a personal fork of a real project I worked on
> as UX/UI Designer & UI Developer. The original backend, client data, and
> git history are not included here — this fork runs entirely on local mock
> data so it can be explored standalone, without any backend or credentials.

## About this project

A BackOffice built for a real client (Grupo L Argentina) to manage AFIP
digital filings: uploading files, tracking their status, and reviewing
consolidated reports across multiple points of sale.

**My role:** UI Designer & UI Developer — design in Figma, and the front-end
implementation in Angular (this repo).

**Stack:** Angular 18 (standalone components), Tailwind CSS, DataTables.

## What's different in this fork

Since the real backend and database aren't available outside the client's
environment, this fork adds two things — clearly marked as demo-only in the
code — so the app works on its own:

- **`src/app/shared/mocks/mock-data.ts`** — fictional data (files, statuses,
  event history) shaped exactly like the real API's responses.
- **`src/app/shared/services/mock-api.interceptor.ts`** — an HTTP interceptor
  that answers every API call locally with the mock data above, instead of
  reaching out to a real server.
- The real Google reCAPTCHA on the login and password-recovery screens was
  removed, since it's tied to a specific verified domain and would break as
  soon as the app is deployed elsewhere.

No code from the actual design/UI implementation was changed — only the data
layer and the recaptcha dependency, so this fork behaves visually identically
to the real thing.

## Running it locally

```bash
npm install
npm start
```

Then open `http://localhost:4200`.

**Login:** any username, and any password with 4+ characters, will work.

## What you can try

- **Login** (`/auth/signin`) — fake login, no real backend needed.
- **Files list** (`/dashboard-list`) — paginated table with filters (CUIT,
  point of sale, status, date range).
- **File detail** (`/file-list/:id`) — click "Ver detalles" on any row to see
  the status stepper and the day-by-day fiscal breakdown table.
- **Consolidated files** (`/consolidated-files`) — a second list view.
- Error pages: `/404`, `/500`.

## Notes

- All data shown (CUITs, filenames, amounts, dates) is fictional.
- `npm run build` produces a production build with no dependency on the
  original backend or any external service.

---
Miguel Sánchez — UX/UI Designer & UI Developer
m.sanchez.visual@gmail.com · linkedin.com/in/m-sanchez-murillo
