-- Fix the overly permissive INSERT policy on notifications
-- Replace "true" with proper workspace-based check

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Only allow inserting notifications for users in the same workspace
CREATE POLICY "Users can create notifications in their workspace" ON public.notifications
    FOR INSERT WITH CHECK (
        workspace_id = public.get_user_workspace(auth.uid())
        OR workspace_id IS NULL
    );

-- Also add a trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, job_title)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'job_title', 'Team Member')
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();