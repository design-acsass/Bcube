-- ===========================================================================
-- B Cube — grant the admin role to a person.
--
-- 1. The person must sign up on the site first (Login page), so that their
--    account exists in Supabase Auth.
-- 2. Replace the email below with theirs and run this file.
-- After this, the "Admin" link appears in the site header for that account.
-- ===========================================================================

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'you@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
