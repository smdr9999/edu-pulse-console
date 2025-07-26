-- Create students table
CREATE TABLE public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  grade_level VARCHAR(10) NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100),
  subject VARCHAR(100),
  hire_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code VARCHAR(20) UNIQUE NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  description TEXT,
  teacher_id UUID REFERENCES public.teachers(id),
  grade_level VARCHAR(10) NOT NULL,
  credits INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id, attendance_date)
);

-- Create activity_logs table for recent activity
CREATE TABLE public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  entity_type VARCHAR(50), -- 'student', 'teacher', 'course', etc.
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - in production you'd want proper auth)
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow all operations on teachers" ON public.teachers FOR ALL USING (true);
CREATE POLICY "Allow all operations on courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Allow all operations on attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_logs" ON public.activity_logs FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.students (student_id, first_name, last_name, email, grade_level) VALUES
('STU001', 'John', 'Doe', 'john.doe@school.edu', '10'),
('STU002', 'Jane', 'Smith', 'jane.smith@school.edu', '11'),
('STU003', 'Mike', 'Johnson', 'mike.johnson@school.edu', '12'),
('STU004', 'Sarah', 'Wilson', 'sarah.wilson@school.edu', '9');

INSERT INTO public.teachers (teacher_id, first_name, last_name, email, department, subject) VALUES
('TCH001', 'Robert', 'Brown', 'robert.brown@school.edu', 'Mathematics', 'Algebra'),
('TCH002', 'Lisa', 'Davis', 'lisa.davis@school.edu', 'Science', 'Chemistry'),
('TCH003', 'David', 'Miller', 'david.miller@school.edu', 'English', 'Literature');

INSERT INTO public.courses (course_code, course_name, teacher_id, grade_level) VALUES
('MATH101', 'Algebra I', (SELECT id FROM public.teachers WHERE teacher_id = 'TCH001'), '9'),
('SCI201', 'Chemistry', (SELECT id FROM public.teachers WHERE teacher_id = 'TCH002'), '11'),
('ENG301', 'Literature', (SELECT id FROM public.teachers WHERE teacher_id = 'TCH003'), '12');

-- Insert sample attendance data
INSERT INTO public.attendance (student_id, course_id, attendance_date, status)
SELECT 
  s.id,
  c.id,
  CURRENT_DATE - INTERVAL '7 days' + (generate_series(0, 6) || ' days')::INTERVAL,
  CASE 
    WHEN random() > 0.1 THEN 'present'
    WHEN random() > 0.05 THEN 'late'
    ELSE 'absent'
  END
FROM public.students s
CROSS JOIN public.courses c
WHERE random() > 0.3; -- Only add attendance for some student-course combinations

-- Insert sample activity logs
INSERT INTO public.activity_logs (activity_type, description, entity_type) VALUES
('enrollment', 'New student John Doe enrolled in Grade 10', 'student'),
('course_creation', 'New course "Advanced Mathematics" created', 'course'),
('attendance_marked', 'Attendance marked for Chemistry class', 'attendance'),
('teacher_added', 'New teacher Lisa Davis joined Science department', 'teacher'),
('grade_updated', 'Grades updated for Literature class', 'course');