-- Seed additional Know Your Rights (KYR) articles
-- Safe to run multiple times due to ON CONFLICT on slug

INSERT INTO kyr_articles (title, slug, category, summary, content, read_time, difficulty, tags) VALUES
(
  'Minimum Wages and Overtime',
  'labor-minimum-wages-overtime',
  'Labor Rights',
  'Your right to minimum wages, overtime pay, and payslips',
  '# Minimum Wages and Overtime

## Overview
Every worker is entitled to at least the notified minimum wage and payment for overtime work.

## Key Rights
- Receive wages not less than the minimum notified in your state
- Overtime pay when working beyond 8–9 hours/day or 48 hours/week
- Payslips and wage records

## What You Can Do
1. Keep copies of appointment letters and payslips
2. Track hours worked
3. File complaints with the Labor Department for violations
4. Approach labor courts for recovery of dues',
  6,
  'Beginner',
  ARRAY['Labor', 'Wages', 'Overtime']
),
(
  'Protection from Sexual Harassment at Workplace (POSH)',
  'womens-rights-posh-workplace',
  'Women''s Rights',
  'How to report and seek redressal for workplace sexual harassment',
  '# POSH at Workplace

## Overview
The POSH Act, 2013 mandates prevention and redressal of sexual harassment at workplaces.

## Key Provisions
- Internal Committee in organizations with 10+ employees
- Time-bound inquiry and recommendations
- Interim reliefs and confidentiality

## How to File a Complaint
1. Write to the Internal Committee within 3 months of the incident
2. Include details, witnesses, and any evidence
3. Seek interim protection if needed',
  7,
  'Beginner',
  ARRAY['POSH', 'Harassment', 'Workplace']
),
(
  'Tenant Rights: Security Deposit and Eviction',
  'property-tenant-rights-deposit-eviction',
  'Property Rights',
  'Know your protections regarding deposits, notice, and eviction',
  '# Tenant Rights

## Security Deposit
- Typically capped by state rules or rent agreements
- Must be refunded after lawful deductions with statement of accounts

## Eviction Process
- Requires proper legal notice and due process
- No forceful eviction or disconnection of utilities

## Tips
1. Always sign a written rent agreement
2. Keep payment proofs
3. Document handover and condition of premises',
  6,
  'Beginner',
  ARRAY['Tenancy', 'Deposit', 'Eviction']
),
(
  'Medical Negligence: Patient Rights and Remedies',
  'healthcare-patient-rights-negligence',
  'Healthcare Rights',
  'Informed consent, medical records, and complaint mechanisms',
  '# Patient Rights

## Key Rights
- Informed consent for procedures
- Access to medical records within 30 days
- Right to second opinion

## Remedies
- File complaint with hospital and state medical council
- Consumer forum for deficiency in service
- Civil/criminal action in serious negligence',
  7,
  'Intermediate',
  ARRAY['Healthcare', 'Negligence', 'Consumer']
),
(
  'Arrest and Detention: Your Rights',
  'police-arrest-detention-rights',
  'Constitutional Rights',
  'What to do if stopped, detained, or arrested by police',
  '# Arrest and Detention

## Rights During Arrest
- Be informed of grounds of arrest
- Right to legal counsel and to inform a relative/friend
- Be produced before a magistrate within 24 hours
- Medical examination on request

## Practical Steps
1. Ask for the officer''s name and station
2. Do not resist; assert rights calmly
3. Call a lawyer and a trusted contact',
  5,
  'Beginner',
  ARRAY['Police', 'Arrest', 'Detention']
),
(
  'Right to Privacy and Data Protection Basics',
  'digital-rights-privacy-basics',
  'Transparency Laws',
  'Core privacy principles and handling of personal data',
  '# Privacy and Data Protection

## Principles
- Lawful, fair, and transparent processing
- Purpose limitation and data minimization
- Accuracy and storage limitation
- Security and accountability

## Your Actions
- Use strong passwords and 2FA
- Review app permissions
- Exercise access/erasure rights where available',
  5,
  'Beginner',
  ARRAY['Privacy', 'Data', 'Digital Rights']
),
(
  'Maternity Benefits and Leave',
  'womens-rights-maternity-benefits',
  'Women''s Rights',
  'Eligibility, duration of paid leave, and protections',
  '# Maternity Benefits

## Key Entitlements
- Paid maternity leave up to 26 weeks (subject to eligibility)
- Nursing breaks on return to work
- Protection against dismissal due to pregnancy

## Steps
1. Submit notice with expected delivery date
2. Keep medical certificates
3. Report violations to labor authorities',
  5,
  'Beginner',
  ARRAY['Maternity', 'Women', 'Leave']
),
(
  'Gratuity and Final Settlement',
  'labor-gratuity-final-settlement',
  'Labor Rights',
  'Who is eligible and how to claim gratuity and dues',
  '# Gratuity and Settlement

## Eligibility
- Continuous service of 5 years (with exceptions)
- Payable on resignation, retirement, or termination

## Claim Process
1. Apply to employer within 30 days
2. Approach Controlling Authority if unpaid
3. Interest payable on delays',
  6,
  'Intermediate',
  ARRAY['Gratuity', 'Settlement', 'Labor']
),
(
  'Right to Safe and Fair Workplace (OSH)',
  'labor-occupational-safety-health',
  'Labor Rights',
  'Safety standards, PPE, and reporting hazards',
  '# Occupational Safety and Health

## Rights
- Safe working conditions and necessary PPE
- Training and information on hazards
- Refuse dangerous work reasonably

## Report
- Notify safety committee or supervisor
- Escalate to labor department inspectors',
  4,
  'Beginner',
  ARRAY['Safety', 'OSH', 'Labor']
)
ON CONFLICT (slug) DO NOTHING;


