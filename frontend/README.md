# Ask SarAi - Garrison Care MVP

**Tagline:** Designed for Dignity. Powered by AI.

A comprehensive Progressive Web Application (PWA) designed specifically for older adults and their support network. This multilingual, accessible platform serves five distinct user roles with customized experiences and role-based access control.

## Features

- **Role-Based Access Control**: Five user roles (Older Adult, Family/Friend, PSW/Caregiver, Clinician, Admin/Coordinator)
- **Multilingual Support**: English and French (i18n ready)
- **Accessible Design**: WCAG 2.1 Level AA compliant
- **PWA Capabilities**: Installable, offline-capable, service worker enabled
- **Responsive Layout**: Mobile-first with bottom navigation, desktop with sidebar
- **Real-time Messaging**: Secure communication between care network members
- **Tutorial System**: Digital literacy lessons with progress tracking
- **Reminders**: Task management with upcoming, missed, and completed views
- **Settings**: Customizable accessibility options (font size, contrast)

## Tech Stack

### Frontend
- **React 18** with Vite for optimal performance
- **Tailwind CSS** for responsive, accessible design
- **React Router DOM** for routing
- **i18next** for internationalization
- **Lucide React** for icons

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** for data protection

### Design Tokens
- **Colors**: Navy (#132A49), Beige (#E8DCC2), Warm Gray (#C8C3BD)
- **Typography**: Georgia for headings, Open Sans for body text
- **Spacing**: 4/8/12/16px grid system
- **Touch Targets**: Minimum 44px for senior-friendly interaction

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase Account** (for database and authentication)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**

   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Create profiles table
   CREATE TABLE IF NOT EXISTS profiles (
     id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     email text NOT NULL,
     full_name text NOT NULL,
     role text NOT NULL CHECK (role IN ('older_adult', 'family', 'psw_caregiver', 'clinician', 'admin')),
     language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'fr')),
     accessibility_settings jsonb DEFAULT '{"fontSize": "medium", "contrast": "normal"}'::jsonb,
     created_at timestamptz DEFAULT now(),
     updated_at timestamptz DEFAULT now()
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile"
     ON profiles FOR SELECT
     TO authenticated
     USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile"
     ON profiles FOR UPDATE
     TO authenticated
     USING (auth.uid() = id)
     WITH CHECK (auth.uid() = id);

   CREATE POLICY "Users can insert own profile"
     ON profiles FOR INSERT
     TO authenticated
     WITH CHECK (auth.uid() = id);
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:5173/](http://localhost:5173/)

## Build

Build the project for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components (Header, Sidebar, BottomNav)
│   ├── dashboard/     # Role-specific dashboard components
│   └── ui/            # Reusable UI components
├── config/
│   ├── i18n.js        # Internationalization configuration
│   └── roles.js       # Role definitions and permissions
├── contexts/
│   └── AuthContext.jsx # Authentication context provider
├── lib/
│   └── supabase.js    # Supabase client configuration
├── pages/             # Page components
│   ├── Home.jsx
│   ├── Tutorials.jsx
│   ├── Reminders.jsx
│   ├── Messages.jsx
│   └── Settings.jsx
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## User Roles & Navigation

### Older Adult (Primary User)
- **Navigation**: Home / Tutorials / Reminders / Care Team / Settings
- **Focus**: Learning, self-service, simple task management

### Family / Friend
- **Navigation**: Home / Messages / Resources / Settings
- **Focus**: Monitoring, communication, supporting loved ones

### PSW / Caregiver
- **Navigation**: Home / Messages / Tutorials / Settings
- **Focus**: Task management, communication, quick references

### Clinician
- **Navigation**: Home / Messages / Resources / Settings
- **Focus**: Client management, insights, communication

### Admin / Coordinator
- **Navigation**: Home / Content / Settings
- **Focus**: User management, analytics, platform oversight

## Accessibility Features

- **WCAG 2.1 Level AA Compliant**
- **High Contrast Mode**: Toggle between normal and high contrast
- **Adjustable Font Sizes**: Small, Medium, Large, Extra Large
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Large Touch Targets**: Minimum 44px for easy interaction
- **Focus Indicators**: Clear visual focus states

## PWA Features

- **Installable**: Add to home screen on mobile and desktop
- **Offline Capable**: Service worker caches essential resources
- **App-like Experience**: Standalone display mode
- **Fast Loading**: Optimized performance with Vite

## Security

- **Row Level Security (RLS)**: Database-level access control
- **Authentication**: Supabase Auth with email/password
- **Role-Based Permissions**: Granular access control per feature
- **No PHI Storage**: Privacy-by-design, pseudonymized data only
- **Secure Communication**: All data transmitted over HTTPS

## Internationalization

The application supports English and French. To add a new language:

1. Update `src/config/i18n.js` with new translations
2. Add language option to the language selector
3. Update the database schema to support the new language code

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - Garrison Care

## Support

For support, please contact: support@garrisoncare.com

## Acknowledgments

- Designed for dignity and powered by AI
- Built with accessibility and user experience as top priorities
- Follows design principles from Garrison Care Brand Guidelines
