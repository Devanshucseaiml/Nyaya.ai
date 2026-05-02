-- Insert legal categories
INSERT INTO legal_categories (title, description, slug, icon, color) VALUES
('Constitutional Rights', 'Fundamental rights guaranteed by the Indian Constitution', 'constitutional-rights', 'Scale', 'bg-blue-500'),
('Consumer Rights', 'Protection against unfair trade practices and defective goods', 'consumer-rights', 'Shield', 'bg-green-500'),
('Labor Rights', 'Workplace rights, wages, and employment protection', 'labor-rights', 'Briefcase', 'bg-orange-500'),
('Women''s Rights', 'Legal protections and rights specific to women', 'womens-rights', 'Users', 'bg-purple-500'),
('Property Rights', 'Land ownership, tenancy, and property disputes', 'property-rights', 'Home', 'bg-red-500'),
('Healthcare Rights', 'Right to healthcare, medical negligence, and patient rights', 'healthcare-rights', 'Heart', 'bg-pink-500')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample articles for Constitutional Rights
INSERT INTO legal_articles (title, description, content, slug, category_slug, read_time, difficulty, tags) VALUES
('Right to Equality (Article 14)', 'Understanding your fundamental right to equality before law and equal protection', 
'# Right to Equality (Article 14)

## Overview
Article 14 of the Indian Constitution guarantees the right to equality before law and equal protection of laws. This fundamental right ensures that all citizens are treated equally by the state, regardless of their religion, race, caste, sex, or place of birth.

## Key Provisions

### Equality Before Law
- No person shall be denied equality before the law
- The law applies equally to all citizens
- No one is above the law, including government officials

### Equal Protection of Laws
- Similar treatment in similar circumstances
- Classification must be reasonable and based on intelligible differentia
- The classification must have a rational relation to the object sought to be achieved

## Practical Applications

### 1. Employment
- Equal opportunity in government jobs
- No discrimination in private employment based on caste, religion, or gender
- Equal pay for equal work

### 2. Education
- Equal access to educational institutions
- No discrimination in admissions
- Right to quality education regardless of background

### 3. Legal Proceedings
- Equal treatment in courts
- Same legal procedures for all
- Right to fair trial

## How to Exercise This Right

### If You Face Discrimination:
1. **Document the incident** - Keep records of discriminatory treatment
2. **File a complaint** - Approach relevant authorities or courts
3. **Seek legal help** - Consult with a lawyer specializing in constitutional law
4. **Use RTI** - Right to Information to get relevant documents

### Legal Remedies:
- **Writ Petition** - File directly in High Court or Supreme Court
- **Civil Suit** - For damages due to discrimination
- **Criminal Complaint** - If discrimination involves criminal acts

*Remember: This information is for educational purposes and should not replace professional legal advice.*',
'right-to-equality', 'constitutional-rights', 8, 'Beginner', 
ARRAY['fundamental-rights', 'constitution', 'equality']),

('Right to Freedom of Speech (Article 19)', 'Your right to express opinions and the reasonable restrictions on this freedom',
'# Right to Freedom of Speech (Article 19)

## Overview
Article 19(1)(a) of the Indian Constitution guarantees the right to freedom of speech and expression. This includes the right to express one''s views, opinions, and beliefs freely through speech, writing, printing, pictures, or any other mode.

## What It Includes
- Freedom of speech and expression
- Freedom of press and media
- Right to information
- Freedom to hold and express opinions
- Commercial speech (with limitations)

## Reasonable Restrictions
The state can impose reasonable restrictions on this right in the interests of:
- Sovereignty and integrity of India
- Security of the state
- Friendly relations with foreign states
- Public order, decency, or morality
- Contempt of court
- Defamation
- Incitement to an offense

## Practical Examples

### Protected Speech
- Political criticism and dissent
- Artistic and literary expression
- Peaceful protests and demonstrations
- Journalistic reporting
- Academic discussions

### Restricted Speech
- Hate speech targeting communities
- Speech inciting violence
- Defamatory statements
- Obscene content
- Speech threatening national security

## Digital Age Considerations
- Social media posts and online content
- Cyberbullying and online harassment
- Digital surveillance and privacy
- Internet shutdowns and restrictions

## How to Exercise This Right
1. **Know the boundaries** - Understand what constitutes reasonable restrictions
2. **Document violations** - Keep records if your speech is unlawfully restricted
3. **Seek legal remedy** - Approach courts if your rights are violated
4. **Use responsibly** - Exercise your right without infringing on others'' rights

*This information is for educational purposes and should not replace professional legal advice.*',
'freedom-of-speech', 'constitutional-rights', 7, 'Intermediate',
ARRAY['fundamental-rights', 'freedom', 'expression', 'media']),

