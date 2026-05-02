-- Seed data for case stories system

INSERT INTO case_stories (
    title, 
    category, 
    story_content, 
    legal_outcome, 
    lessons_learned, 
    tags, 
    location_state, 
    case_duration,
    is_approved,
    is_featured
) VALUES 
(
    'Landlord Refused Security Deposit Return',
    'Consumer Rights',
    'My landlord refused to return my security deposit of ₹50,000 after I vacated the apartment. He claimed damages that were normal wear and tear. I had taken photos before moving in and after moving out.',
    'Filed a complaint with the consumer court. Won the case and got full deposit back plus compensation for mental harassment.',
    'Always document the condition of rental property with photos and videos. Keep all communication with landlord in writing. Consumer court is very effective for such disputes.',
    ARRAY['rental', 'security deposit', 'consumer court', 'landlord dispute'],
    'Maharashtra',
    '8 months',
    true,
    true
),
(
    'Workplace Harassment and Wrongful Termination',
    'Labor Rights',
    'I faced continuous harassment from my manager and was eventually terminated without proper notice. The company cited performance issues but I had good appraisals.',
    'Approached labor court with evidence of harassment. Company settled out of court and paid compensation equivalent to 6 months salary.',
    'Document all instances of harassment with dates and witnesses. Keep copies of all performance reviews and communications. Labor laws strongly protect employees.',
    ARRAY['workplace harassment', 'wrongful termination', 'labor court', 'settlement'],
    'Karnataka',
    '1 year',
    true,
    false
),
(
    'Medical Negligence Case',
    'Consumer Rights',
    'A family member underwent surgery at a private hospital. Due to negligence, complications arose requiring additional surgeries and extended treatment.',
    'Filed case in consumer court against hospital. After 2 years, received compensation for medical expenses and mental trauma.',
    'Get second opinions for major procedures. Keep all medical records and bills. Medical negligence cases take time but consumer courts are sympathetic to patients.',
    ARRAY['medical negligence', 'hospital', 'consumer court', 'compensation'],
    'Delhi',
    '2 years',
    true,
    true
),
(
    'Online Shopping Fraud',
    'Consumer Rights',
    'Ordered expensive electronics online but received fake products. Seller refused refund and stopped responding to messages.',
    'Filed complaint with cybercrime cell and consumer forum. Got full refund after 6 months when authorities traced the seller.',
    'Always use secure payment methods. Keep screenshots of product listings and communications. Report to cybercrime immediately for online frauds.',
    ARRAY['online fraud', 'fake products', 'cybercrime', 'consumer forum'],
    'Tamil Nadu',
    '6 months',
    true,
    false
),
(
    'Property Document Verification Issue',
    'Property Rights',
    'Discovered that property documents had discrepancies after purchase. Previous owner had not disclosed pending litigation.',
    'Hired a property lawyer and got the title cleared through court proceedings. Previous owner had to compensate for legal expenses.',
    'Always verify property documents thoroughly before purchase. Check for pending litigations in court records. Property lawyers are essential for such transactions.',
    ARRAY['property documents', 'title verification', 'litigation', 'property lawyer'],
    'Gujarat',
    '1.5 years',
    true,
    false
);
