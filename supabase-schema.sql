-- Aqbobek Lyceum Portal Database Schema
-- Copy and paste this into your Supabase SQL editor to create all tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase auth integration)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  class TEXT,
  student_id TEXT UNIQUE,
  teacher_id TEXT UNIQUE,
  parent_child_ids TEXT[], -- Array of student IDs for parents
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  grade DECIMAL(5, 2) NOT NULL CHECK (grade >= 0 AND grade <= 100),
  assignment TEXT,
  recorded_date TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location TEXT,
  category TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attendee_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level TEXT DEFAULT 'bronze' CHECK (level IN ('gold', 'silver', 'bronze')),
  awarded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  awarded_date TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_teacher_id ON grades(teacher_id);
CREATE INDEX idx_grades_recorded_date ON grades(recorded_date);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_achievements_student_id ON achievements(student_id);
CREATE INDEX idx_achievements_awarded_date ON achievements(awarded_date);
CREATE INDEX idx_users_role ON users(role);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for grades table
CREATE POLICY "Students can view their own grades" ON grades
  FOR SELECT USING (
    auth.uid() = student_id OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('teacher', 'admin')
  );

CREATE POLICY "Teachers can insert grades" ON grades
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('teacher', 'admin')
  );

CREATE POLICY "Teachers can update their grades" ON grades
  FOR UPDATE USING (
    teacher_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- RLS Policies for events table
CREATE POLICY "Everyone can view events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for achievements table
CREATE POLICY "Students and admins can view achievements" ON achievements
  FOR SELECT USING (
    auth.uid() = student_id OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('teacher', 'admin')
  );

CREATE POLICY "Teachers and admins can insert achievements" ON achievements
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('teacher', 'admin')
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON grades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
