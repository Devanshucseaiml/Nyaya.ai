# Lawyer Directory Setup Guide

This guide will help you set up the complete lawyer directory functionality in your Nyaya.ai application.

## 🎯 **What You'll Get**

- ✅ **Complete Lawyer Directory** - Browse all lawyers with detailed profiles
- ✅ **Advanced Filtering** - Filter by specialization, location, and more
- ✅ **Search Functionality** - Search lawyers by name, bio, or practice areas
- ✅ **Lawyer Profiles** - Detailed individual lawyer pages
- ✅ **Consultation Booking** - Book consultations with lawyers
- ✅ **Reviews & Ratings** - Lawyer reviews and rating system
- ✅ **Responsive Design** - Works on all devices

## 📋 **Setup Steps**

### **Step 1: Database Setup**

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Complete Setup Script**
   - Copy the entire content from `scripts/setup_lawyer_database.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Verify Setup**
   - You should see success messages and counts
   - Check that you have 6 lawyers, 12 specializations, and mappings

### **Step 2: Test the Application**

1. **Start your development server**
   ```bash
   pnpm dev
   ```

2. **Navigate to the Lawyer Directory**
   - Go to `http://localhost:3000/lawyers`
   - Or click "Find Lawyers" in the navigation menu

3. **Test the Features**
   - ✅ Browse all lawyers
   - ✅ Use search functionality
   - ✅ Filter by specialization
   - ✅ Filter by location
   - ✅ Sort by rating, experience, or fees
   - ✅ Click on lawyer profiles
   - ✅ Book consultations (if logged in)

## 🗄️ **Database Structure**

### **Tables Created:**

1. **`lawyers`** - Main lawyer information
   - Basic info (name, email, phone, bio)
   - Professional details (experience, bar council number)
   - Practice areas and languages
   - Location and consultation fees
   - Ratings and verification status

2. **`lawyer_specializations`** - Legal practice areas
   - Criminal Law, Family Law, Corporate Law, etc.
   - 12 different specializations included

3. **`lawyer_specialization_mapping`** - Links lawyers to specializations
   - Many-to-many relationship

4. **`consultation_requests`** - Booking system
   - Users can book consultations
   - Different consultation types (online, in-person, phone)

5. **`lawyer_reviews`** - Review and rating system
   - Users can rate and review lawyers
   - Automatic rating calculations

### **Sample Data Included:**

- **6 Sample Lawyers** with different specializations
- **12 Legal Specializations** covering major practice areas
- **Sample Reviews** and ratings
- **Multiple Locations** (New Delhi, Mumbai, Bangalore, etc.)

## 🔧 **Features Available**

### **For Users:**
- Browse all available lawyers
- Search by name, specialization, or keywords
- Filter by location and practice area
- Sort by rating, experience, or consultation fees
- View detailed lawyer profiles
- Book consultations (when logged in)
- Read and write reviews

### **For Lawyers:**
- Professional profiles with specializations
- Consultation booking management
- Review and rating system
- Verification badges for trusted lawyers

## 🎨 **UI Components**

### **Lawyer Directory Page (`/lawyers`)**
- Search bar with filters
- Grid layout of lawyer cards
- Sorting and filtering options
- Responsive design

### **Lawyer Profile Page (`/lawyers/[id]`)**
- Detailed lawyer information
- Specializations and experience
- Reviews and ratings
- Consultation booking form

### **Consultation Booking (`/lawyers/[id]/consult`)**
- Booking form with date/time selection
- Consultation type selection
- Subject and description fields

## 🚀 **Troubleshooting**

### **If Lawyers Don't Appear:**

1. **Check Database Setup**
   ```sql
   SELECT COUNT(*) FROM lawyers;
   SELECT COUNT(*) FROM lawyer_specializations;
   ```

2. **Check Console Logs**
   - Open browser developer tools
   - Look for any error messages
   - Check the "LawyerDirectory props" log

3. **Verify RLS Policies**
   - Make sure Row Level Security is properly configured
   - Check that the "Lawyers are viewable by everyone" policy exists

### **If Search/Filters Don't Work:**

1. **Check Data Structure**
   - Ensure lawyer_specialization_mapping exists
   - Verify that practice_areas arrays are populated

2. **Check Component Props**
   - Look at the console logs for data structure
   - Ensure all required fields are present

## 📱 **Mobile Responsiveness**

The lawyer directory is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ All screen sizes

## 🔒 **Security Features**

- **Row Level Security (RLS)** enabled on all tables
- **User authentication** required for booking consultations
- **Verified lawyer badges** for trusted professionals
- **Secure data access** with proper policies

## 🎯 **Next Steps**

After setup, you can:

1. **Add More Lawyers** - Use the same database structure
2. **Customize Specializations** - Add or modify practice areas
3. **Enhance Profiles** - Add more fields like education, awards, etc.
4. **Add Payment Integration** - Connect with payment gateways
5. **Real-time Chat** - Implement lawyer-client messaging
6. **Video Consultations** - Add video calling features

## 📞 **Support**

If you encounter any issues:

1. Check the browser console for error messages
2. Verify the database setup was successful
3. Ensure all SQL scripts ran without errors
4. Check that your Supabase connection is working

The lawyer directory should now be fully functional! 🎉
