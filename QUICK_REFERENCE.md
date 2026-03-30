# Quick Reference Card

## Essential URLs
- **Landing**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Student Dashboard**: http://localhost:3000/dashboard (after login)
- **Kiosk Mode**: http://localhost:3000/kiosk (no login required)
- **AI Mentor**: http://localhost:3000/dashboard/ai-mentor

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student1@aqbobek.edu | password123 |
| Teacher | teacher1@aqbobek.edu | password123 |
| Parent | parent1@aqbobek.edu | password123 |
| Admin | admin@aqbobek.edu | password123 |

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Setup

1. **Create Supabase Project**
   - Go to supabase.com
   - Create new project

2. **Copy Schema**
   - Open Supabase SQL editor
   - Paste entire `supabase-schema.sql`
   - Execute

3. **Create .env.local**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

## File Locations - Key Files

### Authentication
- `lib/context/auth-context.tsx` - Auth state management
- `app/login/page.tsx` - Login page

### Dashboards
- `app/dashboard/page.tsx` - Role-based router
- `components/dashboard/views/` - Role-specific dashboards

### AI Mentor
- `app/api/ai-mentor/route.ts` - API endpoint
- `app/dashboard/ai-mentor/page.tsx` - Chat interface

### Kiosk Mode
- `app/kiosk/page.tsx` - Bulletin board display

### Data Services
- `lib/services/data-service.ts` - Database queries
- `lib/services/bilimclass-api.ts` - Grade API
- `lib/mock/data.ts` - Mock data

### Components
- `components/cards/` - Reusable cards
- `components/dashboard/` - Navigation & layouts
- `components/ui/` - shadcn components

## API Endpoints

### AI Mentor
```
POST /api/ai-mentor
Body: { messages: [], studentData: { grades, achievements, student } }
Response: Streaming text response
```

### BilimClass Grades
```
GET /api/bilimclass/grades?studentId=xxx
Response: { success, data: grades[] }

POST /api/bilimclass/grades
Body: { studentId, subject, grade, gradeType }
Response: { success, data: grade }
```

## Database Quick Reference

### Users Table
```sql
SELECT * FROM users WHERE id = 'user-id';
-- Columns: id, email, full_name, role, class, student_id, created_at
```

### Grades Table
```sql
SELECT * FROM grades WHERE student_id = 'student-id';
-- Columns: id, student_id, teacher_id, subject, score, max_score, date
```

### Events Table
```sql
SELECT * FROM events WHERE start_date > NOW();
-- Columns: id, title, description, start_date, end_date, location, category
```

### Achievements Table
```sql
SELECT * FROM achievements WHERE student_id = 'student-id';
-- Columns: id, student_id, title, category, level, points, awarded_date
```

## Common Tasks

### View All Users
```bash
# In browser console (after login)
const { data } = await supabase.from('users').select('*')
console.log(data)
```

### Check RLS Policies
1. Supabase Dashboard → Authentication → Policies
2. Select table and review policies

### Test AI Mentor
1. Login as student
2. Go to AI Mentor page
3. Ask: "What are my weakest subjects?"

### Enable Kiosk Mode
1. Open new browser window
2. Visit http://localhost:3000/kiosk
3. No login required - auto-scrolls through data

### Add New Subject
1. Edit `lib/mock/data.ts`
2. Add entry to mockGrades array
3. Auto-appears in grade views

## Troubleshooting

### "Supabase not found"
- Verify NEXT_PUBLIC_SUPABASE_URL in .env.local
- Check anon key is correct
- Ensure Supabase project is active

### "Auth not working"
- Clear browser cache/cookies
- Check that email exists in users table
- Verify RLS policies are correct

### "AI Mentor not responding"
- Check browser console for errors
- Verify API endpoint is /api/ai-mentor
- Check that student data is loaded

### "Grades not showing"
- Run SQL schema in Supabase
- Verify user has student_id in users table
- Check RLS policy allows read access

## Important Notes

- **Mock Data**: Uses fake data - will be replaced with real data when connected to BilimClass
- **RLS Policies**: All database operations are filtered by user role automatically
- **Auto-Redirects**: Invalid routes automatically redirect to dashboard or login
- **Type Safety**: Full TypeScript - intellisense available in IDE
- **Performance**: Server-side rendering for initial load, component optimization done

## Next Steps

1. **Customize**: Update school colors, logos, text
2. **Connect Real API**: Replace bilimclass-api mock with real endpoint
3. **Deploy**: Push to GitHub, deploy to Vercel
4. **Add Features**: Follow architecture pattern to add new features
5. **Monitor**: Set up error tracking and analytics

## Documentation Files

- `README.md` - Full feature documentation
- `SETUP.md` - Detailed setup and deployment
- `ARCHITECTURE.md` - Developer guide and patterns
- `IMPLEMENTATION.md` - What was built summary
- `QUICK_REFERENCE.md` - This file
