-- Add More Lawyers Script
-- This script adds additional lawyers to cover all specializations

-- Add more lawyers with different specializations
INSERT INTO lawyers (full_name, email, phone, bio, experience_years, specialization, location, bar_council_number, practice_areas, languages, consultation_fee, is_verified, is_available) VALUES
-- Constitutional Law
('Adv. Dr. Anjali Verma', 'anjali.verma@example.com', '+91 98765 12345', 'Constitutional law expert with 15 years of experience in fundamental rights, public interest litigation, and constitutional matters. Former law professor and human rights advocate.', 15, 'Constitutional Law', 'New Delhi', 'BCI/2008/12345', ARRAY['Constitutional Law', 'Human Rights'], ARRAY['Hindi', 'English', 'Sanskrit'], 3500, true, true),

-- Consumer Protection
('Adv. Ramesh Agarwal', 'ramesh.agarwal@example.com', '+91 87654 23456', 'Consumer rights specialist with 8 years of experience in product liability, consumer disputes, and consumer protection laws. Successfully handled 500+ consumer cases.', 8, 'Consumer Protection', 'Mumbai', 'BCI/2015/23456', ARRAY['Consumer Protection', 'Civil Law'], ARRAY['Hindi', 'English', 'Marathi'], 1800, true, true),

-- Cyber Law
('Adv. Priyanka Gupta', 'priyanka.gupta@example.com', '+91 76543 34567', 'Cyber law expert specializing in internet crimes, digital privacy, data protection, and IT Act matters. Certified cybersecurity professional.', 6, 'Cyber Law', 'Bangalore', 'BCI/2017/34567', ARRAY['Cyber Law', 'Intellectual Property'], ARRAY['Hindi', 'English', 'Kannada'], 2800, true, true),

-- Environmental Law
('Adv. Dr. Rajiv Malhotra', 'rajiv.malhotra@example.com', '+91 65432 45678', 'Environmental law specialist with 12 years of experience in environmental regulations, pollution control, and sustainable development laws. PhD in Environmental Law.', 12, 'Environmental Law', 'Pune', 'BCI/2011/45678', ARRAY['Environmental Law', 'Administrative Law'], ARRAY['Hindi', 'English', 'Marathi'], 3200, true, true),

-- Immigration Law
('Adv. Sarah Khan', 'sarah.khan@example.com', '+91 54321 56789', 'Immigration law expert with 10 years of experience in visa applications, citizenship matters, and immigration disputes. Former immigration officer.', 10, 'Immigration Law', 'Hyderabad', 'BCI/2013/56789', ARRAY['Immigration Law', 'Administrative Law'], ARRAY['Hindi', 'English', 'Urdu', 'Arabic'], 2500, true, true),

-- Labor Law
('Adv. Manoj Tiwari', 'manoj.tiwari@example.com', '+91 43210 67890', 'Labor law specialist with 9 years of experience in employment disputes, workers rights, and industrial relations. Former labor union legal advisor.', 9, 'Labor Law', 'Chennai', 'BCI/2014/67890', ARRAY['Labor Law', 'Employment Law'], ARRAY['Hindi', 'English', 'Tamil'], 2200, true, true),

-- Tax Law
('Adv. Deepak Sharma', 'deepak.sharma@example.com', '+91 32109 78901', 'Tax law expert with 14 years of experience in tax planning, compliance, and tax dispute resolution. Chartered Accountant and tax consultant.', 14, 'Tax Law', 'Gurgaon', 'BCI/2009/78901', ARRAY['Tax Law', 'Corporate Law'], ARRAY['Hindi', 'English', 'Punjabi'], 4000, true, true),

-- Intellectual Property
('Adv. Dr. Meenakshi Iyer', 'meenakshi.iyer@example.com', '+91 21098 89012', 'IP law expert with 11 years of experience in patents, trademarks, copyrights, and IP litigation. PhD in Intellectual Property Law.', 11, 'Intellectual Property', 'Mumbai', 'BCI/2012/89012', ARRAY['Intellectual Property', 'Corporate Law'], ARRAY['Hindi', 'English', 'Malayalam'], 3800, true, true),

