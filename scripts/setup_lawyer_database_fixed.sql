-- Fixed Lawyer Database Setup Script
-- This script works with your existing lawyers table structure

-- 1. First, let's check your existing table structure
-- Your existing lawyers table has: id, name, specialization, experience_years, location

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

-- 5. Create lawyer reviews table (with optional user_id)
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

-- 6. Add missing columns to existing lawyers table
ALTER TABLE lawyers 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS bar_council_number TEXT,
ADD COLUMN IF NOT EXISTS practice_areas TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS consultation_fee INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 7. Rename 'name' column to 'full_name' if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lawyers' AND column_name = 'name') THEN
        ALTER TABLE lawyers RENAME COLUMN name TO full_name;
    END IF;
END $$;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_specialization_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_reviews ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS Policies for lawyers
CREATE POLICY "Lawyers are viewable by everyone" ON lawyers FOR SELECT USING (true);

-- 10. Create RLS Policies for lawyer_specializations
CREATE POLICY "Specializations are viewable by everyone" ON lawyer_specializations FOR SELECT USING (true);

-- 11. Create RLS Policies for lawyer_specialization_mapping
CREATE POLICY "Specialization mapping is viewable by everyone" ON lawyer_specialization_mapping FOR SELECT USING (true);

-- 12. Create RLS Policies for consultation_requests
CREATE POLICY "Users can view own consultation requests" ON consultation_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create consultation requests" ON consultation_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own requests" ON consultation_requests FOR UPDATE USING (auth.uid() = user_id);

-- 13. Create RLS Policies for lawyer_reviews
CREATE POLICY "Reviews are viewable by everyone" ON lawyer_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed consultations" ON lawyer_reviews FOR INSERT WITH CHECK (
  (auth.uid() = user_id OR user_id IS NULL) AND 
  EXISTS (SELECT 1 FROM consultation_requests WHERE consultation_requests.id = lawyer_reviews.consultation_request_id AND consultation_requests.status = 'completed')
);

