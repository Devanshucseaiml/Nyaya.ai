-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "KYR articles are viewable by everyone" ON kyr_articles;
DROP POLICY IF EXISTS "KYR articles can be created by authenticated users" ON kyr_articles;
DROP POLICY IF EXISTS "KYR articles can be updated by authenticated users" ON kyr_articles;

-- Recreate policies
CREATE POLICY "KYR articles are viewable by everyone" ON kyr_articles
    FOR SELECT USING (true);

CREATE POLICY "KYR articles can be created by authenticated users" ON kyr_articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "KYR articles can be updated by authenticated users" ON kyr_articles
    FOR UPDATE USING (auth.role() = 'authenticated');



