-- Comprehensive Lawyer Database Setup Script
-- Run this in your Supabase SQL Editor to set up the complete lawyer directory

-- 1. Create lawyers table
CREATE TABLE IF NOT EXISTS lawyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profile_image TEXT,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  bar_council_number TEXT UNIQUE,
  practice_areas TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  location TEXT,
  consultation_fee INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create lawyer specializations table
CREATE TABLE IF NOT EXISTS lawyer_specializations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create lawyer_specialization_mapping table
CREATE TABLE IF NOT EXISTS lawyer_specialization_mapping (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lawyer_id UUID REFERENCES lawyers(id) ON DELETE CASCADE,
  specialization_id UUID REFERENCES lawyer_specializations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lawyer_id, specialization_id)
);

-- 4. Create consultation requests table
CREATE TABLE IF NOT EXISTS consultation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lawyer_id UUID REFERENCES lawyers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_date TIMESTAMP WITH TIME ZONE,
  preferred_time TEXT,
  consultation_type TEXT CHECK (consultation_type IN ('online', 'in-person', 'phone')) DEFAULT 'online',
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create lawyer reviews table
CREATE TABLE IF NOT EXISTS lawyer_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lawyer_id UUID REFERENCES lawyers(id) ON DELETE CASCADE,
  consultation_request_id UUID REFERENCES consultation_requests(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lawyer_id, consultation_request_id)
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_specialization_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_reviews ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for lawyers
CREATE POLICY "Lawyers are viewable by everyone" ON lawyers FOR SELECT USING (true);
CREATE POLICY "Lawyers can update own profile" ON lawyers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Lawyers can insert own profile" ON lawyers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Create RLS Policies for lawyer_specializations
CREATE POLICY "Specializations are viewable by everyone" ON lawyer_specializations FOR SELECT USING (true);

-- 9. Create RLS Policies for lawyer_specialization_mapping
CREATE POLICY "Specialization mapping is viewable by everyone" ON lawyer_specialization_mapping FOR SELECT USING (true);
CREATE POLICY "Lawyers can manage own specializations" ON lawyer_specialization_mapping FOR ALL USING (
  EXISTS (SELECT 1 FROM lawyers WHERE lawyers.id = lawyer_specialization_mapping.lawyer_id AND lawyers.user_id = auth.uid())
);

-- 10. Create RLS Policies for consultation_requests
CREATE POLICY "Users can view own consultation requests" ON consultation_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Lawyers can view requests for them" ON consultation_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM lawyers WHERE lawyers.id = consultation_requests.lawyer_id AND lawyers.user_id = auth.uid())
);
CREATE POLICY "Users can create consultation requests" ON consultation_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own requests" ON consultation_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Lawyers can update requests for them" ON consultation_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM lawyers WHERE lawyers.id = consultation_requests.lawyer_id AND lawyers.user_id = auth.uid())
);

-- 11. Create RLS Policies for lawyer_reviews
CREATE POLICY "Reviews are viewable by everyone" ON lawyer_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed consultations" ON lawyer_reviews FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM consultation_requests WHERE consultation_requests.id = lawyer_reviews.consultation_request_id AND consultation_requests.status = 'completed')
);

-- 12. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lawyers_location ON lawyers(location);
CREATE INDEX IF NOT EXISTS idx_lawyers_practice_areas ON lawyers USING GIN(practice_areas);
CREATE INDEX IF NOT EXISTS idx_lawyers_rating ON lawyers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_user_id ON consultation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_lawyer_id ON consultation_requests(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_lawyer_reviews_lawyer_id ON lawyer_reviews(lawyer_id);

-- 13. Create function to update lawyer rating
CREATE OR REPLACE FUNCTION update_lawyer_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lawyers 
  SET 
    rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM lawyer_reviews WHERE lawyer_id = NEW.lawyer_id),
    total_reviews = (SELECT COUNT(*) FROM lawyer_reviews WHERE lawyer_id = NEW.lawyer_id)
  WHERE id = NEW.lawyer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Create trigger to update lawyer rating when review is added
