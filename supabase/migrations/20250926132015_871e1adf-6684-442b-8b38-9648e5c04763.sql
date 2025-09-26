-- Update the resumes bucket to be public so files can be accessed via public URLs
UPDATE storage.buckets 
SET public = true 
WHERE id = 'resumes';