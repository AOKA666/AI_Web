import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 })
  }

  revalidatePath('/', 'layout')

  const acceptHeader = request.headers.get('accept') || ''
  if (acceptHeader.includes('text/html')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.json({ success: true })
}
