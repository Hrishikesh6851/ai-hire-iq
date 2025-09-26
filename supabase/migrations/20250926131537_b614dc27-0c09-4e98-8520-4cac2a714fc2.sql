-- Add some default job categories with skills keywords
INSERT INTO public.job_categories (name, description, skills_keywords) VALUES
  ('Software Engineer', 'Software development and programming roles', ARRAY['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue']),
  ('Data Scientist', 'Data analysis and machine learning roles', ARRAY['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'Statistics', 'Data Analysis']),
  ('DevOps Engineer', 'Infrastructure and deployment roles', ARRAY['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Linux', 'Terraform', 'CI/CD', 'Azure', 'GCP', 'Ansible']),
  ('UI/UX Designer', 'User interface and experience design roles', ARRAY['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'UI Design', 'UX Design', 'Prototyping', 'Wireframing', 'User Research']),
  ('Product Manager', 'Product strategy and management roles', ARRAY['Product Management', 'Agile', 'Scrum', 'Analytics', 'Strategy', 'Roadmap', 'Requirements', 'Stakeholder Management', 'Market Research', 'User Stories']),
  ('Mobile Developer', 'Mobile application development roles', ARRAY['iOS', 'Android', 'Swift', 'Kotlin', 'React Native', 'Flutter', 'Xamarin', 'Objective-C', 'Java', 'Dart']),
  ('Backend Engineer', 'Server-side development roles', ARRAY['Node.js', 'Python', 'Java', 'PHP', 'Ruby', 'Go', 'C#', 'SQL', 'NoSQL', 'API', 'Microservices', 'REST']),
  ('Frontend Engineer', 'Client-side development roles', ARRAY['React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Sass', 'Webpack', 'Redux']);