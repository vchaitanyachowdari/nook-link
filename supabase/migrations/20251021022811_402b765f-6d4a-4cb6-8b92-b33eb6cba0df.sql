-- Add Telegram integration support to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_id text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_username text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_last_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_auth_pending boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_auth_code text;

-- Create index for faster Telegram user lookups
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id ON public.profiles(telegram_id);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.telegram_id IS 'Unique Telegram user ID for bot integration';
COMMENT ON COLUMN public.profiles.telegram_auth_pending IS 'Whether user needs to authenticate via Telegram';
COMMENT ON COLUMN public.profiles.telegram_auth_code IS 'Temporary code for Telegram authentication flow';