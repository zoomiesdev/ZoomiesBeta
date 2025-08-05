# Sanctuary Onboarding System

## Overview

The sanctuary onboarding system allows animal sanctuaries and shelters to sign up for Zoomies and start posting animal profiles. The system includes a multi-step onboarding process with verification and animal profile creation.

## Features

### 1. User Type Selection
- **Regular User**: Connect with animals, follow sanctuaries, support causes
- **Sanctuary/Shelter**: Create animal profiles, share updates, raise funds

### 2. Multi-Step Onboarding Process
1. **Account Creation**: Email, password, basic info
2. **Sanctuary Details**: Name, location, description, contact info
3. **Verification**: Upload documents and photos for verification
4. **First Animal**: Add the first animal profile to get started

### 3. Sanctuary Dashboard
- Manage animal profiles
- Add new animals with photos
- View statistics and status
- Edit existing profiles

## Database Schema

### Users Table Additions
```sql
-- Sanctuary-specific fields
ALTER TABLE users 
ADD COLUMN sanctuary_name TEXT,
ADD COLUMN sanctuary_description TEXT,
ADD COLUMN sanctuary_website TEXT,
ADD COLUMN sanctuary_phone TEXT,
ADD COLUMN verification_documents TEXT[],
ADD COLUMN sanctuary_photos TEXT[],
ADD COLUMN verification_status TEXT DEFAULT 'pending';
```

### Animals Table
```sql
-- Animal profiles
CREATE TABLE animals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  sanctuary TEXT NOT NULL,
  about TEXT,
  profile_img TEXT,
  cover_img TEXT,
  donation_goal DECIMAL DEFAULT 0,
  donation_raised DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Storage Buckets

### 1. sanctuary-uploads
- **Purpose**: Verification documents and sanctuary photos
- **Access**: Public read, authenticated upload
- **Structure**: `{user_id}/{timestamp}.{extension}`

### 2. animal-photos
- **Purpose**: Animal profile and cover images
- **Access**: Public read, authenticated upload
- **Structure**: `{user_id}/{timestamp}.{extension}`

## Components

### 1. UserTypeSelection.jsx
- Landing page for user type selection
- Routes to appropriate signup flow
- Clean, intuitive interface

### 2. SanctuaryOnboarding.jsx
- Multi-step form component
- Progress indicator
- File upload handling
- Validation at each step

### 3. SanctuaryDashboard.jsx
- Dashboard for sanctuary users
- Animal profile management
- Statistics and overview
- Add/edit animal functionality

## Services

### 1. animalService.js
```javascript
// Key functions
- getAllAnimals()
- getAnimalsBySanctuary(sanctuaryId)
- createAnimal(animalData)
- updateAnimal(animalId, updates)
- deleteAnimal(animalId)
- followAnimal(animalId)
- unfollowAnimal(animalId)
```

### 2. storageService.js
```javascript
// Key functions
- uploadFile(file, bucket, path)
- deleteFile(path, bucket)
```

## Setup Instructions

### 1. Database Setup
Run the following SQL scripts in order:
```bash
# Add user type field
psql -f add-user-type-field.sql

# Add sanctuary fields
psql -f add-sanctuary-fields.sql

# Update user creation function
psql -f update-user-function.sql
```

### 2. Storage Setup
In Supabase Dashboard:

1. **Create sanctuary-uploads bucket**:
   - Name: `sanctuary-uploads`
   - Public: Yes
   - Run: `setup-sanctuary-storage.sql`

2. **Create animal-photos bucket**:
   - Name: `animal-photos`
   - Public: Yes
   - Run: `setup-animal-storage.sql`

### 3. Component Integration
Update your app to use the new components:

```jsx
// In your main App.jsx or routing
import UserTypeSelection from './components/UserTypeSelection';
import SanctuaryOnboarding from './components/SanctuaryOnboarding';
import SanctuaryDashboard from './pages/SanctuaryDashboard';
```

## User Flow

### For Regular Users:
1. Click "Sign In / Sign Up"
2. Select "Regular User"
3. Complete standard signup
4. Access regular user features

### For Sanctuaries:
1. Click "Sign In / Sign Up"
2. Select "Sanctuary/Shelter"
3. Complete 4-step onboarding:
   - Account creation
   - Sanctuary details
   - Verification uploads
   - First animal profile
4. Access sanctuary dashboard

## Verification Process

### Documents Required:
- Business license
- 501(c)(3) status (if applicable)
- Animal welfare permits
- Sanctuary photos

### Verification Status:
- `pending`: Awaiting review
- `approved`: Verified sanctuary
- `rejected`: Failed verification

## Security & Permissions

### RLS Policies:
- Users can only access their own data
- Public read access for animal photos
- Authenticated upload for documents
- Sanctuary-specific data isolation

### File Upload Security:
- File type validation
- Size limits
- User-specific folders
- Public read, private write

## Future Enhancements

### Planned Features:
1. **Admin Verification Panel**: Review sanctuary applications
2. **Analytics Dashboard**: Track engagement and donations
3. **Animal Profile Templates**: Pre-built templates for different species
4. **Integration APIs**: Connect with existing sanctuary management systems
5. **Mobile App**: Native mobile experience for sanctuaries

### Advanced Features:
1. **Donation Integration**: Stripe/PayPal for fundraising
2. **Event Management**: Schedule and manage sanctuary events
3. **Volunteer Coordination**: Manage volunteer schedules
4. **Medical Records**: Track animal health and treatments
5. **Adoption Process**: Streamline adoption applications

## Support

For technical support or questions about the sanctuary onboarding system, please refer to the main README.md or contact the development team.

## Testing

### Manual Testing Checklist:
- [ ] User type selection works
- [ ] Sanctuary onboarding flow completes
- [ ] File uploads work correctly
- [ ] Dashboard displays animal profiles
- [ ] Add animal functionality works
- [ ] Verification status updates properly
- [ ] RLS policies are enforced
- [ ] Storage buckets are accessible

### Automated Testing:
```bash
# Run component tests
npm test SanctuaryOnboarding
npm test UserTypeSelection
npm test SanctuaryDashboard

# Run service tests
npm test animalService
npm test storageService
``` 