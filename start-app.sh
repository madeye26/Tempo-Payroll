#!/bin/bash
echo "Setting up environment variables..."
export VITE_SUPABASE_URL=https://dreamy-colden8-l6gjb.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWFteS1jb2xkZW44LWw2Z2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1MzA0MDAsImV4cCI6MjAzMzEwNjQwMH0.Yx-Ky_Ht_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij

echo "Starting the application..."
npm run build
npm run preview
