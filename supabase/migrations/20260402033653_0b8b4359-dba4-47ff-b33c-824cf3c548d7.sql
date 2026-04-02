INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Anyone can read resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

CREATE TABLE public.resume_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  job_role TEXT NOT NULL DEFAULT 'General',
  resume_score INTEGER NOT NULL DEFAULT 0,
  job_match_percentage INTEGER NOT NULL DEFAULT 0,
  technical_skills TEXT[] DEFAULT '{}',
  soft_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read analyses" ON public.resume_analyses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert analyses" ON public.resume_analyses FOR INSERT WITH CHECK (true);