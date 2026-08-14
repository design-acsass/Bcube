GRANT INSERT ON public.enquiries TO anon, authenticated;
CREATE POLICY "enquiries public submit" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

GRANT INSERT ON public.orders TO authenticated;
CREATE POLICY "orders own insert" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

GRANT INSERT ON public.order_items TO authenticated;
CREATE POLICY "order items own insert" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));