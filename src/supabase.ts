import { createClient } from "@supabase/supabase-js";

const SUPABSE_URL = "https://lritmmsapgljfjknpfkv.supabase.co";
const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyaXRtbXNhcGdsamZqa25wZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgzNDYyMzEsImV4cCI6MTk4MzkyMjIzMX0.M80K_-JbMP9LpwJsaaWOwLuTIEiGTVheRGlr-lDUJpE";

const supabase = createClient(SUPABSE_URL, SUPABASE_PUBLIC_KEY);

export default supabase;
