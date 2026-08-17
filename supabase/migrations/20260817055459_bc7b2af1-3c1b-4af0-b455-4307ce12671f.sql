CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "enquiries admin read" ON public.enquiries;
CREATE POLICY "enquiries admin read" ON public.enquiries FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY "media admin write" ON public.media;
CREATE POLICY "media admin write" ON public.media FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY "order items admin write" ON public.order_items;
CREATE POLICY "order items admin write" ON public.order_items FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY "order items own read" ON public.order_items;
CREATE POLICY "order items own read" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id
    AND (o.user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'::public.app_role))));

DROP POLICY "orders admin write" ON public.orders;
CREATE POLICY "orders admin write" ON public.orders FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY "orders own read" ON public.orders;
CREATE POLICY "orders own read" ON public.orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY "pricing admin write" ON public.product_pricing;
CREATE POLICY "pricing admin write" ON public.product_pricing FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY "products admin write" ON public.products;
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY "products auth read" ON public.products;
CREATE POLICY "products auth read" ON public.products FOR SELECT TO authenticated
  USING (published OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY "content admin write" ON public.site_content;
CREATE POLICY "content admin write" ON public.site_content FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);