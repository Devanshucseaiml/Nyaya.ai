-- Insert lawyer specializations
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
('Cyber Law', 'Internet crimes and digital privacy', 'Monitor');

-- Insert sample lawyers
INSERT INTO lawyers (user_id, full_name, email, phone, bio, experience_years, bar_council_number, practice_areas, languages, location, consultation_fee, is_verified, is_available) VALUES
(gen_random_uuid(), 'Adv. Priya Sharma', 'priya.sharma@example.com', '+91 98765 43210', 'Experienced criminal defense lawyer with 12 years of practice. Specialized in white-collar crimes and corporate fraud cases.', 12, 'BCI/2011/12345', ARRAY['Criminal Law', 'Corporate Law'], ARRAY['Hindi', 'English', 'Punjabi'], 'New Delhi', 2500, true, true),
(gen_random_uuid(), 'Adv. Rajesh Kumar', 'rajesh.kumar@example.com', '+91 87654 32109', 'Family law specialist helping families navigate divorce, custody, and property disputes with compassion and expertise.', 8, 'BCI/2015/67890', ARRAY['Family Law', 'Property Law'], ARRAY['Hindi', 'English', 'Bengali'], 'Mumbai', 2000, true, true),
(gen_random_uuid(), 'Adv. Meera Patel', 'meera.patel@example.com', '+91 76543 21098', 'Corporate lawyer with extensive experience in mergers, acquisitions, and startup legal matters.', 15, 'BCI/2008/11111', ARRAY['Corporate Law', 'Intellectual Property'], ARRAY['Hindi', 'English', 'Gujarati'], 'Bangalore', 3000, true, true),
(gen_random_uuid(), 'Adv. Arjun Singh', 'arjun.singh@example.com', '+91 65432 10987', 'Labor law expert fighting for workers rights and handling employment disputes across various industries.', 10, 'BCI/2013/22222', ARRAY['Labor Law', 'Constitutional Law'], ARRAY['Hindi', 'English', 'Marathi'], 'Pune', 1800, true, true),
(gen_random_uuid(), 'Adv. Kavya Reddy', 'kavya.reddy@example.com', '+91 54321 09876', 'Tax law specialist helping individuals and businesses with tax planning, compliance, and dispute resolution.', 6, 'BCI/2017/33333', ARRAY['Tax Law', 'Corporate Law'], ARRAY['Hindi', 'English', 'Telugu'], 'Hyderabad', 2200, true, true),
(gen_random_uuid(), 'Adv. Vikram Joshi', 'vikram.joshi@example.com', '+91 43210 98765', 'Property law expert with deep knowledge of real estate transactions, land disputes, and property documentation.', 14, 'BCI/2009/44444', ARRAY['Property Law', 'Constitutional Law'], ARRAY['Hindi', 'English', 'Marathi'], 'Mumbai', 2800, true, true);

-- Map lawyers to their specializations
INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Priya Sharma' AND s.name IN ('Criminal Law', 'Corporate Law');

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Rajesh Kumar' AND s.name IN ('Family Law', 'Property Law');

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Meera Patel' AND s.name IN ('Corporate Law', 'Intellectual Property');

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Arjun Singh' AND s.name IN ('Labor Law', 'Constitutional Law');

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Kavya Reddy' AND s.name IN ('Tax Law', 'Corporate Law');

INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.full_name = 'Adv. Vikram Joshi' AND s.name IN ('Property Law', 'Constitutional Law');
