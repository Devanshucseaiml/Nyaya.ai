-- Create document_templates table
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    complexity TEXT CHECK (complexity IN ('Simple', 'Moderate', 'Complex')) DEFAULT 'Simple',
    estimated_time INTEGER DEFAULT 10,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT 'FileText',
    popular BOOLEAN DEFAULT false,
    fields JSONB NOT NULL DEFAULT '[]',
    template_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_documents table
CREATE TABLE IF NOT EXISTS generated_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES document_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    form_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_templates (public read)
CREATE POLICY "Anyone can view document templates" ON document_templates
    FOR SELECT USING (true);

-- RLS Policies for generated_documents
CREATE POLICY "Users can view their own generated documents" ON generated_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated documents" ON generated_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated documents" ON generated_documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated documents" ON generated_documents
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_templates_slug ON document_templates(slug);
CREATE INDEX IF NOT EXISTS idx_document_templates_category ON document_templates(category);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_template_id ON generated_documents(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_created_at ON generated_documents(created_at DESC);
