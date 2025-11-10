/*
  # CozyMentor Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `avatar_url` (text, optional)
      - `bio` (text, optional)
      - `skills_can_help` (text[], skills user can help with)
      - `skills_need_help` (text[], things user wants help with)
      - `points` (integer, default 10)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `questions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `content` (text)
      - `tags` (text[])
      - `status` (text, default 'waiting')
      - `points_cost` (integer, default 1)
      - `created_at` (timestamp)
    
    - `sessions`
      - `id` (uuid, primary key)
      - `question_id` (uuid, references questions)
      - `mentor_id` (uuid, references profiles)
      - `mentee_id` (uuid, references profiles)
      - `status` (text, default 'active')
      - `duration_minutes` (integer, default 10)
      - `created_at` (timestamp)
      - `completed_at` (timestamp, optional)
    
    - `messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references sessions)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `type` (text, default 'text')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public information
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  skills_can_help text[] DEFAULT '{}',
  skills_need_help text[] DEFAULT '{}',
  points integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched', 'completed')),
  points_cost integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) NOT NULL,
  mentor_id uuid REFERENCES profiles(id) NOT NULL,
  mentee_id uuid REFERENCES profiles(id) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  duration_minutes integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) NOT NULL,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  type text DEFAULT 'text' CHECK (type IN ('text', 'emoji')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Questions policies
CREATE POLICY "Users can read all questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Sessions policies
CREATE POLICY "Users can read sessions they're part of"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Users can insert sessions as mentor"
  ON sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Users can update sessions they're part of"
  ON sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Messages policies
CREATE POLICY "Users can read messages from sessions they're in"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = messages.session_id 
      AND (sessions.mentor_id = auth.uid() OR sessions.mentee_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in sessions they're in"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = session_id 
      AND (sessions.mentor_id = auth.uid() OR sessions.mentee_id = auth.uid())
    )
  );
-- Allow users to select their own profile
CREATE POLICY "Allow select for own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();