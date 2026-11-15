# Haribon Foundation website (React + Laravel CMS)

A student project: a website for the Haribon Foundation with a database-driven CMS.

- **Public site** (React, TypeScript, Vite): Home, About, Donate.
- **CMS dashboard** at `/admin` (React): edit pages, programs, announcements, images and site settings.
- **API** (Laravel, `backend/`): serves published content from MySQL and protects the admin routes with Sanctum.
- **Payments** (Express, `server/`): the original Stripe donation server. It is unchanged and separate from the CMS.

```
Editor edits content in /admin -> React sends an API request -> Laravel validates it
-> MySQL stores it -> the public React site shows the update.
```

## Project structure

```
Haribon/
├── src/                React app (public pages in pages/, dashboard in admin/)
├── server/             Express + Stripe payment server (unchanged)
├── backend/            Laravel API + CMS (routes/api.php, migrations, seeders, tests)
├── vite.config.ts      Dev proxy: /api -> Laravel (8000), /api/create-payment-intent -> Express (4242)
├── .env.example        Stripe keys and optional API address for the React side
└── backend/.env.example  Database and Sanctum settings for Laravel
```

## Requirements

- Node.js 20+ and npm
- PHP 8.2+ with the extensions `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `curl`, `xml` (XAMPP has them; enable `extension=fileinfo` in `php.ini` if needed)
- Composer 2
- MySQL 8 (or MariaDB 10.6+); XAMPP's MySQL works

## First-time setup (Windows CMD)

Run the commands from the folder shown in each step.

**1. Frontend and payment server** (project root `Haribon\`)

```
npm install
copy .env.example .env
```

Open `.env` and paste your Stripe test keys (`sk_test_...` and `pk_test_...`).

**2. Database.** Start MySQL (XAMPP Control Panel > MySQL > Start), then create the database:

```
mysql -u root -p -e "CREATE DATABASE haribon_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

