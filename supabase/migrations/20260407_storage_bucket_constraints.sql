UPDATE storage.buckets
SET file_size_limit = 2097152,
    allowed_mime_types = '{"image/jpeg","image/png","image/webp","image/gif"}'
WHERE id = 'avatars';

UPDATE storage.buckets
SET file_size_limit = 4194304,
    allowed_mime_types = '{"image/jpeg","image/png","image/webp","image/gif"}'
WHERE id = 'covers';

UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = '{"image/jpeg","image/png","image/webp","image/gif"}'
WHERE id = 'posts';