-- 14. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lawyers_location ON lawyers(location);
CREATE INDEX IF NOT EXISTS idx_lawyers_practice_areas ON lawyers USING GIN(practice_areas);
CREATE INDEX IF NOT EXISTS idx_lawyers_rating ON lawyers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_user_id ON consultation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_lawyer_id ON consultation_requests(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_lawyer_reviews_lawyer_id ON lawyer_reviews(lawyer_id);

-- 15. Create function to update lawyer rating
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

-- 16. Create trigger to update lawyer rating when review is added
DROP TRIGGER IF EXISTS update_lawyer_rating_trigger ON lawyer_reviews;
CREATE TRIGGER update_lawyer_rating_trigger
  AFTER INSERT ON lawyer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_lawyer_rating();

-- 17. Insert lawyer specializations
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

-- 18. Update existing lawyers with additional information (using proper CTE approach)
WITH lawyer_updates AS (
  SELECT 
    l.id,
    l.full_name,
    l.specialization,
    ROW_NUMBER() OVER (ORDER BY l.full_name) as rn
  FROM lawyers l
)
UPDATE lawyers l SET 
  email = CASE 
    WHEN l.full_name = 'Adv. Priya Sharma' THEN 'priya.sharma@example.com'
    WHEN l.full_name = 'Adv. Rajesh Kumar' THEN 'rajesh.kumar@example.com'
    WHEN l.full_name = 'Adv. Meera Patel' THEN 'meera.patel@example.com'
    WHEN l.full_name = 'Adv. Arjun Singh' THEN 'arjun.singh@example.com'
    WHEN l.full_name = 'Adv. Kavya Reddy' THEN 'kavya.reddy@example.com'
    WHEN l.full_name = 'Adv. Vikram Joshi' THEN 'vikram.joshi@example.com'
    ELSE 'lawyer' || lu.rn || '@example.com'
  END,
  phone = CASE 
    WHEN l.full_name = 'Adv. Priya Sharma' THEN '+91 98765 43210'
    WHEN l.full_name = 'Adv. Rajesh Kumar' THEN '+91 87654 32109'
    WHEN l.full_name = 'Adv. Meera Patel' THEN '+91 76543 21098'
    WHEN l.full_name = 'Adv. Arjun Singh' THEN '+91 65432 10987'
    WHEN l.full_name = 'Adv. Kavya Reddy' THEN '+91 54321 09876'
    WHEN l.full_name = 'Adv. Vikram Joshi' THEN '+91 43210 98765'
    ELSE '+91 ' || LPAD(lu.rn::TEXT, 5, '0') || ' 00000'
  END,
  bio = CASE 
    WHEN l.full_name = 'Adv. Priya Sharma' THEN 'Experienced criminal defense lawyer with 12 years of practice. Specialized in white-collar crimes and corporate fraud cases.'
    WHEN l.full_name = 'Adv. Rajesh Kumar' THEN 'Family law specialist helping families navigate divorce, custody, and property disputes with compassion and expertise.'
    WHEN l.full_name = 'Adv. Meera Patel' THEN 'Corporate lawyer with extensive experience in mergers, acquisitions, and startup legal matters.'
    WHEN l.full_name = 'Adv. Arjun Singh' THEN 'Labor law expert fighting for workers rights and handling employment disputes across various industries.'
    WHEN l.full_name = 'Adv. Kavya Reddy' THEN 'Tax law specialist helping individuals and businesses with tax planning, compliance, and dispute resolution.'
    WHEN l.full_name = 'Adv. Vikram Joshi' THEN 'Property law expert with deep knowledge of real estate transactions, land disputes, and property documentation.'
    ELSE 'Experienced legal professional with expertise in various practice areas.'
  END,
  bar_council_number = 'BCI/2020/' || LPAD(lu.rn::TEXT, 5, '0'),
  practice_areas = CASE 
    WHEN l.full_name = 'Adv. Priya Sharma' THEN ARRAY['Criminal Law', 'Corporate Law']
    WHEN l.full_name = 'Adv. Rajesh Kumar' THEN ARRAY['Family Law', 'Property Law']
    WHEN l.full_name = 'Adv. Meera Patel' THEN ARRAY['Corporate Law', 'Intellectual Property']
    WHEN l.full_name = 'Adv. Arjun Singh' THEN ARRAY['Labor Law', 'Constitutional Law']
    WHEN l.full_name = 'Adv. Kavya Reddy' THEN ARRAY['Tax Law', 'Corporate Law']
    WHEN l.full_name = 'Adv. Vikram Joshi' THEN ARRAY['Property Law', 'Constitutional Law']
    ELSE ARRAY['General Law']
  END,
  languages = CASE 
    WHEN l.full_name = 'Adv. Priya Sharma' THEN ARRAY['Hindi', 'English', 'Punjabi']
    WHEN l.full_name = 'Adv. Rajesh Kumar' THEN ARRAY['Hindi', 'English', 'Bengali']
    WHEN l.full_name = 'Adv. Meera Patel' THEN ARRAY['Hindi', 'English', 'Gujarati']
    WHEN l.full_name = 'Adv. Arjun Singh' THEN ARRAY['Hindi', 'English', 'Marathi']
    WHEN l.full_name = 'Adv. Kavya Reddy' THEN ARRAY['Hindi', 'English', 'Telugu']
    WHEN l.full_name = 'Adv. Vikram Joshi' THEN ARRAY['Hindi', 'English', 'Marathi']
    ELSE ARRAY['Hindi', 'English']
  END,
  consultation_fee = CASE 
    WHEN l.full_name = 'Adv. Priya Sharma' THEN 2500
    WHEN l.full_name = 'Adv. Rajesh Kumar' THEN 2000
    WHEN l.full_name = 'Adv. Meera Patel' THEN 3000
    WHEN l.full_name = 'Adv. Arjun Singh' THEN 1800
    WHEN l.full_name = 'Adv. Kavya Reddy' THEN 2200
    WHEN l.full_name = 'Adv. Vikram Joshi' THEN 2800
    ELSE 2000
  END,
  is_verified = true,
  is_available = true
FROM lawyer_updates lu
WHERE l.id = lu.id;

-- 19. Add unique constraint to bar_council_number after populating data
ALTER TABLE lawyers ADD CONSTRAINT lawyers_bar_council_number_key UNIQUE (bar_council_number);

-- 20. Map lawyers to their specializations based on existing specialization column
INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE s.name = l.specialization
ON CONFLICT DO NOTHING;

-- 21. Add some sample reviews (without user_id to avoid foreign key constraint)
INSERT INTO lawyer_reviews (lawyer_id, rating, review_text)
SELECT 
  l.id,
  5,
  'Excellent lawyer with deep knowledge of ' || l.specialization || '. Highly recommended!'
FROM lawyers l 
WHERE l.full_name = 'Adv. Priya Sharma'
ON CONFLICT DO NOTHING;

INSERT INTO lawyer_reviews (lawyer_id, rating, review_text)
SELECT 
  l.id,
  4,
  'Very helpful in ' || l.specialization || ' matters. Professional and compassionate.'
FROM lawyers l 
WHERE l.full_name = 'Adv. Rajesh Kumar'
ON CONFLICT DO NOTHING;

-- 22. Verify the setup
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as total_lawyers FROM lawyers;
SELECT COUNT(*) as total_specializations FROM lawyer_specializations;
SELECT COUNT(*) as total_mappings FROM lawyer_specialization_mapping;

-- 23. Show the updated lawyers table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'lawyers' 
ORDER BY ordinal_position;