(With XAMPP's default root account there is no password: press Enter. You can also create the database in phpMyAdmin.)

**3. Laravel backend** (inside `Haribon\backend\`)

```
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

Open `backend\.env` and set `DB_USERNAME` and `DB_PASSWORD` for your MySQL user. Then:

```
php artisan migrate --seed
php artisan storage:link
php artisan cms:create-admin
```

`migrate --seed` creates the tables and loads the existing Haribon text, programs, settings and the hero image into MySQL. `cms:create-admin` asks for a name, email and password (min. 8 characters) and creates the first administrator. No credentials are stored in the repository. After the first `composer install`, commit the generated `backend\composer.lock`.

## Running the project

Open three Command Prompt windows.

| Window | Folder | Command | Address |
|---|---|---|---|
| Laravel API | `backend\` | `php artisan serve` | http://localhost:8000 |
| Payments | project root | `npm run server` | http://localhost:4242 |
| Website | project root | `npm run dev` | http://localhost:5173 |

After the first-time setup you can start all three windows at once by double-clicking `start-dev.bat` in the project root.

Open **http://localhost:5173** for the website and **http://localhost:5173/admin** for the CMS. Always use `localhost` (not `127.0.0.1`) so the login cookie works.

## What the CMS manages

| Public content | Where to edit it |
|---|---|
| Home: hero (eyebrow, title, text, image, two buttons), "Ways to take part" cards, statistics, section headings, call to action | Pages > Home |
| Home: the four pillars and their programs | Programs |
| Home: latest announcements | Announcements |
| About: intro, the name and history cards, and the four "Why I chose Haribon" reasons (add more cards, with images, if you like) | Pages > About |
| Donate: heading, description, bullet points, card text | Pages > Donate |
| Organization name, address, email, phone, social links, footer notice | Settings |
| Images used anywhere | Media |

Nearly all text on the public pages comes from the database. Not CMS-managed on purpose: Stripe amounts and keys, the payment form, and the footer's "Get involved" links.

Editors can create, edit and delete content (with a confirmation dialog), publish or unpublish pages, programs and announcements, upload images and add new pages or sections.

## API overview

Public (published content only): `GET /api/pages`, `/api/pages/{slug}`, `/api/programs`, `/api/announcements`, `/api/announcements/{id}`, `/api/settings`.

Authentication: `GET /sanctum/csrf-cookie`, `POST /api/login`, `POST /api/logout`, `GET /api/user`.

Administrator (login required, `/api/admin/...`): `dashboard`; `pages`, `sections`, `programs`, `announcements` (create, read, update, delete, and `PATCH .../status` to publish or unpublish); `media` (list, upload, delete); `settings` (read, update).

## Security notes

- Sanctum cookie/session login with CSRF protection; login is rate limited; passwords are hashed.
- Every `/api/admin` route needs a logged-in **administrator**; this is enforced by Laravel, not only by the React route guard.
- All input is validated with Form Requests. Button links must start with `/`, `#` or `http(s)://`; image references must exist in the media table; settings keys are whitelisted.
- Uploads accept JPG, PNG, WebP and GIF up to 4 MB, are checked by content (not file name), are stored under random names, and SVG is refused.
- Content is rendered as plain text by React (no raw HTML).
- Stripe secret keys exist only in the root `.env`, used only by `server/`. They are never in React or CMS tables.
- `.env` files are git-ignored; only `.env.example` files are committed.

## Tests and checks

```
cd backend
php artisan test
```

runs 22 feature tests (public API, login, authorization, CRUD, publishing, uploads, validation, seeding). From the project root:

```
npm run lint
npm run build
```

## Demo checklist

1. **Edit the homepage:** log in at `/admin` > Pages > Home > Edit content > open `hero`, change the heading, Save. Refresh http://localhost:5173 and the new heading shows. In MySQL: `SELECT heading FROM page_sections WHERE section_key='hero';`
2. **Announcement:** Announcements > New announcement > Published > Save. It appears under "Latest announcements" on the home page. Edit it, then Unpublish: it disappears.
3. **Images:** Media > Upload, or in a section use "Choose from library", then Save. The public page shows it.
4. **Persistence:** stop and restart all three windows. The edited content is still there.
5. **Security:** Log out, then open http://localhost:5173/api/admin/dashboard. It returns 401 (`Unauthenticated`). After logging in, the dashboard works.
6. **Donation still works:** http://localhost:5173/donate with the Stripe test card `4242 4242 4242 4242`, any future date, any CVC.

## Putting it on GitHub

```
git add .
git commit -m "Add Laravel CMS, admin dashboard and MySQL content"
git push
```

Check `git status` first: `.env`, `backend\vendor`, `node_modules` and `backend\storage` uploads must not be listed. GitHub stores the code only; it does not run Laravel or MySQL.

## Deployment notes

- GitHub Pages can host only the built React files. The Laravel API, MySQL and the Express server need a PHP/Node host.
- The login uses Sanctum cookies, so host the React app and the API on the **same site** (for example `www.example.org` and `api.example.org`), then set `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`, `CORS_ALLOWED_ORIGINS` and `APP_URL` in `backend\.env`, and `VITE_API_BASE_URL` / `VITE_ASSET_BASE_URL` for the React build.
- Set `APP_DEBUG=false` in production.

## Troubleshooting

- **Page says "We couldn't load this page":** the Laravel window is not running, or the database settings in `backend\.env` are wrong.
- **Login fails with 419:** use http://localhost:5173 (not 127.0.0.1) and confirm `SANCTUM_STATEFUL_DOMAINS=localhost:5173` in `backend\.env`; run `php artisan config:clear`.
- **Images do not show:** run `php artisan storage:link` inside `backend\`. On Windows this command creates a shortcut (symlink) and needs an **Administrator** Command Prompt (right-click Command Prompt > Run as administrator) or Windows Developer Mode turned on. If it says `A required privilege is not held by the client`, that is the cause.
- **Website shows `http proxy error ... ECONNREFUSED`:** the window for that service is not running (`php artisan serve` for `/api`, `npm run server` for `/api/create-payment-intent`).
- **`composer install` says an extension is missing:** open XAMPP's `php.ini` (Config > PHP) and remove the `;` in front of the extension it names (for example `extension=zip`), then restart the terminal.
- **`could not find driver`:** enable `extension=pdo_mysql` in PHP's `php.ini`.
- **Donate shows "Cannot reach the payment server":** start `npm run server` and check the Stripe keys in the root `.env`.