-- Additional Criminal Law
('Adv. Vikas Singh', 'vikas.singh@example.com', '+91 10987 90123', 'Criminal defense lawyer with 13 years of experience in serious criminal cases, white-collar crimes, and criminal appeals. Former public prosecutor.', 13, 'Criminal Law', 'Lucknow', 'BCI/2010/90123', ARRAY['Criminal Law', 'Constitutional Law'], ARRAY['Hindi', 'English', 'Awadhi'], 3000, true, true),

-- Additional Family Law
('Adv. Sunita Devi', 'sunita.devi@example.com', '+91 09876 01234', 'Family law specialist with 7 years of experience in divorce, custody, maintenance, and family disputes. Women rights advocate.', 7, 'Family Law', 'Patna', 'BCI/2016/01234', ARRAY['Family Law', 'Women Rights'], ARRAY['Hindi', 'English', 'Bhojpuri'], 2000, true, true),

-- Additional Property Law
('Adv. Harish Patel', 'harish.patel@example.com', '+91 98765 11111', 'Property law expert with 16 years of experience in real estate transactions, land disputes, and property documentation. Former land acquisition officer.', 16, 'Property Law', 'Ahmedabad', 'BCI/2007/11111', ARRAY['Property Law', 'Civil Law'], ARRAY['Hindi', 'English', 'Gujarati'], 3500, true, true),

-- Additional Corporate Law
('Adv. Neha Kapoor', 'neha.kapoor@example.com', '+91 87654 22222', 'Corporate law specialist with 8 years of experience in mergers, acquisitions, corporate governance, and startup legal matters. Former in-house counsel.', 8, 'Corporate Law', 'Noida', 'BCI/2015/22222', ARRAY['Corporate Law', 'Startup Law'], ARRAY['Hindi', 'English', 'Punjabi'], 3200, true, true)

ON CONFLICT (bar_council_number) DO NOTHING;

-- Map the new lawyers to their specializations
INSERT INTO lawyer_specialization_mapping (lawyer_id, specialization_id)
SELECT l.id, s.id 
FROM lawyers l, lawyer_specializations s 
WHERE l.specialization = s.name
AND l.full_name IN (
  'Adv. Dr. Anjali Verma',
  'Adv. Ramesh Agarwal',
  'Adv. Priyanka Gupta',
  'Adv. Dr. Rajiv Malhotra',
  'Adv. Sarah Khan',
  'Adv. Manoj Tiwari',
  'Adv. Deepak Sharma',
  'Adv. Dr. Meenakshi Iyer',
  'Adv. Vikas Singh',
  'Adv. Sunita Devi',
  'Adv. Harish Patel',
  'Adv. Neha Kapoor'
)
ON CONFLICT DO NOTHING;

-- Add some sample reviews for the new lawyers
INSERT INTO lawyer_reviews (lawyer_id, rating, review_text)
SELECT 
  l.id,
  5,
  'Excellent ' || l.specialization || ' lawyer. Very knowledgeable and professional.'
FROM lawyers l 
WHERE l.full_name IN ('Adv. Dr. Anjali Verma', 'Adv. Deepak Sharma', 'Adv. Dr. Meenakshi Iyer')
ON CONFLICT DO NOTHING;

INSERT INTO lawyer_reviews (lawyer_id, rating, review_text)
SELECT 
  l.id,
  4,
  'Great ' || l.specialization || ' expertise. Helped me resolve my case successfully.'
FROM lawyers l 
WHERE l.full_name IN ('Adv. Ramesh Agarwal', 'Adv. Priyanka Gupta', 'Adv. Sarah Khan')
ON CONFLICT DO NOTHING;

-- Verify the additions
SELECT 'Additional lawyers added successfully!' as status;
SELECT COUNT(*) as total_lawyers FROM lawyers;
SELECT COUNT(*) as total_specializations FROM lawyer_specializations;
SELECT COUNT(*) as total_mappings FROM lawyer_specialization_mapping;

-- Show lawyers by specialization
SELECT 
  s.name as specialization,
  COUNT(l.id) as lawyer_count,
  STRING_AGG(l.full_name, ', ') as lawyers
FROM lawyer_specializations s
LEFT JOIN lawyer_specialization_mapping lsm ON s.id = lsm.specialization_id
LEFT JOIN lawyers l ON lsm.lawyer_id = l.id
GROUP BY s.name
ORDER BY s.name;
