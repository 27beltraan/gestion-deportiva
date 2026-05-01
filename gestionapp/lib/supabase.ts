import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkelaapbblczdatlujzn.supabase.co'
const supabaseKey = 'sb_publishable_5QNe-dHYtITKFNXTSn-Vtw_39XguUzW'

export const supabase = createClient(supabaseUrl, supabaseKey)