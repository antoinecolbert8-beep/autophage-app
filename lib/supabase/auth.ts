import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const getSupabaseAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';
const getSupabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabase: any = null;
let _supabaseAdmin: any = null;

function getSupabase() {
    if (_supabase) return _supabase;
    _supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
    return _supabase;
}

function getSupabaseAdmin() {
    if (_supabaseAdmin) return _supabaseAdmin;
    const serviceKey = getSupabaseServiceKey();
    if (!serviceKey) return null;
    _supabaseAdmin = createClient(getSupabaseUrl(), serviceKey);
    return _supabaseAdmin;
}

/**
 * AUTH SERVICE
 * Production-ready authentication with Supabase
 */
export const authService = {
    /**
     * Sign in with email and password
     */
    async signIn(email: string, password: string) {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    /**
     * Sign up with email and password
     */
    async signUp(email: string, password: string, metadata?: Record<string, any>) {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    /**
     * Sign out current user
     */
    async signOut() {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
    },

    /**
     * Get current session
     */
    async getSession() {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            throw new Error(error.message);
        }
        return data.session;
    },

    /**
     * Get current user
     */
    async getCurrentUser() {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            return null;
        }
        return data.user;
    },

    /**
     * Reset password
     */
    async resetPassword(email: string) {
        const supabase = getSupabase();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
        });

        if (error) {
            throw new Error(error.message);
        }
    },

    /**
     * Update password
     */
    async updatePassword(newPassword: string) {
        const supabase = getSupabase();
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            throw new Error(error.message);
        }
    },

    /**
     * Listen to auth state changes (for client components)
     */
    onAuthStateChange(callback: (event: string, session: any) => void) {
        const supabase = getSupabase();
        return supabase.auth.onAuthStateChange(callback);
    },
};

export default authService;
