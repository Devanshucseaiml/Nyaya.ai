-- Insert document templates
INSERT INTO document_templates (title, description, category, complexity, estimated_time, slug, icon, popular, fields, template_content) VALUES
(
    'Rental Agreement',
    'Comprehensive rental agreement for residential properties',
    'Property',
    'Moderate',
    15,
    'rental-agreement',
    'Home',
    true,
    '[
        {"id": "landlord_name", "label": "Landlord Name", "type": "text", "required": true, "placeholder": "Enter landlord''s full name"},
        {"id": "tenant_name", "label": "Tenant Name", "type": "text", "required": true, "placeholder": "Enter tenant''s full name"},
        {"id": "property_address", "label": "Property Address", "type": "textarea", "required": true, "placeholder": "Enter complete property address"},
        {"id": "monthly_rent", "label": "Monthly Rent (₹)", "type": "number", "required": true, "placeholder": "Enter monthly rent amount"},
        {"id": "security_deposit", "label": "Security Deposit (₹)", "type": "number", "required": true, "placeholder": "Enter security deposit amount"},
        {"id": "lease_duration", "label": "Lease Duration", "type": "select", "required": true, "options": ["6 months", "1 year", "2 years", "3 years"]},
        {"id": "start_date", "label": "Lease Start Date", "type": "date", "required": true},
        {"id": "special_terms", "label": "Special Terms & Conditions", "type": "textarea", "required": false, "placeholder": "Any additional terms or conditions"}
    ]',
    'RENTAL AGREEMENT

This Rental Agreement is made on {start_date} between {landlord_name} (Landlord) and {tenant_name} (Tenant) for the property located at {property_address}.

TERMS AND CONDITIONS:

1. RENT: The monthly rent is ₹{monthly_rent}, payable on or before the 5th of each month.

2. SECURITY DEPOSIT: A security deposit of ₹{security_deposit} has been paid by the tenant.

3. LEASE DURATION: This agreement is valid for {lease_duration} starting from {start_date}.

4. SPECIAL TERMS: {special_terms}

5. MAINTENANCE: The tenant shall maintain the property in good condition.

6. TERMINATION: Either party may terminate this agreement with 30 days written notice.

Landlord Signature: _________________    Tenant Signature: _________________
{landlord_name}                         {tenant_name}

Date: _______________                   Date: _______________'
),
(
    'Employment Contract',
    'Standard employment contract with terms and conditions',
    'Employment',
    'Complex',
    25,
    'employment-contract',
    'Briefcase',
    true,
    '[
        {"id": "company_name", "label": "Company Name", "type": "text", "required": true, "placeholder": "Enter company name"},
        {"id": "employee_name", "label": "Employee Name", "type": "text", "required": true, "placeholder": "Enter employee full name"},
        {"id": "position", "label": "Job Position", "type": "text", "required": true, "placeholder": "Enter job title/position"},
        {"id": "salary", "label": "Monthly Salary (₹)", "type": "number", "required": true, "placeholder": "Enter monthly salary"},
        {"id": "start_date", "label": "Employment Start Date", "type": "date", "required": true},
        {"id": "probation_period", "label": "Probation Period", "type": "select", "required": true, "options": ["3 months", "6 months", "1 year"]},
        {"id": "working_hours", "label": "Working Hours", "type": "text", "required": true, "placeholder": "e.g., 9 AM to 6 PM"},
        {"id": "benefits", "label": "Benefits & Allowances", "type": "textarea", "required": false, "placeholder": "List any benefits, allowances, or perks"}
    ]',
    'EMPLOYMENT CONTRACT

This Employment Contract is entered into on {start_date} between {company_name} (Company) and {employee_name} (Employee).

EMPLOYMENT TERMS:

1. POSITION: The employee is hired for the position of {position}.

2. COMPENSATION: Monthly salary of ₹{salary} will be paid by the 1st of each month.

3. WORKING HOURS: {working_hours}, Monday to Friday.

4. PROBATION: The employee will be on probation for {probation_period}.

5. BENEFITS: {benefits}

6. CONFIDENTIALITY: Employee agrees to maintain confidentiality of company information.

7. TERMINATION: Either party may terminate with 30 days written notice.

Company Representative: _________________    Employee: _________________
{company_name}                             {employee_name}

Date: _______________                      Date: _______________'
),
(
    'Legal Notice',
    'Formal legal notice for various purposes',
    'Legal',
    'Simple',
    8,
    'legal-notice',
    'FileText',
    true,
    '[
        {"id": "sender_name", "label": "Sender Name", "type": "text", "required": true, "placeholder": "Your full name"},
        {"id": "sender_address", "label": "Sender Address", "type": "textarea", "required": true, "placeholder": "Your complete address"},
        {"id": "recipient_name", "label": "Recipient Name", "type": "text", "required": true, "placeholder": "Recipient full name"},
        {"id": "recipient_address", "label": "Recipient Address", "type": "textarea", "required": true, "placeholder": "Recipient complete address"},
        {"id": "notice_subject", "label": "Subject of Notice", "type": "text", "required": true, "placeholder": "Brief subject of the legal notice"},
        {"id": "notice_details", "label": "Details of Issue", "type": "textarea", "required": true, "placeholder": "Detailed description of the issue"},
        {"id": "demand_action", "label": "Demanded Action", "type": "textarea", "required": true, "placeholder": "What action you want the recipient to take"},
        {"id": "time_limit", "label": "Time Limit for Response", "type": "select", "required": true, "options": ["7 days", "15 days", "30 days", "60 days"]}
    ]',
    'LEGAL NOTICE

To: {recipient_name}
Address: {recipient_address}

From: {sender_name}
Address: {sender_address}

Date: _______________

Subject: {notice_subject}

Sir/Madam,

TAKE NOTICE that {notice_details}

You are hereby called upon to {demand_action} within {time_limit} from the receipt of this notice, failing which my client will be constrained to take appropriate legal action against you at your risk as to costs and consequences.

This notice is served upon you to avoid unnecessary litigation.

Yours faithfully,

{sender_name}'
)
ON CONFLICT (slug) DO NOTHING;