DROP TRIGGER IF EXISTS update_lawyer_rating_trigger ON lawyer_reviews;
CREATE TRIGGER update_lawyer_rating_trigger
  AFTER INSERT ON lawyer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_lawyer_rating();

-- 15. Insert lawyer specializations
INSERT INTO lawyer_specializations (name, description, icon) VALUES
('Criminal Law', 'Defense and prosecution in criminal cases', 'Shield'),
('Corporate Law', 'Business law, contracts, and corporate governance', 'Building'),
('Family Law', 'Divorce, custody, marriage, and family disputes', 'Heart'),
('Property Law', 'Real estate transactions and property disputes', 'Home'),
('Labor Law', 'Employment rights and workplace disputes', 'Users'),
('Tax Law', 'Tax planning, compliance, and disputes', 'Calculator'),
('Constitutional Law', 'Fundamental rights and constitutional matters', 'Scale'),
('Intellectual Property', 'Patents, trademarks, and copyrights', 'Lightbulb'),
('Immigration Law', 'Visa, citizenship, and immigration matters', 'Globe'),
('Consumer Protection', 'Consumer rights and product liability', 'ShoppingCart'),
('Environmental Law', 'Environmental regulations and compliance', 'Leaf'),
('Cyber Law', 'Internet crimes and digital privacy', 'Monitor')
ON CONFLICT (name) DO NOTHING;

-- 16. Insert sample lawyers (only if table is empty)
INSERT INTO lawyers (user_id, full_name, email, phone, bio, experience_years, bar_council_number, practice_areas, languages, location, consultation_fee, is_verified, is_available) 
SELECT 
  gen_random_uuid(), 
  'Adv. Priya Sharma', 
  'priya.sharma@example.com', 
  '+91 98765 43210', 
  'Experienced criminal defense lawyer with 12 years of practice. Specialized in white-collar crimes and corporate fraud cases.', 
  12, 
  'BCI/2011/12345', 
  ARRAY['Criminal Law', 'Corporate Law'], 
  ARRAY['Hindi', 'English', 'Punjabi'], 
  'New Delhi', 
  2500, 
  true, 
  true
WHERE NOT EXISTS (SELECT 1 FROM lawyers LIMIT 1);

INSERT INTO lawyers (user_id, full_name, email, phone, bio, experience_years, bar_council_number, practice_areas, languages, location, consultation_fee, is_verified, is_available) 
SELECT 
  gen_random_uuid(), 
  'Adv. Rajesh Kumar', 
  'rajesh.kumar@example.com', 
  '+91 87654 32109', 
  'Family law specialist helping families navigate divorce, custody, and property disputes with compassion and expertise.', 
  8, 
  'BCI/2015/67890', 
  ARRAY['Family Law', 'Property Law'], 
  ARRAY['Hindi', 'English', 'Bengali'], 
  'Mumbai', 
  2000, 
  true, 
  true
WHERE NOT EXISTS (SELECT 1 FROM lawyers WHERE full_name = 'Adv. Rajesh Kumar');

INSERT INTO lawyers (user_id, full_name, email, phone, bio, experience_years, bar_council_number, practice_areas, languages, location, consultation_fee, is_verified, is_available) 
SELECT 
  gen_random_uuid(), 
  'Adv. Meera Patel', 
  'meera.patel@example.com', 
  '+91 76543 21098', 
  'Corporate lawyer with extensive experience in mergers, acquisitions, and startup legal matters.', 
  15, 
  'BCI/2008/11111', 
  ARRAY['Corporate Law', 'Intellectual Property'], 
  ARRAY['Hindi', 'English', 'Gujarati'], 
  'Bangalore', 
  3000, 
  true, 
  true
WHERE NOT EXISTS (SELECT 1 FROM lawyers WHERE full_name = 'Adv. Meera Patel');

