-- Create case stories system for anonymous legal experience sharing

-- Case stories table
CREATE TABLE IF NOT EXISTS case_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    story_content TEXT NOT NULL,
    legal_outcome TEXT,
    lessons_learned TEXT,
    tags TEXT[] DEFAULT '{}',
    location_state TEXT,
    case_duration TEXT,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Case story reactions table
CREATE TABLE IF NOT EXISTS case_story_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id UUID REFERENCES case_stories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('helpful', 'inspiring', 'informative')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(story_id, user_id, reaction_type)
);

-- Case story comments table
CREATE TABLE IF NOT EXISTS case_story_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id UUID REFERENCES case_stories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE case_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_story_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_story_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for case_stories
CREATE POLICY "Anyone can view approved case stories" ON case_stories
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can insert case stories" ON case_stories
    FOR INSERT WITH CHECK (true);

-- RLS Policies for case_story_reactions
CREATE POLICY "Users can view all reactions" ON case_story_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reactions" ON case_story_reactions
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for case_story_comments
CREATE POLICY "Users can view comments on approved stories" ON case_story_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM case_stories 
            WHERE id = story_id AND is_approved = true
        )
    );

CREATE POLICY "Users can insert comments" ON case_story_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM case_stories 
            WHERE id = story_id AND is_approved = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_case_stories_category ON case_stories(category);
CREATE INDEX IF NOT EXISTS idx_case_stories_approved ON case_stories(is_approved);
CREATE INDEX IF NOT EXISTS idx_case_stories_featured ON case_stories(is_featured);
CREATE INDEX IF NOT EXISTS idx_case_stories_created_at ON case_stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_story_reactions_story_id ON case_story_reactions(story_id);
CREATE INDEX IF NOT EXISTS idx_case_story_comments_story_id ON case_story_comments(story_id);
