-- Create a table for the Coordinate Game rankings
create table if not exists coordinate_game_rankings (
  id uuid default gen_random_uuid() primary key,
  student_name text not null,
  score integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Add Row Level Security (RLS) policies if needed for a public game
-- Allow anyone to insert their score
alter table coordinate_game_rankings enable row level security;
create policy "Allow anonymous inserts" on coordinate_game_rankings for insert with check (true);
create policy "Allow anonymous selects" on coordinate_game_rankings for select using (true);
