-- Allow public read access for resumes bucket objects so edge functions can fetch files via public URL
CREATE POLICY "Public can view resumes (read-only)"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes');