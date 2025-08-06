-- Test if animal_type column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'animals' AND column_name = 'animal_type';

-- Test inserting an animal (replace sanctuary_name with actual sanctuary name)
INSERT INTO animals (
  name, 
  animal_type, 
  species, 
  sanctuary, 
  about, 
  profile_img, 
  cover_img, 
  donation_goal, 
  donation_raised, 
  status
) VALUES (
  'Test Animal',
  'Dog',
  'Golden Retriever',
  'Test Sanctuary',
  'A test animal for debugging',
  null,
  null,
  0,
  0,
  'Active'
) RETURNING *;

-- Clean up test data
DELETE FROM animals WHERE name = 'Test Animal'; 