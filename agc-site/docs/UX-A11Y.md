# UX, mobile-first & accessibility notes

## Public site (`SiteChrome`)

- **Mobile drawer** (`MobileDrawer`): `role="dialog"`, `aria-modal`, `aria-label`. **Escape** closes; **Tab** cycles focus inside the panel; closing restores focus to the **menu button** in the header.
- **`inert` background**: When the drawer is open, the region below the **header** (main content, footer, bottom nav) is **`inert`** and **`aria-hidden`**. The **header stays interactive** so the hamburger / close control always works.
- **Reduced motion**: Drawer transition uses `motion-reduce:transition-none`. Route **loading** skeletons use `motion-reduce:animate-none`.

## Admin

- **`AdminPageHeader`**: Consistent title + description under the admin top bar.
- **`AdminFormStickyActions`**: Primary + Cancel on long forms stick to the bottom on small viewports (safe-area aware). Form cards use **`p-4 sm:p-8`** so sticky bars align with the card.
- **`AdminFormErrorSuspense`**: Reads **`?error=`** from the URL (server actions redirect here on validation failure) and shows an alert. Used on create/edit screens that use those redirects. **Homepage** (`updateHomePageContent` in `actions-home.ts`) redirects to **`/admin/pages/home/edit?error=...`** if the DB upsert fails so the banner is meaningful.
- **`AdminFormSuccessSuspense`**: Reads **`?saved=`** (`1` = saved, `created` = new record, `deleted` = removed) after successful server actions. Shown on admin **list** and **new/edit** routes; **Dismiss** strips the query param via **`router.replace`**. Pair with redirects like **`/admin/events/edit/[id]?saved=1`** or **`/admin/news?saved=deleted`**.
- **DB / network errors**: Shared copy **`ADMIN_DB_ERROR_MESSAGE`** (`lib/admin-flash-messages.ts`). Prisma **create/update/delete** in admin server actions are wrapped in **`try/catch`**; failures redirect with **`?error=`** (same banner as validation). **List** pages include **`AdminFormErrorSuspense`** so failed deletes surface the message.
- **`admin/loading.tsx`**: Lightweight skeleton for navigations under **`/admin/**`** while RSC loads.
- **Taxonomy (`/admin/taxonomy`)**: Edit **news category** and **publication type** lists (one line per entry: `slug | label` or `slug | label | description`). News and publication forms use **checkboxes** for multi-select; values are validated against these lists on save.

## Loading UI

- **Root** `app/loading.tsx`: Spinner + pulse bar; **`motion-reduce:animate-none`** on animated bits.
- **Route segments** (e.g. `events`, `news`, `our-work`, `contact`, `about`, `get-involved`, **`about/team`**, **`app-summit`**) use lightweight skeletons while RSC streams—especially helpful on slow mobile networks.
