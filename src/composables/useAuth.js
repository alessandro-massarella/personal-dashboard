import { ref } from 'vue'
import { supabase } from '../supabase'

export const user = ref(null)
export const authInitialized = ref(false)

export const initAuth = async () => {
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user || null
  authInitialized.value = true

  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
  })
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: window.location.origin + window.location.pathname
    }
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
