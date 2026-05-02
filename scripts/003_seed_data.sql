-- Insert legal categories
INSERT INTO public.legal_categories (name, description, icon) VALUES
('Family Law', 'Marriage, divorce, child custody, and family disputes', '👨‍👩‍👧‍👦'),
('Criminal Law', 'Criminal defense, bail, and criminal proceedings', '⚖️'),
('Property Law', 'Real estate, property disputes, and land records', '🏠'),
('Consumer Rights', 'Consumer protection, product liability, and service disputes', '🛡️'),
('Employment Law', 'Workplace rights, labor disputes, and employment contracts', '💼'),
('Business Law', 'Corporate law, contracts, and business disputes', '🏢'),
('Constitutional Law', 'Fundamental rights and constitutional matters', '📜'),
('Tax Law', 'Income tax, GST, and tax-related matters', '💰')
ON CONFLICT DO NOTHING;

-- Insert sample lawyers
INSERT INTO public.lawyers (name, specialization, experience_years, location, rating, contact_email, contact_phone, bio, verified) VALUES
('Adv. Priya Sharma', 'Family Law', 8, 'Delhi', 4.8, 'priya.sharma@lawfirm.com', '+91-9876543210', 'Experienced family law attorney specializing in divorce and child custody cases.', true),
('Adv. Rajesh Kumar', 'Criminal Law', 12, 'Mumbai', 4.9, 'rajesh.kumar@criminallaw.com', '+91-9876543211', 'Senior criminal defense lawyer with expertise in high-profile cases.', true),
('Adv. Meera Patel', 'Property Law', 6, 'Bangalore', 4.7, 'meera.patel@propertylaw.com', '+91-9876543212', 'Property law specialist with focus on real estate transactions and disputes.', true),
('Adv. Amit Singh', 'Consumer Rights', 5, 'Chennai', 4.6, 'amit.singh@consumerlaw.com', '+91-9876543213', 'Consumer rights advocate helping individuals fight against unfair practices.', true),
('Adv. Kavita Reddy', 'Employment Law', 10, 'Hyderabad', 4.8, 'kavita.reddy@employmentlaw.com', '+91-9876543214', 'Employment law expert specializing in workplace harassment and labor disputes.', true)
ON CONFLICT DO NOTHING;
