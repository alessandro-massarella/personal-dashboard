import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oyxmwdqeiajgrfcykrdw.supabase.co'
const supabaseKey = 'sb_publishable_Ww7tKHISnqTdY2D7S3h64A_D88MusZ_'

export const supabase = createClient(supabaseUrl, supabaseKey)
