import { create } from 'zustand'
import { supabase } from '../services/supabaseClient'

/**
 * Decodes a JWT token payload (Google ID token).
 * We only need the payload (middle segment), not signature verification —
 * Google's GIS library already verifies it client-side.
 */
function decodeJwtPayload(token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    )
    return JSON.parse(jsonPayload)
}

const GUEST_SESSION_DONE_KEY = 'fairplay_guest_session_done'

const useAuthStore = create((set, get) => ({
    user: null,        // { id, googleId, email, name, avatarUrl }
    isSignedIn: false,
    isLoading: false,
    isGuest: false,
    hasCompletedGuestSession:
        typeof localStorage !== 'undefined' &&
        localStorage.getItem(GUEST_SESSION_DONE_KEY) === '1',

    continueAsGuest: () => set({ isGuest: true }),

    markGuestSessionComplete: () => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(GUEST_SESSION_DONE_KEY, '1')
        }
        set({ hasCompletedGuestSession: true })
    },

    /**
     * Called with the credential response from Google Identity Services.
     * Decodes the JWT, upserts the user in Supabase, and updates local state.
     */
    signIn: async (credentialResponse) => {
        set({ isLoading: true })

        try {
            const payload = decodeJwtPayload(credentialResponse.credential)
            const { sub: googleId, email, name, picture: avatarUrl } = payload

            if (!supabase) {
                // No Supabase — still set local user state from the JWT
                set({
                    user: { id: googleId, googleId, email, name, avatarUrl },
                    isSignedIn: true,
                    isGuest: false,
                    isLoading: false,
                })
                localStorage.setItem('fairplay_user_id', googleId)
                return true
            }

            // Upsert user in Supabase
            const { data, error } = await supabase
                .from('users')
                .upsert(
                    {
                        google_id: googleId,
                        email,
                        name,
                        avatar_url: avatarUrl,
                        last_sign_in: new Date().toISOString(),
                    },
                    { onConflict: 'google_id' }
                )
                .select()
                .single()

            if (error) {
                console.error('Supabase upsert error:', error)
                set({ isLoading: false })
                return false
            }

            const user = {
                id: data.id,
                googleId: data.google_id,
                email: data.email,
                name: data.name,
                avatarUrl: data.avatar_url,
            }

            set({ user, isSignedIn: true, isGuest: false, isLoading: false })

            // Persist user ID for session recovery
            localStorage.setItem('fairplay_user_id', data.id)

            return true
        } catch (err) {
            console.error('Sign-in error:', err)
            set({ isLoading: false })
            return false
        }
    },

    /**
     * Signs the user out — clears local state and storage.
     */
    signOut: () => {
        localStorage.removeItem('fairplay_user_id')
        set({ user: null, isSignedIn: false, isGuest: false })
    },

    /**
     * Loads saved settings from Supabase for the current user.
     * Returns the settings object, or null if none found.
     */
    loadSavedSettings: async () => {
        const { user } = get()
        if (!user || !supabase) return null

        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (error || !data) return null

            return {
                category: data.category,
                pitchDuration: data.pitch_duration,
                crueltyLevel: data.cruelty_level,
                interruptDuringPitch: data.interrupt_during_pitch,
            }
        } catch {
            return null
        }
    },

    /**
     * Saves current session settings to Supabase for the signed-in user.
     */
    saveSettings: async (settings) => {
        const { user } = get()
        if (!user || !supabase) return

        try {
            await supabase
                .from('user_settings')
                .upsert(
                    {
                        user_id: user.id,
                        category: settings.category,
                        pitch_duration: settings.pitchDuration,
                        cruelty_level: settings.crueltyLevel,
                        interrupt_during_pitch: settings.interruptDuringPitch,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'user_id' }
                )
        } catch (err) {
            console.error('Failed to save settings:', err)
        }
    },

    /**
     * Attempt to restore session from localStorage on app load.
     */
    restoreSession: async () => {
        const userId = localStorage.getItem('fairplay_user_id')
        if (!userId) return
        if (!supabase) {
            // Can't restore from Supabase, clear stale data
            localStorage.removeItem('fairplay_user_id')
            return
        }

        set({ isLoading: true })

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error || !data) {
                localStorage.removeItem('fairplay_user_id')
                set({ isLoading: false })
                return
            }

            set({
                user: {
                    id: data.id,
                    googleId: data.google_id,
                    email: data.email,
                    name: data.name,
                    avatarUrl: data.avatar_url,
                },
                isSignedIn: true,
                isGuest: false,
                isLoading: false,
            })
        } catch {
            localStorage.removeItem('fairplay_user_id')
            set({ isLoading: false })
        }
    },
}))

export default useAuthStore
