-- Create lawyers table
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

-- Create lawyer specializations table
CREATE TABLE IF NOT EXISTS lawyer_specializations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lawyer_specialization_mapping table
CREATE TABLE IF NOT EXISTS lawyer_specialization_mapping (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lawyer_id UUID REFERENCES lawyers(id) ON DELETE CASCADE,
  specialization_id UUID REFERENCES lawyer_specializations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lawyer_id, specialization_id)
);

-- Create consultation requests table
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

-- Create lawyer reviews table
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

-- Enable RLS
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_specialization_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lawyers
CREATE POLICY "Lawyers are viewable by everyone" ON lawyers FOR SELECT USING (true);
CREATE POLICY "Lawyers can update own profile" ON lawyers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Lawyers can insert own profile" ON lawyers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for lawyer_specializations
CREATE POLICY "Specializations are viewable by everyone" ON lawyer_specializations FOR SELECT USING (true);

-- RLS Policies for lawyer_specialization_mapping
CREATE POLICY "Specialization mapping is viewable by everyone" ON lawyer_specialization_mapping FOR SELECT USING (true);
CREATE POLICY "Lawyers can manage own specializations" ON lawyer_specialization_mapping FOR ALL USING (
  EXISTS (SELECT 1 FROM lawyers WHERE lawyers.id = lawyer_specialization_mapping.lawyer_id AND lawyers.user_id = auth.uid())
);

-- RLS Policies for consultation_requests
CREATE POLICY "Users can view own consultation requests" ON consultation_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Lawyers can view requests for them" ON consultation_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM lawyers WHERE lawyers.id = consultation_requests.lawyer_id AND lawyers.user_id = auth.uid())
);
CREATE POLICY "Users can create consultation requests" ON consultation_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own requests" ON consultation_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Lawyers can update requests for them" ON consultation_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM lawyers WHERE lawyers.id = consultation_requests.lawyer_id AND lawyers.user_id = auth.uid())
);

-- RLS Policies for lawyer_reviews
CREATE POLICY "Reviews are viewable by everyone" ON lawyer_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed consultations" ON lawyer_reviews FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM consultation_requests WHERE consultation_requests.id = lawyer_reviews.consultation_request_id AND consultation_requests.status = 'completed')
);

-- Create indexes for better performance
CREATE INDEX idx_lawyers_location ON lawyers(location);
CREATE INDEX idx_lawyers_practice_areas ON lawyers USING GIN(practice_areas);
CREATE INDEX idx_lawyers_rating ON lawyers(rating DESC);
CREATE INDEX idx_consultation_requests_user_id ON consultation_requests(user_id);
CREATE INDEX idx_consultation_requests_lawyer_id ON consultation_requests(lawyer_id);
CREATE INDEX idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX idx_lawyer_reviews_lawyer_id ON lawyer_reviews(lawyer_id);

-- Function to update lawyer rating
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

-- Trigger to update lawyer rating when review is added
CREATE TRIGGER update_lawyer_rating_trigger
  AFTER INSERT ON lawyer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_lawyer_rating();