('Right Against Exploitation (Article 23-24)', 'Protection against human trafficking, forced labor, and child labor',
'# Right Against Exploitation (Articles 23-24)

## Overview
Articles 23 and 24 of the Indian Constitution protect citizens from exploitation, particularly focusing on human trafficking, forced labor, and child labor.

## Article 23: Prohibition of Traffic in Human Beings and Forced Labor
- Prohibits traffic in human beings, begar (forced labor), and other similar forms of forced labor
- Makes violation of this provision a punishable offense
- Allows the state to impose compulsory service for public purposes

## Article 24: Prohibition of Employment of Children in Factories
- Prohibits employment of children below 14 years in factories, mines, or hazardous occupations
- Aims to protect children from exploitation and ensure their right to education

## Forms of Exploitation Covered

### Human Trafficking
- Buying, selling, or transporting humans for exploitation
- Sexual exploitation and prostitution
- Organ trafficking
- Forced marriage

### Forced Labor (Begar)
- Unpaid or underpaid compulsory work
- Bonded labor and debt bondage
- Work under threat or coercion

### Child Labor
- Employment of children in hazardous conditions
- Work that interferes with education
- Exploitation of child workers

## Legal Framework
- **Bonded Labour System (Abolition) Act, 1976**
- **Child Labour (Prohibition and Regulation) Act, 1986**
- **Immoral Traffic (Prevention) Act, 1956**
- **Juvenile Justice (Care and Protection of Children) Act, 2015**

## How to Report Exploitation
1. **Contact authorities** - Police, labor department, child welfare committees
2. **Use helplines** - National helpline numbers for trafficking and child labor
3. **Approach NGOs** - Organizations working against exploitation
4. **File complaints** - With relevant government departments

## Remedies Available
- **Criminal prosecution** of violators
- **Compensation** for victims
- **Rehabilitation** programs
- **Legal aid** for victims

## Recent Developments
- Stricter penalties for trafficking
- Better rehabilitation programs
- Increased awareness campaigns
- Technology-based monitoring systems

*If you encounter any form of exploitation, report it immediately to authorities or call the national helpline.*',
'right-against-exploitation', 'constitutional-rights', 6, 'Beginner',
ARRAY['fundamental-rights', 'exploitation', 'labor', 'children'])

ON CONFLICT (category_slug, slug) DO NOTHING;

-- Insert sample articles for Consumer Rights
INSERT INTO legal_articles (title, description, content, slug, category_slug, read_time, difficulty, tags) VALUES
('Consumer Protection Act 2019', 'Understanding your rights as a consumer under the new Consumer Protection Act',
'# Consumer Protection Act 2019

## Overview
The Consumer Protection Act 2019 replaced the earlier 1986 Act, providing stronger protection to consumers and establishing a more robust grievance redressal mechanism.

## Key Features
- **Expanded definition** of consumer and goods
- **E-commerce regulations** for online transactions
- **Product liability** provisions
- **Mediation** as an alternative dispute resolution
- **Central Consumer Protection Authority** (CCPA) for enforcement

## Consumer Rights
1. **Right to Safety** - Protection against hazardous goods
2. **Right to Information** - Complete product information
3. **Right to Choose** - Access to variety of goods at competitive prices
4. **Right to be Heard** - Representation in consumer forums
5. **Right to Redressal** - Compensation for defective goods/services
6. **Right to Consumer Education** - Knowledge about consumer rights

## Common Consumer Issues
- **Defective products** and poor quality goods
- **Deficient services** from service providers
- **Unfair trade practices** and misleading advertisements
- **Overcharging** and billing errors
- **E-commerce disputes** and online fraud

## How to File a Consumer Complaint
1. **Try direct resolution** with the seller/service provider
2. **Gather evidence** - bills, receipts, correspondence
3. **Choose appropriate forum** based on claim value
4. **File complaint** within limitation period
5. **Attend hearings** and provide evidence

## Consumer Forums
- **District Consumer Disputes Redressal Commission** (up to ₹1 crore)
- **State Consumer Disputes Redressal Commission** (₹1 crore to ₹10 crore)
- **National Consumer Disputes Redressal Commission** (above ₹10 crore)

## E-commerce Specific Rights
- **Right to return** products within specified time
- **Protection against** fake reviews and misleading information
- **Liability of** e-commerce platforms for defective products
- **Grievance redressal** mechanisms on platforms

*Know your rights as a consumer and don''t hesitate to seek redressal for unfair practices.*',
'consumer-protection-act-2019', 'consumer-rights', 10, 'Intermediate',
ARRAY['consumer-protection', 'rights', 'e-commerce', 'grievance'])

ON CONFLICT (category_slug, slug) DO NOTHING;
