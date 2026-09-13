import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.
const supabaseKey = import.meta.env.

export const supabase = createClient(supabaseUrl, supabaseKey)