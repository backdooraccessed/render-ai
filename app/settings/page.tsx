import { getUser, requireAuth } from '@/lib/auth'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  const { user, profile } = await requireAuth()

  return (
    <SettingsClient
      user={user}
      profile={profile}
    />
  )
}
