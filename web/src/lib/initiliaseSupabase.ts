// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://eorrkdcvlifmldcobaxc.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcnJrZGN2bGlmbWxkY29iYXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg2ODU2NzYsImV4cCI6MjAxNDI2MTY3Nn0.jtQNOwTd9wkVWQRlSMeELUl-XWfr-ng9dDqXbv2Fkig'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
