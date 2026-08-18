-- ===========================================================================
-- B Cube — full database schema for a fresh Supabase project.
--
-- Run this ONCE in the SQL editor of your own Supabase project
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- It is the exact schema the site runs on, assembled from the project's
-- migration history in order.
--
-- After this file:  02_seed.sql  ->  03_make_admin.sql
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- from 20260814091438_aca5cbe2-3413-40e9-b5fb-d850069176f7.sql
-- ---------------------------------------------------------------------------
-- Roles ------------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Media ------------------------------------------------------------------
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL DEFAULT 'image',
  url TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media public read" ON public.media FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "media admin write" ON public.media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER media_updated BEFORE UPDATE ON public.media FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Products ---------------------------------------------------------------
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'custom-enquiry',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.product_pricing (
  product_slug TEXT PRIMARY KEY REFERENCES public.products(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  base INTEGER NOT NULL DEFAULT 0,
  framed INTEGER NOT NULL DEFAULT 0,
  shape JSONB NOT NULL DEFAULT '{}'::jsonb,
  size JSONB NOT NULL DEFAULT '{}'::jsonb,
  thickness JSONB NOT NULL DEFAULT '{}'::jsonb,
  text_price INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_pricing TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_pricing TO authenticated;
GRANT ALL ON public.product_pricing TO service_role;
ALTER TABLE public.product_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pricing public read" ON public.product_pricing FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "pricing admin write" ON public.product_pricing FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER pricing_updated BEFORE UPDATE ON public.product_pricing FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Editable site content ---------------------------------------------------
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content public read" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "content admin write" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Carts -------------------------------------------------------------------
CREATE TABLE public.carts (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carts TO authenticated;
GRANT ALL ON public.carts TO service_role;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own cart" ON public.carts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER carts_updated BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Orders ------------------------------------------------------------------
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  customer_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  subtotal INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_provider TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders own read" ON public.orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "orders admin write" ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL DEFAULT 0,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX order_items_order_id_idx ON public.order_items(order_id);
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order items own read" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "order items admin write" ON public.order_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enquiries ---------------------------------------------------------------
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'contact',
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enquiries admin read" ON public.enquiries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed data ----------------------------------------------------------------
INSERT INTO public.media (slot, kind, url, label) VALUES
  ('hero-1', 'image', '/__l5e/assets-v1/e304b8d8-692f-4f8a-9458-992974ef62a6/banner-1.png', 'Hero banner 1'),
  ('hero-2', 'image', '/__l5e/assets-v1/5229e5cd-bfb2-4655-9d02-5d62b57590d0/banner-2.png', 'Hero banner 2'),
  ('hero-3', 'image', '/__l5e/assets-v1/29072ed0-9c89-4588-954a-41b1732dd9ac/banner-3.png', 'Hero banner 3'),
  ('ad-1', 'image', '/__l5e/assets-v1/c84d038a-ace5-4e9c-bf6c-eb5f396961f7/Advertisment_Card.png', 'Ad banner — Enriching Relationships'),
  ('ad-2', 'image', '/__l5e/assets-v1/22af6821-21fe-419f-bc28-e3e83a539ce0/Advertisement_card_2.png', 'Ad banner — Know More About Our Products'),
  ('ad-3', 'image', '/__l5e/assets-v1/f253cd65-6a70-4119-870e-e606ceffd6d4/Advertisement_card_3.png', 'Ad banner — Find The Perfect Gifts'),
  ('category-1', 'image', '/__l5e/assets-v1/84b345bf-d82b-4015-8cac-1fe5a9a9720b/Cat1.png', 'Product category tile 1'),
  ('category-2', 'image', '/__l5e/assets-v1/84f31d71-1e1a-40f0-99bd-59aa6c7b8e16/Cat2.png', 'Product category tile 2'),
  ('category-3', 'image', '/__l5e/assets-v1/3522f859-4396-4d84-80e0-611c4b07136e/Cat3.png', 'Product category tile 3'),
  ('category-bg', 'image', '/__l5e/assets-v1/562d2f46-f707-4478-a0d4-7a613dc55423/Category_Bg1.png', 'Category brush background (default)'),
  ('category-bg-hover', 'image', '/__l5e/assets-v1/68692d62-234f-4330-9931-fdb39faa27dc/Category_Bg2b.png', 'Category brush background (hover)'),
  ('logo', 'image', '/__l5e/assets-v1/6192d917-37f1-4b85-848e-65e80e35dded/LOGO.png', 'B Cube logo'),
  ('special-1', 'image', '/__l5e/assets-v1/5830d944-4565-4d26-adfc-cccde9811a72/Corporate_gifting.png', 'Make Celebrations Special — tile 1'),
  ('special-2', 'image', '/__l5e/assets-v1/9ce7b135-a352-455e-a485-4046602fef7e/Custom_acrylic_phots.png', 'Make Celebrations Special — tile 2'),
  ('special-3', 'image', '/__l5e/assets-v1/5830d944-4565-4d26-adfc-cccde9811a72/Corporate_gifting.png', 'Make Celebrations Special — tile 3'),
  ('special-4', 'image', '/__l5e/assets-v1/f67598bf-2604-4285-a028-368de7734bb9/Return_Gifts.png', 'Make Celebrations Special — tile 4');

INSERT INTO public.products (slug, name, category, mode, image_url, sort_order) VALUES
  ('premium-acrylic-photo', 'Premium Acrylic Photo', 'custom-acrylic', 'wizard', '/__l5e/assets-v1/7ea2a6bf-2605-4d65-a2b0-74dc711c075b/Premium_Acrylic_Photos.png', 0),
  ('framed-acrylic-photo', 'Framed Acrylic Photo', 'custom-acrylic', 'wizard', '/__l5e/assets-v1/4308e8a4-50d7-4c7a-9d90-082011919737/Framed_Acrylic_Photos.png', 1),
  ('wall-clocks', 'Wall Clocks', 'custom-acrylic', 'wizard', '/__l5e/assets-v1/7814def3-2984-416b-8541-379f07c1c285/Wall_Clocks.png', 2),
  ('fridge-magnet', 'Fridge Magnet', 'custom-acrylic', 'custom-enquiry', '/__l5e/assets-v1/1899e451-3dfe-4c39-b766-0cfb74391011/Fridge_magnets.png', 3),
  ('name-plate', 'Name Plate', 'custom-acrylic', 'custom-enquiry', '/__l5e/assets-v1/b8a86209-e6b4-41b6-bf36-a648987c5258/Custom_name_plates.png', 4),
  ('keychain', 'Keychain', 'custom-acrylic', 'custom-enquiry', '/__l5e/assets-v1/b7a82af5-d347-40b2-be32-e5b57671dd65/Custom_Keychains.png', 5),
  ('acrylic-cutouts-decor', 'Acrylic Cutouts Décor', 'custom-acrylic', 'custom-enquiry', '/__l5e/assets-v1/e95aa535-d153-495f-99b3-4e17b566aed6/Acrylic_Cutout_Decor.png', 6),
  ('pillows', 'Pillows', 'custom-acrylic', 'custom-enquiry', '/__l5e/assets-v1/d572a7eb-29b2-42a8-bef0-8a3130cfa12a/Custom_Pillows.png', 7),
  ('photo-albums', 'Photo Albums', 'custom-acrylic', 'custom-enquiry', '/__l5e/assets-v1/3f948716-3636-432e-b7d7-781b734db3a3/Photo_Albums.png', 8),
  ('luggage-tags', 'Luggage Tags', 'custom-acrylic', 'custom-enquiry', '/__l5e/assets-v1/c6fd8c38-c53c-4f1f-ac11-130374638a5b/Luggage_tags.png', 9),
  ('acrylic-monogram', 'Acrylic Monogram', 'custom-acrylic', 'custom-enquiry', '/__l5e/assets-v1/c35a6620-d433-45a8-9a52-a64bc7dafe6c/Acrylic_Monogram.png', 10),
  ('acrylic-desk-photo', 'Acrylic Desk Photo', 'custom-acrylic', 'custom-enquiry', '/__l5e/assets-v1/09a800d0-1621-4c72-84a8-6f74cd3509b2/Acrylic_Desk_Photos.png', 11),
  ('hoodies', 'Hoodies', 'corporate-gifting', 'bulk', '/__l5e/assets-v1/ab6c0349-cee4-492f-a0bc-64f0ea46d1f8/Hoodies.png', 12),
  ('tshirt', 'Tshirt', 'corporate-gifting', 'bulk', '/__l5e/assets-v1/9567cc5a-3577-4716-90b1-e4fcc4ffcc95/T_Shirt.png', 13),
  ('laptop-bag', 'Laptop Bag', 'corporate-gifting', 'bulk', '/__l5e/assets-v1/48f29a0b-60a5-4dae-8cc7-2a05fda366f4/Laptop_Bags.png', 14),
  ('water-bottle', 'Water Bottle', 'corporate-gifting', 'bulk', '/__l5e/assets-v1/5e2a7dba-2c92-4c91-924e-96ba51cdba72/Cup_Waterbottle.png', 15),
  ('pen-drive', 'Pen drive', 'corporate-gifting', 'bulk', '/__l5e/assets-v1/21b6722c-95f8-4a91-810f-c54274e5fee7/Pen_Drives.png', 16),
  ('cap', 'Cap', 'corporate-gifting', 'bulk', '/__l5e/assets-v1/fb83ba03-db1d-4e42-81c4-31f0d0ed2a87/Cap.png', 17),
  ('travel-duffle-bag', 'Travel Duffle bag', 'corporate-gifting', 'bulk', '/__l5e/assets-v1/2e67eca2-c18c-4cd1-8235-2a0bf0bfcb8a/Travel_Bag.png', 18),
  ('tote-bag', 'Tote bag', 'corporate-gifting', 'bulk', '/__l5e/assets-v1/5cb4d09f-67ab-420e-82a2-6f86654da268/Tote_Bag.png', 19),
  ('umbrella', 'Umbrella', 'corporate-gifting', 'bulk', '/__l5e/assets-v1/bf8e5244-c585-4987-8e1b-709ac0dd338c/Umbrella.png', 20),
  ('candle', 'Premium Candle', 'return-gifts', 'bulk', '/__l5e/assets-v1/5631dc5a-29bd-4a80-8d56-e6d695ec8519/Premium_Candle.png', 21),
  ('container', 'Lunch Container', 'return-gifts', 'bulk', '/__l5e/assets-v1/920c8f63-01a5-43bf-a52f-33ea39caf548/Lunch_Container.png', 22),
  ('plant', 'Potted Plant', 'return-gifts', 'bulk', '/__l5e/assets-v1/e3cccc14-f31a-4f70-8349-8532e8409a32/Potted_Plant.png', 23),
  ('sweet-box', 'Sweet Box', 'return-gifts', 'bulk', '/__l5e/assets-v1/9e8a91cb-6333-4f06-add5-9304d78538cf/Sweet_Box.png', 24),
  ('perfume', 'Perfume', 'return-gifts', 'bulk', '/__l5e/assets-v1/de2cc7e9-5f42-43a9-8b3c-1948b994f880/Perfume.png', 25),
  ('jute-bag', 'Jute Bag', 'return-gifts', 'bulk', '/__l5e/assets-v1/88c38289-eb24-41a2-97c0-26f5abef2a4c/Jute_Bag.png', 26);

INSERT INTO public.product_pricing (product_slug, base, framed, shape, size, thickness, text_price)
SELECT
  slug,
  CASE slug WHEN 'framed-acrylic-photo' THEN 1699 WHEN 'wall-clocks' THEN 1899 ELSE 1299 END,
  CASE slug WHEN 'wall-clocks' THEN 550 ELSE 450 END,
  '{"rectangle":0,"rounded":100,"square":0,"circle":200,"oval":200,"arch":200,"heart":250,"triangle":200,"hexagon":250,"pentagon":250,"octagon":250,"diamond":250,"star":300}'::jsonb,
  '{"12 x 9":0,"16 x 12":400,"18 x 12":650,"21 x 15":1100,"30 x 20":2200}'::jsonb,
  '{"3 mm":0,"5 mm":300,"8 mm":700}'::jsonb,
  150
FROM public.products;

INSERT INTO public.site_content (key, value) VALUES
  ('hero_slides', '[{"image_slot":"hero-1","tagline":"More than Decor. It''s Personal","alt":"Wall of framed family photographs","light":false},{"image_slot":"hero-2","tagline":"Show Appreciation in the right way!","alt":"Row of golden trophies and awards","light":false},{"image_slot":"hero-3","tagline":"Find the right gift for every story","alt":"Gift boxes tied with ribbons on a red backdrop","light":true}]'::jsonb),
  ('testimonial_groups', '[{"id":"acrylic-photos","title":"Acrylic Photos","body":"Capture every smile with our crystal-clear acrylic prints polished, vivid, and built to last for the moments you''ll always want to revisit.","videos":["/__l5e/assets-v1/f5a612a3-96d5-42e6-9a8e-9e72fe193591/3.mp4","/__l5e/assets-v1/93017821-82dd-4193-b7ce-6af534bb25af/4.mp4","/__l5e/assets-v1/b8192789-fa1f-4404-b79d-5f6bfdc64716/10.mp4","/__l5e/assets-v1/dcc9e317-eb4b-4a37-9556-dbcd6ff6f4b9/32.mp4","/__l5e/assets-v1/5e97db19-756b-4f24-a8ce-609ba80042fb/34.mp4","/__l5e/assets-v1/c5857ee7-2c81-48c9-84a1-2da196cbbd19/33.mp4"]},{"id":"acrylic-clear-photos","title":"Acrylic Clear Photos","body":"Layered transparency, perfect colour fidelity, and a tactile finish that makes every photograph feel like an heirloom.","videos":["/__l5e/assets-v1/2b15a716-b03a-48ab-b116-9e67efb12b5d/15.mp4","/__l5e/assets-v1/de9bcf7a-8151-4758-b14f-3f6d1de3f503/16.mp4","/__l5e/assets-v1/0c58d717-2964-4f3c-a0a7-f0a5cdafdcd1/20.mp4","/__l5e/assets-v1/7bcb6b25-4a88-42b0-9120-1ff92f8265b7/29.mp4","/__l5e/assets-v1/fc27df25-2d0c-473e-aec6-4e5f72c45476/30.mp4","/__l5e/assets-v1/aaaf1876-427f-4d76-83d9-197e02816bad/31.mp4"]},{"id":"creative-gifts","title":"Creative Gifts","body":"Thoughtful, personalised gifts crafted to surprise — designed around the people and stories that matter most to you.","videos":["/__l5e/assets-v1/d744a14e-ba64-41f5-bc11-c9fe9695c060/24.mp4","/__l5e/assets-v1/63c79011-e05d-469e-8ed6-12eb2dae2da7/14.mp4","/__l5e/assets-v1/5a2d3d04-751b-450a-b853-5d155b41df8a/23.mp4","/__l5e/assets-v1/53898e5d-3916-4597-a4c4-d0612caba351/7.mp4","/__l5e/assets-v1/cdf1e103-dc4c-4b8c-9301-ccdac97301b3/9.mp4","/__l5e/assets-v1/8d69b6f2-0663-4319-938f-29aa2ae6817a/22.mp4"]},{"id":"name-decors","title":"Name Decors","body":"Make any door, desk, or doorway truly yours with a custom nameplate finished in vibrant detail.","videos":["/__l5e/assets-v1/b20313cf-fcbf-4a44-bf61-2f139799bc25/28.mp4","/__l5e/assets-v1/2cf88894-4c2f-429a-86ec-13716a7a1a1a/6.mp4","/__l5e/assets-v1/5be23893-ab10-4f54-b747-eac4a2045175/8.mp4","/__l5e/assets-v1/801c199a-ac2b-47b6-b124-e3cd97fb2e43/12.mp4","/__l5e/assets-v1/5bb2424d-0531-4cb1-ad5f-7c7a81385afe/5.mp4","/__l5e/assets-v1/053eec9d-6225-4f3a-a99e-5402a66af7e7/35.mp4"]}]'::jsonb),
  ('reviews', '[{"name":"Priya S., Chennai","quote":"I ordered a customized birthday hamper from BCUBE for my sister, and it was absolutely beautiful. The packaging, personalization, and quality were beyond my expectations. Highly recommended!"},{"name":"Karthik R., Coimbatore","quote":"BCUBE handled our corporate gifting requirements perfectly. The team was professional, delivered on time, and every gift looked premium. Our clients were genuinely impressed."},{"name":"Divya M., Madurai","quote":"Their creativity is what makes BCUBE different. They suggested unique gift ideas that I hadn''t even thought of. The final product was elegant and memorable."},{"name":"Arun Kumar V., Tiruchirappalli","quote":"Excellent customer service! They patiently accommodated all my customization requests and delivered exactly what I wanted. The quality was outstanding."},{"name":"Lakshmi N., Salem","quote":"I ordered a wedding return gift package, and every guest appreciated it. The attention to detail and finishing were exceptional. Thank you, BCUBE!"},{"name":"Suresh P., Chennai","quote":"We''ve been ordering festive gifts for our employees from BCUBE for two years now. They never disappoint. Great quality, timely delivery, and excellent support."},{"name":"Keerthana R., Erode","quote":"The personalized gifts were beautifully made and arrived in perfect condition. It made our family celebration even more special. I''ll definitely order again."},{"name":"Harish K., Tirunelveli","quote":"From placing the order to receiving the package, everything was smooth. BCUBE''s team kept me updated throughout, and the final product exceeded my expectations."},{"name":"Nandhini S., Vellore","quote":"I loved the premium look and feel of the gift box. The personalization was flawless, and the recipient absolutely loved it. BCUBE truly delivers happiness."},{"name":"Praveen Raj M., Thanjavur","quote":"If you''re looking for creative and customized gifting, BCUBE is the best choice. Their designs are unique, pricing is reasonable, and the overall experience is excellent."}]'::jsonb);

-- ---------------------------------------------------------------------------
-- from 20260814091514_190b39df-d11e-443e-abd4-b703216d411a.sql
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

DROP POLICY "products public read" ON public.products;
CREATE POLICY "products anon read" ON public.products FOR SELECT TO anon USING (published);
CREATE POLICY "products auth read" ON public.products FOR SELECT TO authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- from 20260814092139_ab522b13-1077-4aab-807d-893bd8fe891d.sql
-- ---------------------------------------------------------------------------
GRANT INSERT ON public.enquiries TO anon, authenticated;
CREATE POLICY "enquiries public submit" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

GRANT INSERT ON public.orders TO authenticated;
CREATE POLICY "orders own insert" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

GRANT INSERT ON public.order_items TO authenticated;
CREATE POLICY "order items own insert" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- from 20260817055404_1f8c0795-4495-45e7-beab-b40daae98f76.sql
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- ---------------------------------------------------------------------------
-- from 20260817055459_bc7b2af1-3c1b-4af0-b455-4307ce12671f.sql
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- from 20260818103709_da64802a-41ea-44e4-8778-cfd66520253e.sql
-- ---------------------------------------------------------------------------
CREATE POLICY "product uploads insert" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'product-uploads');
CREATE POLICY "product uploads read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'product-uploads');
CREATE POLICY "product uploads admin manage" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'product-uploads' AND private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (bucket_id = 'product-uploads' AND private.has_role(auth.uid(), 'admin'::app_role));


-- ---------------------------------------------------------------------------
-- Storage buckets
--   site-media      public  — all site images and videos
--   product-uploads private — customer artwork uploaded in the configurator
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true),
       ('product-uploads', 'product-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- site-media: anyone can read, only admins can change files.
CREATE POLICY "site media public read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-media');
CREATE POLICY "site media admin write" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'site-media' AND private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'site-media' AND private.has_role(auth.uid(), 'admin'::public.app_role));
