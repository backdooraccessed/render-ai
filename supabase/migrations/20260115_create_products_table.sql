-- Products table for shoppable staging
-- Stores furniture products from various retailers with affiliate links

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  retailer TEXT NOT NULL, -- 'wayfair', 'amazon', 'ikea', 'cb2', etc.

  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  sale_price DECIMAL(10, 2),

  -- Categorization
  category TEXT NOT NULL, -- 'sofa', 'chair', 'table', 'rug', 'lamp', 'plant', 'decor'
  subcategory TEXT, -- 'coffee_table', 'dining_table', 'side_table'
  room_type TEXT[], -- ['living_room', 'bedroom', 'dining_room', 'office']

  -- Style tags for AI matching
  styles TEXT[] NOT NULL, -- ['modern', 'scandinavian', 'industrial', 'bohemian', 'traditional', 'minimalist']
  colors TEXT[], -- ['gray', 'beige', 'white', 'blue', 'green', 'brown', 'black']
  materials TEXT[], -- ['wood', 'metal', 'fabric', 'leather', 'velvet', 'rattan']

  -- Dimensions (in inches)
  width DECIMAL(6, 2),
  height DECIMAL(6, 2),
  depth DECIMAL(6, 2),

  -- Images
  image_url TEXT NOT NULL, -- Main product image
  image_cutout_url TEXT, -- Transparent PNG for AI placement
  thumbnail_url TEXT,
  additional_images TEXT[], -- Array of additional image URLs

  -- Affiliate links
  product_url TEXT NOT NULL, -- Original product page
  affiliate_url TEXT, -- URL with affiliate tracking code
  affiliate_code TEXT, -- Our affiliate/tracking code

  -- Retailer-specific IDs
  external_id TEXT, -- SKU or product ID from retailer

  -- Metadata
  rating DECIMAL(2, 1), -- 0.0 to 5.0
  review_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,

  -- AI matching data (requires pgvector extension)
  -- embedding VECTOR(1536), -- For semantic search/matching - enable later

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ, -- When price/stock was last updated

  -- Constraints
  CONSTRAINT valid_category CHECK (category IN ('sofa', 'chair', 'table', 'rug', 'lamp', 'plant', 'decor', 'storage', 'bed', 'desk', 'mirror', 'curtain', 'art')),
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Indexes for common queries
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_retailer ON public.products(retailer);
CREATE INDEX idx_products_styles ON public.products USING GIN(styles);
CREATE INDEX idx_products_room_type ON public.products USING GIN(room_type);
CREATE INDEX idx_products_colors ON public.products USING GIN(colors);
CREATE INDEX idx_products_price ON public.products(price);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable (for displaying in staged images)
CREATE POLICY "Products are publicly readable" ON public.products
  FOR SELECT USING (true);

-- Only admins can modify products (we'll handle this via service role)
CREATE POLICY "Service role can manage products" ON public.products
  FOR ALL USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Product clicks tracking (for analytics and commission tracking)
CREATE TABLE IF NOT EXISTS public.product_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  generation_id UUID REFERENCES public.generations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10, 2)
);

CREATE INDEX idx_product_clicks_product ON public.product_clicks(product_id);
CREATE INDEX idx_product_clicks_user ON public.product_clicks(user_id);
CREATE INDEX idx_product_clicks_date ON public.product_clicks(clicked_at);

-- Enable RLS on clicks
ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clicks" ON public.product_clicks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create clicks" ON public.product_clicks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- View for product statistics
CREATE OR REPLACE VIEW public.product_stats AS
SELECT
  p.id,
  p.name,
  p.retailer,
  p.category,
  p.price,
  COUNT(pc.id) as click_count,
  SUM(CASE WHEN pc.converted THEN 1 ELSE 0 END) as conversion_count,
  SUM(COALESCE(pc.conversion_value, 0)) as total_revenue
FROM public.products p
LEFT JOIN public.product_clicks pc ON p.id = pc.product_id
GROUP BY p.id;
