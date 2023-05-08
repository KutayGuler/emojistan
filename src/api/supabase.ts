import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vuiyurkhfceaoxddvvnf.supabase.co';
const SUPABASE_PUBLIC_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aXl1cmtoZmNlYW94ZGR2dm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM1MjkyNTAsImV4cCI6MTk5OTEwNTI1MH0.ZV9G0lmCwJbSuWXF_lzNVfGTIlV8C08bAlpFfoOpktI';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

export default supabase;
