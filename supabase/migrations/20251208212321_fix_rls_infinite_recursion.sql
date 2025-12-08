/*
  # Fix RLS Infinite Recursion

  1. Problem
    - Policy "Admins can read all roles" on rel_users_app_roles creates infinite recursion
    - The policy queries rel_users_app_roles to check permissions for reading rel_users_app_roles
    
  2. Solution
    - Create SECURITY DEFINER function to check user roles (bypasses RLS)
    - Update all policies to use this function instead of direct joins
    
  3. Changes
    - Add fn_get_user_role() function with SECURITY DEFINER
    - Drop and recreate policies on cli_properties
    - Drop and recreate policies on rel_users_app_roles
*/

-- Create helper function to get user's role (bypasses RLS with SECURITY DEFINER)
CREATE OR REPLACE FUNCTION fn_get_user_role(uid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT ar.name
  FROM rel_users_app_roles r
  JOIN cst_app_roles ar ON ar.id = r.role_id
  WHERE r.user_id = uid
  LIMIT 1;
$$;

-- Drop existing policies on cli_properties that use the recursive pattern
DROP POLICY IF EXISTS "Admins and managers can insert properties" ON cli_properties;
DROP POLICY IF EXISTS "Admins and managers can update properties" ON cli_properties;
DROP POLICY IF EXISTS "Super admins can delete properties" ON cli_properties;

-- Recreate policies using the helper function
CREATE POLICY "Admins and managers can insert properties"
  ON cli_properties
  FOR INSERT
  TO authenticated
  WITH CHECK (
    fn_get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
  );

CREATE POLICY "Admins and managers can update properties"
  ON cli_properties
  FOR UPDATE
  TO authenticated
  USING (
    fn_get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
  )
  WITH CHECK (
    fn_get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
  );

CREATE POLICY "Super admins can delete properties"
  ON cli_properties
  FOR DELETE
  TO authenticated
  USING (
    fn_get_user_role(auth.uid()) = 'super_admin'
  );

-- Drop existing recursive policy on rel_users_app_roles
DROP POLICY IF EXISTS "Admins can read all roles" ON rel_users_app_roles;

-- Recreate policy using the helper function
CREATE POLICY "Admins can read all roles"
  ON rel_users_app_roles
  FOR SELECT
  TO authenticated
  USING (
    fn_get_user_role(auth.uid()) IN ('super_admin', 'admin')
  );
