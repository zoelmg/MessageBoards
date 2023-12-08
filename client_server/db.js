const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cknkpcxmnlymvgehbyjt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbmtwY3htbmx5bXZnZWhieWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5OTY4NjgsImV4cCI6MjAxNzU3Mjg2OH0.L3aEb6R2lWGbNoii-DSqslwni9dF6aoUBelD30iVrEY';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
