/*
* Hlavný serverový súbor
* Tento súbor sa vždy spustí pri novej požiadavke na stránku/aplikáciu
*/


//Importneme potrebné knižnice
import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

//Importujeme verejné premenné z .env súboru
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

//Vytvoríme funkciu, ktorá sa spustí pri každej požiadavke
const supabase: Handle = async ({ event, resolve }) => {
  /**
   * 
   * Vytvoríme nový Supabase klient špecifický pre túto serverovú požiadavku.
   *
   * Supabase klient získa Auth token z cookies požiadavky.
   * 
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      /**t
       * 
       * SvelteKit cookies API vyžaduje, aby `path` bol explicitne nastavený
       * v možnostiach cookies. Nastavenie `path` na `/` replikuje predchádzajúce/
       * štandardné správanie.
       * 
       */
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' })
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' })
      },
    },
  })

  /**
   * 
   * Narozdiel od `supabase.auth.getSession()`, ktorý vráti session bez validácie
   * JWT, táto funkcia taktiež vyvolá `getUser()` na validáciu JWT pred vrátením session
   * 
   */
  event.locals.safeGetSession = async () => {
    // Získame data zo session cookies.
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null }
    }

    // Získame data používateľa.
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      // JWT verifikácia prebehla neúspešne
      return { session: null, user: null }
    }

    return { session, user }
  }

  // Pokračujeme v spracovaní požiadavky
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * 
       * Supabase knižnice používajú hlavičky `content-range` a `x-supabase-api-version`,
       * takže musíme povedať SvelteKitu, aby ich preniesol.
       * 
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}

//Vytvoríme funkciu, ktorá sa spustí pri každej požiadavke
const authGuard: Handle = async ({ event, resolve }) => {
  //Získame session a používateľa
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  if (!event.locals.session && event.url.pathname.startsWith('/private')) {
    return redirect(303, '/auth')
  }

  if (event.locals.session && event.url.pathname === '/auth') {
    return redirect(303, '/private')
  }

  return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)