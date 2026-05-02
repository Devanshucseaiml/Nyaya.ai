-- Create KYR articles table
CREATE TABLE IF NOT EXISTS kyr_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    read_time INTEGER DEFAULT 5,
    difficulty VARCHAR(20) DEFAULT 'Beginner',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE kyr_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for KYR articles
-- Make idempotent by dropping existing policies first
DROP POLICY IF EXISTS "KYR articles are viewable by everyone" ON kyr_articles;
DROP POLICY IF EXISTS "KYR articles can be created by authenticated users" ON kyr_articles;
DROP POLICY IF EXISTS "KYR articles can be updated by authenticated users" ON kyr_articles;

CREATE POLICY "KYR articles are viewable by everyone" ON kyr_articles
    FOR SELECT USING (true);

CREATE POLICY "KYR articles can be created by authenticated users" ON kyr_articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "KYR articles can be updated by authenticated users" ON kyr_articles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kyr_articles_category ON kyr_articles(category);
CREATE INDEX IF NOT EXISTS idx_kyr_articles_slug ON kyr_articles(slug);
CREATE INDEX IF NOT EXISTS idx_kyr_articles_created_at ON kyr_articles(created_at DESC);

-- Insert sample KYR articles
INSERT INTO kyr_articles (title, slug, category, summary, content, read_time, difficulty, tags) VALUES
(
    'Right to Equality (Article 14)',
    'right-to-equality-article-14',
    'Constitutional Rights',
    'Understanding your fundamental right to equality before law and equal protection',
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

## Exceptions and Limitations

### Reasonable Classification
The right to equality doesn''t mean absolute equality. The state can make reasonable classifications such as:
- Age limits for certain jobs
- Educational qualifications for positions
- Special provisions for women, children, and marginalized communities

### Positive Discrimination
- Reservations for SC/ST/OBC communities
- Special provisions for women
- Affirmative action programs

## Landmark Cases

### 1. Maneka Gandhi v. Union of India (1978)
Established that Article 14 applies to executive actions and not just legislative actions.

### 2. E.P. Royappa v. State of Tamil Nadu (1974)
Defined equality as the absence of arbitrariness and discrimination.

## How to Exercise This Right

### If You Face Discrimination:
1. **Document the incident** - Keep records of discriminatory treatment
2. **File a complaint** - Approach relevant authorities or courts
3. **Seek legal help** - Consult with a lawyer specializing in constitutional law
4. **Use RTI** - Right to Information to get relevant documents

### Legal Remedies:
- **Writ Petition** - File directly in High Court or Supreme Court
- **Civil Suit** - For damages due to discrimination
- **Criminal Complaint** - If discrimination involves criminal acts',
    8,
    'Beginner',
    ARRAY['Constitution', 'Equality', 'Fundamental Rights', 'Discrimination']
),
(
    'Right to Freedom of Speech and Expression (Article 19)',
    'right-to-freedom-of-speech-article-19',
    'Constitutional Rights',
    'Your fundamental right to express opinions and ideas freely',
    '# Right to Freedom of Speech and Expression (Article 19)

## Overview
Article 19(1)(a) of the Indian Constitution guarantees the right to freedom of speech and expression. This fundamental right allows citizens to express their thoughts, ideas, and opinions freely.

## Key Provisions

### Freedom of Speech and Expression
- Right to express opinions and ideas
- Freedom to criticize government policies
- Right to artistic and creative expression
- Freedom of press and media

### Reasonable Restrictions
Article 19(2) allows reasonable restrictions on this right in the interest of:
- Sovereignty and integrity of India
- Security of the state
- Friendly relations with foreign states
- Public order, decency, or morality
- Contempt of court
- Defamation
- Incitement to an offence

## Practical Applications

### 1. Media and Journalism
- Freedom of press to report news
- Right to criticize government policies
- Protection of whistleblowers
- Right to access information

### 2. Social Media
- Freedom to express opinions online
- Right to share information
- Protection against arbitrary censorship
- Right to criticize public figures

### 3. Artistic Expression
- Freedom to create art and literature
- Right to perform and display works
- Protection of creative expression
- Right to cultural expression

## Landmark Cases

### 1. Romesh Thappar v. State of Madras (1950)
Established that freedom of speech includes freedom of circulation.

### 2. Bennett Coleman v. Union of India (1972)
Protected the freedom of press from government interference.

## How to Exercise This Right

### Responsible Expression:
1. **Verify information** before sharing
2. **Respect others** and avoid hate speech
3. **Use constructive criticism** rather than personal attacks
4. **Understand limitations** and reasonable restrictions

### Legal Protection:
- **Writ Petition** for violation of rights
- **Defamation laws** to protect reputation
- **Contempt proceedings** for court criticism
- **Criminal laws** for incitement to violence',
    6,
    'Beginner',
    ARRAY['Constitution', 'Freedom of Speech', 'Media', 'Expression']
),
(
    'Right to Education (Article 21A)',
    'right-to-education-article-21a',
    'Education Rights',
    'Your fundamental right to free and compulsory education',
    '# Right to Education (Article 21A)

## Overview
Article 21A of the Indian Constitution guarantees the right to education as a fundamental right. Every child between 6-14 years has the right to free and compulsory education.

## Key Provisions

### Free and Compulsory Education
- Free education for children aged 6-14 years
- Compulsory enrollment and attendance
- No discrimination based on caste, religion, or gender
- Quality education standards

### Right to Education Act, 2009
- 25% reservation for disadvantaged children in private schools
- No capitation fees or screening procedures
- Prohibition of physical punishment
- Special provisions for children with disabilities

## Practical Applications

### 1. School Admission
- Right to admission in neighborhood school
- No denial based on lack of documents
- Free textbooks and uniforms
- Mid-day meal provision

### 2. Quality Standards
- Qualified teachers in every school
- Proper infrastructure and facilities
- Regular monitoring and evaluation
- Grievance redressal mechanisms

### 3. Special Provisions
- Education for children with disabilities
- Bridge courses for out-of-school children
- Special training for teachers
- Community participation in school management

## Landmark Cases

### 1. Unni Krishnan v. State of Andhra Pradesh (1993)
Recognized education as a fundamental right.

### 2. Society for Unaided Private Schools v. Union of India (2012)
Upheld 25% reservation in private schools.

## How to Exercise This Right

### For Parents:
1. **Enroll children** in neighborhood schools
2. **Monitor education** quality and progress
3. **Participate in** school management committees
4. **Report violations** to education authorities

### For Children:
1. **Attend school** regularly
2. **Complete homework** and assignments
3. **Participate in** school activities
4. **Report problems** to teachers or parents

### Legal Remedies:
- **Complaint to** education authorities
- **Writ petition** for violation of rights
- **RTI application** for information
- **Public interest litigation** for systemic issues',
    7,
    'Beginner',
    ARRAY['Education', 'Children Rights', 'School', 'Free Education']
),
(
    'Right to Information (RTI) Act, 2005',
    'right-to-information-act-2005',
    'Transparency Laws',
    'Your right to access government information and hold authorities accountable',
    '# Right to Information (RTI) Act, 2005

## Overview
The Right to Information Act, 2005 empowers citizens to access information from public authorities. It promotes transparency and accountability in government functioning.

## Key Provisions

### Right to Information
- Access to government records and documents
- Information about government decisions and policies
- Right to inspect government offices and facilities
- Right to obtain certified copies of documents

### Public Authorities Covered
- All government departments and ministries
- Public sector undertakings
- Local bodies and municipalities
- NGOs receiving government funding
- Educational institutions

## How to File RTI Application

### Step 1: Identify the Public Authority
- Determine which department holds the information
- Find the designated Public Information Officer (PIO)
- Get the correct address and contact details

### Step 2: Prepare the Application
- Write in simple, clear language
- Be specific about the information sought
- Mention the time period if applicable
- Attach necessary documents if required

### Step 3: Submit the Application
- Pay the application fee (usually ₹10)
- Submit in person or by post
- Keep a copy for your records
- Note the application number

### Step 4: Follow Up
- Track your application status
- Respond to any clarifications sought
- Appeal if information is denied
- Escalate to higher authorities if needed

## Exemptions and Limitations

### Information Exempted:
- National security and defense
- Cabinet papers and deliberations
- Personal information affecting privacy
- Trade secrets and commercial confidence
- Information received in confidence from foreign governments

### Time Limits:
- 30 days for normal requests
- 48 hours for life and liberty cases
- 35 days if information involves third party

## Landmark Cases

### 1. Central Board of Secondary Education v. Aditya Bandopadhyay (2011)
Established that exam answer sheets can be accessed under RTI.

### 2. Girish Ramchandra Deshpande v. Central Information Commission (2012)
Defined limits of personal information disclosure.

## Practical Tips

### Writing Effective RTI Applications:
1. **Be specific** about information sought
2. **Use simple language** and clear questions
3. **Mention relevant sections** of RTI Act
4. **Keep copies** of all correspondence
5. **Follow up** regularly on your application

### Common Uses:
- **Government schemes** and benefits
- **Infrastructure projects** and contracts
- **Educational records** and certificates
- **Property records** and land documents
- **Employment records** and service details

### Legal Remedies:
- **First appeal** to appellate authority
- **Second appeal** to Information Commission
- **Judicial review** in High Court
- **Penalty proceedings** against PIOs',
    10,
    'Intermediate',
    ARRAY['RTI', 'Transparency', 'Government', 'Accountability']
),
(
    'Consumer Protection Act, 2019',
    'consumer-protection-act-2019',
    'Consumer Rights',
    'Your rights as a consumer and how to protect them',
    '# Consumer Protection Act, 2019

## Overview
The Consumer Protection Act, 2019 provides comprehensive protection to consumers against unfair trade practices, defective goods, and deficient services.

## Key Provisions

### Consumer Rights
1. **Right to Safety** - Protection against hazardous goods and services
2. **Right to Information** - Complete information about products and services
3. **Right to Choose** - Access to variety of goods and services at competitive prices
4. **Right to be Heard** - Right to voice complaints and be heard
5. **Right to Redressal** - Right to seek compensation and relief
6. **Right to Consumer Education** - Right to acquire knowledge and skills

### Unfair Trade Practices
- False or misleading advertisements
- Hoarding or destruction of goods
- Refusal to sell goods or provide services
- Charging excessive prices
- Selling goods not conforming to standards

## Filing Consumer Complaints

### Step 1: Identify the Issue
- Document the problem clearly
- Collect all relevant documents
- Take photographs if applicable
- Keep records of communications

### Step 2: Approach the Business
- Contact customer service
- Send written complaint
- Give reasonable time for response
- Keep copies of all correspondence

### Step 3: File Formal Complaint
- Approach Consumer Forum
- Pay nominal fee (₹100-500)
- Submit required documents
- Attend hearings as scheduled

### Step 4: Follow Up
- Track complaint status
- Respond to notices
- Attend mediation if offered
- Appeal if dissatisfied

## Consumer Forums

### District Consumer Disputes Redressal Commission
- Claims up to ₹1 crore
- Located in each district
- Quick disposal of cases
- No need for lawyer

### State Consumer Disputes Redressal Commission
- Claims between ₹1-10 crore
- Appeals from district forums
- Located in state capitals
- Professional members

### National Consumer Disputes Redressal Commission
- Claims above ₹10 crore
- Appeals from state commissions
- Located in New Delhi
- Supreme Court judges

## Common Consumer Issues

### 1. E-commerce
- Delayed delivery
- Defective products
- Wrong items received
- Refund issues
- Hidden charges

### 2. Banking and Finance
- Unauthorized charges
- Poor service quality
- Hidden fees
- Insurance claim denials
- Credit card disputes

### 3. Healthcare
- Medical negligence
- Overcharging
- Poor treatment
- Medicine side effects
- Hospital negligence

### 4. Real Estate
- Delayed possession
- Quality issues
- Hidden costs
- False promises
- Registration problems

## Landmark Cases

### 1. Indian Medical Association v. V.P. Shantha (1995)
Established that medical services fall under consumer protection.

### 2. Lucknow Development Authority v. M.K. Gupta (1994)
Defined deficiency in service and compensation principles.

## Tips for Consumers

### Before Purchase:
1. **Research thoroughly** about products and services
2. **Compare prices** and features
3. **Read terms and conditions** carefully
4. **Keep receipts** and warranties
5. **Check return policies**

### When Filing Complaints:
1. **Be specific** about the problem
2. **Provide evidence** and documents
3. **Calculate losses** accurately
4. **Be patient** with the process
5. **Follow up** regularly

### Legal Remedies:
- **Compensation** for losses
- **Replacement** of defective goods
- **Refund** of money paid
- **Removal of defects**
- **Discontinuation of unfair practices**',
    12,
    'Intermediate',
    ARRAY['Consumer Rights', 'E-commerce', 'Banking', 'Healthcare']
);



