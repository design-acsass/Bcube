# Backend handoff documentation (HANDOFF.md)

Create a single new file, `HANDOFF.md`, at the project root. No website, database, auth, security, or UI changes — documentation only.

## Verification before writing

Every claim in the document is checked first against the real project, not assumed:

- Read the three migration files in `supabase/migrations/` for tables, columns, grants and policies.
- Query the live database for the current policy list, roles, storage buckets, and whether any rows exist.
- Read `src/routes/admin.tsx` to list exactly what each admin tab can and cannot do (for example: whether media is URL-paste only or supports file upload).
- Read `src/lib/store.ts`, `src/lib/orders.ts`, `src/lib/enquiries.ts`, `src/hooks/use-cart.ts`, `src/hooks/use-auth.ts`, `src/routes/login.tsx`, `src/routes/cart.tsx` for the data, cart, order and auth flows.
- Check `src/routes/api/` and `supabase/functions/` for backend endpoints (currently none seen — confirmed before stating it).
- Check which social login providers are actually enabled, and the current storage bucket list.

Anything that cannot be confirmed is marked NEEDS VERIFICATION rather than claimed as done.

## Document structure

The file follows the 14 sections requested, in order:

1. Project overview — tech stack, frontend architecture, backend architecture, auth, database, hosting.
2. What is in the GitHub repository (and what is not).
3. Database — one subsection per table: purpose, key columns, relationships, who can read, who can write.
4. Authentication — email/password, Google, Facebook status, profiles, admin roles, how admin access is granted.
5. Security — every RLS policy restated in plain English, grouped around customer data, carts, orders, profiles, admin-only writes.
6. Admin dashboard — each tab (Images & videos, Products, Prices, Site text, Orders, Enquiries) with what it does and what it does not do.
7. Media — where assets live today, storage bucket status, upload vs paste-URL, what is needed for real uploads.
8. Products and pricing — product structure, options, pricing rows, configurable vs simple products, how the frontend reads prices with static fallbacks.
9. Cart and orders — cart persistence for guests vs signed-in users, order and order-item creation, checkout behaviour, payment status.
10. Missing backend features — payments, file storage/uploads, order emails, Facebook OAuth, admin self-service role granting, anything else found.
11. Environment variables and secrets — public vs private vs must-create, with an explicit "never commit" list. No secret values printed.
12. Deployment — steps to take the project to production.
13. Backend developer checklist — verify / configure / build / test / deploy.
14. Current status table with COMPLETE / PARTIAL / NOT IMPLEMENTED / NEEDS VERIFICATION for each of the 15 listed areas.

Ends with **What I Need To Give My Backend Developer** — a short checklist of only what you personally must supply.

## Notes

- Written in plain language for a non-technical owner, with the technical detail kept in clearly marked subsections for the developer.
- No secret values, keys, or database passwords appear anywhere in the file.
