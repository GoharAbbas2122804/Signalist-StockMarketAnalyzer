'use client'

import { useEffect } from 'react'
import { useGuestSession } from '@/lib/context/GuestSessionContext'

type ClientSessionSyncProps = {
  user: User
}

const ClientSessionSync = ({ user }: ClientSessionSyncProps) => {
  const { isGuest, enterGuestMode, exitGuestMode } = useGuestSession()

  useEffect(() => {
    if (user.isGuest && !isGuest) {
      enterGuestMode({ silent: true })
    } else if (!user.isGuest && isGuest) {
      exitGuestMode()
    }
  }, [user.isGuest, isGuest, enterGuestMode, exitGuestMode])

  return null
}

export default ClientSessionSync

