import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pwfotvwpkkxatvmdsfbn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3Zm90dndwa2t4YXR2bWRzZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyOTk0NzQsImV4cCI6MjA3Njg3NTQ3NH0.YtM4ZzZWtqMUsG3R3hheMbItF7hpd-4vTpRGzzg6EHc'

export const supabase = createClient(supabaseUrl, supabaseKey)
