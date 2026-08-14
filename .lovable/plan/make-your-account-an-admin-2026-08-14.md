# Make your account an admin

## What I found

I checked the backend before changing anything:

- There are currently **zero user accounts** in the system. Nobody has ever signed up on this site.
- The `user_roles` table is **empty** — no admin exists yet.
- You are currently **signed out** in the preview.

So there is no "current account" to promote yet. An admin role must point at a real account, and that account has to exist first.

## Plan

### Step 1 — You create your account (1 minute, you do this)

1. Open the site preview and go to **/login**.
2. Sign up with the email + password you want to use as owner (or use **Continue with Google**).
3. Tell me in chat which email you used.

### Step 2 — I grant admin (I do this)

Once your account exists, I add exactly one row to the `user_roles` table:

- your user ID + role `admin`

Nothing else changes: no other users, no schema, no security policies, no products, no site behaviour.

### Step 3 — I verify

- Confirm the role row exists and that the `has_role` check returns true for your account.
- Sign in as you in a test browser session and load **/admin**, confirming the dashboard renders and the **Admin** link appears in the header.
- Report back exactly what was added.

## Technical note

The single change is one `INSERT` into `public.user_roles` (`user_id`, `role = 'admin'`), executed as a data change, not a migration. Roles stay in the dedicated `user_roles` table read by the security-definer `has_role()` function, which is what the admin route and RLS policies already use.

Approve this and then complete Step 1 so I can finish.
