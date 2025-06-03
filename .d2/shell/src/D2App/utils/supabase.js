import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://wfltdiresploykgexcts.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmbHRkaXJlc3Bsb3lrZ2V4Y3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTkwMTksImV4cCI6MjA2MzA5NTAxOX0.LMgKjIISxzU1X70CwPTvTHU1vVOYJtwHJqyKhENPBi0";

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error("Supabase URL or Key is missing in environment variables.");
// }

export const supabase = createClient(supabaseUrl, supabaseKey);