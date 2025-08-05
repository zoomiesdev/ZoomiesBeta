# 🚀 Zoomies Backend Setup Guide

## Prerequisites
- Node.js v20+ (already installed)
- Supabase account (free tier available)

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your GitHub account
3. **Create New Project**
   - Choose your organization
   - Enter project name: `zoomies-beta`
   - Enter database password (save this!)
   - Choose region closest to you
   - Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click "API"** in the sidebar
3. **Copy these values:**
   - Project URL (starts with `https://`)
   - Anon/Public Key (starts with `eyJ`)

## Step 3: Update Environment Variables

1. **Open `.env.local`** in your project
2. **Replace the placeholder values:**

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the entire contents** of `database-schema.sql`
3. **Paste and run** the SQL in the editor
4. **Click "Run"** to create all tables and policies

## Step 5: Test the Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit http://localhost:5173**

3. **Check the browser console** for any connection errors

## Step 6: Enable Authentication (Optional)

1. **Go to Authentication > Settings** in Supabase
2. **Configure your site URL:**
   - Add `http://localhost:5173` for development
   - Add your production URL when ready

## Database Tables Created

- **users** - User profiles and stats
- **animals** - Animal ambassador profiles
- **posts** - Social media posts
- **comments** - Post comments
- **post_likes** - Post likes
- **follows** - User follows
- **animal_follows** - Animal follows
- **donations** - Donation records
- **sanctuaries** - Sanctuary information
- **badges** - Achievement badges
- **user_badges** - User earned badges

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Authentication policies** for user data protection
- **Public read access** for posts and animals
- **Authenticated write access** for user content

## Next Steps

1. **Create authentication components** (login/signup forms)
2. **Connect existing components** to use real data
3. **Add image upload functionality** using Supabase Storage
4. **Implement real-time features** using Supabase subscriptions
5. **Add payment processing** for donations

## Troubleshooting

**Common Issues:**

1. **"Invalid API key"** - Check your environment variables
2. **"Table doesn't exist"** - Run the SQL schema again
3. **"CORS error"** - Add your domain to Supabase settings
4. **"RLS policy error"** - Check the policies in the SQL schema

**Need Help?**
- Check Supabase documentation
- Review the service files in `src/services/`
- Check browser console for detailed error messages 