INSERT INTO lawyers (user_id, full_name, email, phone, bio, experience_years, bar_council_number, practice_areas, languages, location, consultation_fee, is_verified, is_available) 
SELECT 
  gen_random_uuid(), 
  'Adv. Arjun Singh', 
  'arjun.singh@example.com', 
  '+91 65432 10987', 
  'Labor law expert fighting for workers rights and handling employment disputes across various industries.', 
  10, 
  'BCI/2013/22222', 
  ARRAY['Labor Law', 'Constitutional Law'], 
  ARRAY['Hindi', 'English', 'Marathi'], 
  'Pune', 
  1800, 
  true, 
  true
WHERE NOT EXISTS (SELECT 1 FROM lawyers WHERE full_name = 'Adv. Arjun Singh');

INSERT INTO lawyers (user_id, full_name, email, phone, bio, experience_years, bar_council_number, practice_areas, languages, location, consultation_fee, is_verified, is_available) 
SELECT 
  gen_random_uuid(), 
  'Adv. Kavya Reddy', 
  'kavya.reddy@example.com', 
  '+91 54321 09876', 
  'Tax law specialist helping individuals and businesses with tax planning, compliance, and dispute resolution.', 
  6, 
  'BCI/2017/33333', 
  ARRAY['Tax Law', 'Corporate Law'], 
  ARRAY['Hindi', 'English', 'Telugu'], 
  'Hyderabad', 
  2200, 
  true, 
  true
WHERE NOT EXISTS (SELECT 1 FROM lawyers WHERE full_name = 'Adv. Kavya Reddy');

INSERT INTO lawyers (user_id, full_name, email, phone, bio, experience_years, bar_council_number, practice_areas, languages, location, consultation_fee, is_verified, is_available) 
SELECT 
  gen_random_uuid(), 
  'Adv. Vikram Joshi', 
  'vikram.joshi@example.com', 
  '+91 43210 98765', 
  'Property law expert with deep knowledge of real estate transactions, land disputes, and property documentation.', 
  14, 
  'BCI/2009/44444', 
  ARRAY['Property Law', 'Constitutional Law'], 
  ARRAY['Hindi', 'English', 'Marathi'], 
  'Mumbai', 
  2800, 
  true, 
  true
WHERE NOT EXISTS (SELECT 1 FROM lawyers WHERE full_name = 'Adv. Vikram Joshi');

-- 17. Map lawyers to their specializations
INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Priya Sharma' AND s.name IN ('Criminal Law', 'Corporate Law')
ON CONFLICT DO NOTHING;

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Rajesh Kumar' AND s.name IN ('Family Law', 'Property Law')
ON CONFLICT DO NOTHING;

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Meera Patel' AND s.name IN ('Corporate Law', 'Intellectual Property')
ON CONFLICT DO NOTHING;

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Arjun Singh' AND s.name IN ('Labor Law', 'Constitutional Law')
ON CONFLICT DO NOTHING;

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Kavya Reddy' AND s.name IN ('Tax Law', 'Corporate Law')
ON CONFLICT DO NOTHING;

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Vikram Joshi' AND s.name IN ('Property Law', 'Constitutional Law')
ON CONFLICT DO NOTHING;

-- 18. Add some sample reviews
INSERT INTO lawyer_reviews (user_id, lawyer_id, rating, review_text)
SELECT 
  gen_random_uuid(),
  l.id,
  5,
  'Excellent lawyer with deep knowledge of criminal law. Highly recommended!'
FROM lawyers l 
WHERE l.full_name = 'Adv. Priya Sharma'
ON CONFLICT DO NOTHING;

INSERT INTO lawyer_reviews (user_id, lawyer_id, rating, review_text)
SELECT 
  gen_random_uuid(),
  l.id,
  4,
  'Very helpful in family law matters. Professional and compassionate.'
FROM lawyers l 
WHERE l.full_name = 'Adv. Rajesh Kumar'
ON CONFLICT DO NOTHING;

-- 19. Verify the setup
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as total_lawyers FROM lawyers;
SELECT COUNT(*) as total_specializations FROM lawyer_specializations;
SELECT COUNT(*) as total_mappings FROM lawyer_specialization_mapping;
