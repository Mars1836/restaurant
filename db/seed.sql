-- =============================================================================
-- Bản tương đương: ../supabase/seed.sql (Supabase CLI `db reset`)
--
-- Seed dữ liệu mẫu (chi nhánh + món ăn) — chạy SAU schema.sql / migration
-- Có thể chạy lại an toàn nhờ ON CONFLICT (idempotent).
-- =============================================================================

INSERT INTO public.branches (id, name, address, phone, open_hours, sort_order)
VALUES
  (
    'cn-q1',
    'Saigon Gourmet — Quận 1',
    '123 Nguyễn Huệ, Quận 1, TP.HCM',
    '1900 6868',
    '10:00 – 22:00',
    1
  ),
  (
    'cn-q7',
    'Saigon Gourmet — Quận 7',
    '88 Nguyễn Thị Thập, Quận 7, TP.HCM',
    '1900 6868',
    '10:00 – 22:00',
    2
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  open_hours = EXCLUDED.open_hours,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.menu_items (
  slug,
  name,
  category,
  category_label,
  price,
  tags,
  image_url,
  description,
  is_hot,
  sort_order
)
VALUES
  (
    'bo-bit-tet-sot-tieu-den',
    'Bò bít tết sốt tiêu đen',
    'mon-chinh',
    'Món chính',
    289000,
    '["bò", "bít tết", "bán chạy"]'::jsonb,
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200',
    'Thịt bò mềm, sốt tiêu đen đậm vị, ăn kèm khoai tây nghiền.',
    true,
    1
  ),
  (
    'ca-hoi-ap-chao-sot-chanh-day',
    'Cá hồi áp chảo sốt chanh dây',
    'mon-chinh',
    'Món chính',
    259000,
    '["cá hồi", "healthy"]'::jsonb,
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200',
    'Cá hồi tươi áp chảo vừa tới, phục vụ cùng rau củ nướng.',
    true,
    2
  ),
  (
    'pizza-hai-san-pho-mai',
    'Pizza hải sản phô mai',
    'mon-chinh',
    'Món chính',
    219000,
    '["pizza", "hải sản"]'::jsonb,
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200',
    'Đế bánh giòn mỏng, nhân tôm mực và phô mai mozzarella.',
    false,
    3
  ),
  (
    'salad-ca-ngu-olive',
    'Salad cá ngừ olive',
    'khai-vi',
    'Khai vị',
    129000,
    '["salad", "healthy"]'::jsonb,
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=1200',
    'Rau tươi trộn dầu olive, cá ngừ ngon, thanh mát.',
    false,
    4
  ),
  (
    'soup-bi-do-kem-banh-mi-toi',
    'Súp bí đỏ kèm bánh mì tỏi',
    'khai-vi',
    'Khai vị',
    99000,
    '["soup", "bánh mì tỏi"]'::jsonb,
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200',
    'Súp bí đỏ béo nhẹ, ăn kèm bánh mì tỏi nóng giòn.',
    true,
    5
  ),
  (
    'tiramisu-ca-phe',
    'Tiramisu cà phê',
    'trang-mieng',
    'Tráng miệng',
    89000,
    '["bánh ngọt", "tráng miệng"]'::jsonb,
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200',
    'Bánh tiramisu mềm mịn, vị cà phê nhẹ và cacao.',
    true,
    6
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  is_hot = EXCLUDED.is_hot,
  sort_order = EXCLUDED.sort_order;
