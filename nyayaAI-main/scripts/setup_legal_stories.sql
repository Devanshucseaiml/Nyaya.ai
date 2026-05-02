-- Legal Stories Database Setup Script
-- This script creates tables for anonymous legal case sharing and community learning

-- 1. Create legal_stories table
CREATE TABLE IF NOT EXISTS legal_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  case_type TEXT NOT NULL,
  location TEXT,
  outcome TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create story_comments table
CREATE TABLE IF NOT EXISTS story_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES legal_stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES story_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT true,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create story_likes table
CREATE TABLE IF NOT EXISTS story_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES legal_stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

-- 4. Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES story_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- 5. Create story_categories table
CREATE TABLE IF NOT EXISTS story_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create story_category_mapping table
CREATE TABLE IF NOT EXISTS story_category_mapping (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES legal_stories(id) ON DELETE CASCADE,
  category_id UUID REFERENCES story_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, category_id)
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE legal_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_category_mapping ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies for legal_stories
CREATE POLICY "Stories are viewable by everyone" ON legal_stories FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create stories" ON legal_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stories" ON legal_stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON legal_stories FOR DELETE USING (auth.uid() = user_id);

-- 9. Create RLS Policies for story_comments
CREATE POLICY "Comments are viewable by everyone" ON story_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create comments" ON story_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON story_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON story_comments FOR DELETE USING (auth.uid() = user_id);

-- 10. Create RLS Policies for story_likes
CREATE POLICY "Story likes are viewable by everyone" ON story_likes FOR SELECT USING (true);
CREATE POLICY "Users can create story likes" ON story_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own story likes" ON story_likes FOR DELETE USING (auth.uid() = user_id);

-- 11. Create RLS Policies for comment_likes
CREATE POLICY "Comment likes are viewable by everyone" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can create comment likes" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comment likes" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- 12. Create RLS Policies for story_categories
CREATE POLICY "Categories are viewable by everyone" ON story_categories FOR SELECT USING (true);

-- 13. Create RLS Policies for story_category_mapping
CREATE POLICY "Category mapping is viewable by everyone" ON story_category_mapping FOR SELECT USING (true);

-- 14. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_legal_stories_user_id ON legal_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_stories_case_type ON legal_stories(case_type);
CREATE INDEX IF NOT EXISTS idx_legal_stories_created_at ON legal_stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_legal_stories_is_approved ON legal_stories(is_approved);
CREATE INDEX IF NOT EXISTS idx_legal_stories_is_featured ON legal_stories(is_featured);
CREATE INDEX IF NOT EXISTS idx_legal_stories_tags ON legal_stories USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_user_id ON story_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_parent_comment_id ON story_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_created_at ON story_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user_id ON story_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- 15. Create function to update story counts
CREATE OR REPLACE FUNCTION update_story_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update comment count
    UPDATE legal_stories 
    SET comment_count = comment_count + 1
    WHERE id = NEW.story_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update comment count
    UPDATE legal_stories 
    SET comment_count = comment_count - 1
    WHERE id = OLD.story_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 16. Create function to update story like count
CREATE OR REPLACE FUNCTION update_story_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update like count
    UPDATE legal_stories 
    SET like_count = like_count + 1
    WHERE id = NEW.story_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update like count
    UPDATE legal_stories 
    SET like_count = like_count - 1
    WHERE id = OLD.story_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 17. Create function to update comment like count
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update like count
    UPDATE story_comments 
    SET like_count = like_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update like count
    UPDATE story_comments 
    SET like_count = like_count - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 18. Create triggers
DROP TRIGGER IF EXISTS update_story_counts_trigger ON story_comments;
CREATE TRIGGER update_story_counts_trigger
  AFTER INSERT OR DELETE ON story_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_story_counts();

DROP TRIGGER IF EXISTS update_story_like_count_trigger ON story_likes;
CREATE TRIGGER update_story_like_count_trigger
  AFTER INSERT OR DELETE ON story_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_story_like_count();

DROP TRIGGER IF EXISTS update_comment_like_count_trigger ON comment_likes;
CREATE TRIGGER update_comment_like_count_trigger
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_like_count();

-- 19. Insert story categories
INSERT INTO story_categories (name, description, icon, color) VALUES
('Family Law', 'Divorce, custody, marriage, and family disputes', 'Heart', '#EF4444'),
('Criminal Law', 'Criminal cases, arrests, and legal defense', 'Shield', '#DC2626'),
('Property Law', 'Real estate, land disputes, and property rights', 'Home', '#059669'),
('Employment Law', 'Workplace issues, discrimination, and labor rights', 'Users', '#7C3AED'),
('Consumer Rights', 'Product liability, fraud, and consumer protection', 'ShoppingCart', '#F59E0B'),
('Corporate Law', 'Business disputes, contracts, and corporate matters', 'Building', '#3B82F6'),
('Tax Law', 'Tax disputes, compliance, and tax planning', 'Calculator', '#10B981'),
('Immigration Law', 'Visa issues, citizenship, and immigration matters', 'Globe', '#8B5CF6'),
('Intellectual Property', 'Patents, trademarks, and copyright disputes', 'Lightbulb', '#F97316'),
('Environmental Law', 'Environmental regulations and compliance issues', 'Leaf', '#22C55E'),
('Cyber Law', 'Internet crimes, digital privacy, and IT Act matters', 'Monitor', '#6366F1'),
('Constitutional Law', 'Fundamental rights and constitutional matters', 'Scale', '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- 20. Insert sample legal stories
INSERT INTO legal_stories (user_id, title, content, case_type, location, outcome, is_anonymous, is_approved, is_featured, tags) VALUES
-- Family Law Story
(gen_random_uuid(), 'My Divorce Journey: Lessons Learned', 
'After 8 years of marriage, I found myself facing a difficult divorce. The process was emotionally draining but I learned valuable lessons about protecting your rights. My ex-spouse tried to hide assets, but with proper documentation and a good lawyer, I was able to secure a fair settlement. The key was staying organized and not letting emotions cloud judgment during negotiations.',
'Family Law', 'Mumbai', 'Successful settlement with fair asset division', true, true, true, ARRAY['divorce', 'asset division', 'family law', 'lessons learned']),

-- Criminal Law Story
(gen_random_uuid(), 'Wrongful Arrest: How I Fought Back', 
'I was wrongfully arrested for a crime I didn''t commit. The police didn''t follow proper procedures and I spent 3 days in custody before being released. I decided to fight back and filed a complaint. With the help of a criminal lawyer, I was able to prove my innocence and received compensation for the wrongful arrest. The experience taught me the importance of knowing your rights.',
'Criminal Law', 'Delhi', 'Acquitted and received compensation', true, true, true, ARRAY['wrongful arrest', 'police misconduct', 'criminal law', 'rights']),

-- Property Law Story
(gen_random_uuid(), 'Land Dispute Resolution: A 5-Year Battle', 
'My family was involved in a complex land dispute that lasted 5 years. Multiple parties claimed ownership of the same property. The case went through multiple courts and involved extensive documentation. Finally, with proper legal representation and patience, we were able to resolve the dispute through mediation. The key lesson: always maintain proper documentation.',
'Property Law', 'Bangalore', 'Resolved through mediation', true, true, false, ARRAY['land dispute', 'mediation', 'property law', 'documentation']),

-- Employment Law Story
(gen_random_uuid(), 'Workplace Discrimination: Standing Up for Rights', 
'I faced discrimination at my workplace based on my gender. Despite being qualified, I was passed over for promotions and paid less than male colleagues. I documented everything and filed a complaint with the labor department. With legal support, I was able to prove the discrimination and received back pay and a promotion. Don''t stay silent about workplace discrimination.',
'Employment Law', 'Chennai', 'Won discrimination case, received back pay', true, true, true, ARRAY['discrimination', 'workplace rights', 'employment law', 'gender equality']),

-- Consumer Rights Story
(gen_random_uuid(), 'Fighting Against Fraudulent Insurance Claim Denial', 
'My insurance company denied a legitimate claim for my car accident, citing technicalities. I refused to accept this and filed a complaint with the consumer forum. After 18 months of persistence and proper documentation, the consumer court ruled in my favor and ordered the insurance company to pay the claim with interest. The lesson: don''t give up on legitimate claims.',
'Consumer Rights', 'Hyderabad', 'Won consumer case, received claim with interest', true, true, false, ARRAY['insurance', 'consumer rights', 'fraud', 'persistence']),

-- Corporate Law Story
(gen_random_uuid(), 'Startup Partnership Dispute: Lessons in Contracts', 
'My business partner and I had a falling out over profit sharing. We had a verbal agreement but no written contract. This led to a messy legal battle that could have been avoided. We eventually settled out of court, but I learned the hard way that all business agreements must be in writing. Now I always insist on proper contracts.',
'Corporate Law', 'Pune', 'Settled out of court', true, true, false, ARRAY['partnership', 'contracts', 'corporate law', 'business disputes']),

-- Tax Law Story
(gen_random_uuid(), 'Tax Assessment Challenge: Understanding Your Rights', 
'I received a tax assessment that I believed was incorrect. Instead of just paying it, I decided to challenge it. I gathered all my documentation and filed an appeal. The process took time but I was able to prove that the assessment was indeed wrong. The tax department revised the assessment and I saved a significant amount. Always question incorrect tax demands.',
'Tax Law', 'Gurgaon', 'Assessment revised in favor of taxpayer', true, true, false, ARRAY['tax assessment', 'appeal', 'tax law', 'documentation']),

-- Immigration Law Story
(gen_random_uuid(), 'Visa Extension Battle: Persistence Pays Off', 
'My work visa was denied extension despite having a valid job offer. The immigration officer cited insufficient documentation. I appealed the decision and provided additional documents. After multiple follow-ups and persistence, my visa was finally approved. The key was maintaining detailed records and not giving up.',
'Immigration Law', 'Mumbai', 'Visa extension approved after appeal', true, true, false, ARRAY['visa extension', 'immigration', 'appeal', 'persistence']),

-- Intellectual Property Story
(gen_random_uuid(), 'Trademark Infringement: Protecting My Brand', 
'Someone started using a very similar name and logo to my business. I immediately sent a cease and desist letter and filed for trademark protection. The infringing party initially refused to stop, but after legal action, they agreed to change their branding. The experience taught me the importance of protecting intellectual property early.',
'Intellectual Property', 'Bangalore', 'Infringement stopped, trademark registered', true, true, false, ARRAY['trademark', 'infringement', 'intellectual property', 'brand protection']),

-- Environmental Law Story
(gen_random_uuid(), 'Fighting Industrial Pollution in My Neighborhood', 
'A factory near my home was causing severe air and water pollution. I organized the community and filed a complaint with the pollution control board. After months of legal proceedings and media attention, the factory was ordered to install proper pollution control equipment. The case showed the power of community action.',
'Environmental Law', 'Kolkata', 'Factory ordered to install pollution controls', true, true, false, ARRAY['pollution', 'environmental law', 'community action', 'public health'])
ON CONFLICT DO NOTHING;

-- 21. Map stories to categories
INSERT INTO story_category_mapping (story_id, category_id)
SELECT s.id, c.id 
FROM legal_stories s, story_categories c 
WHERE c.name = s.case_type
ON CONFLICT DO NOTHING;

-- 22. Add some sample comments
INSERT INTO story_comments (story_id, user_id, content, is_anonymous)
SELECT 
  s.id,
  gen_random_uuid(),
  'Thank you for sharing this story. It''s very helpful for others going through similar situations.',
  true
FROM legal_stories s 
WHERE s.title = 'My Divorce Journey: Lessons Learned'
ON CONFLICT DO NOTHING;

INSERT INTO story_comments (story_id, user_id, content, is_anonymous)
SELECT 
  s.id,
  gen_random_uuid(),
  'This is exactly what I needed to read. Going through a similar situation and your story gives me hope.',
  true
FROM legal_stories s 
WHERE s.title = 'Wrongful Arrest: How I Fought Back'
ON CONFLICT DO NOTHING;

-- 23. Verify the setup
SELECT 'Legal stories database setup completed successfully!' as status;
SELECT COUNT(*) as total_stories FROM legal_stories;
SELECT COUNT(*) as total_categories FROM story_categories;
SELECT COUNT(*) as total_comments FROM story_comments;

-- 24. Show sample data
SELECT 
  s.title,
  s.case_type,
  s.is_anonymous,
  s.is_approved,
  s.view_count,
  s.like_count,
  s.comment_count
FROM legal_stories s 
ORDER BY s.created_at DESC 
LIMIT 5;
