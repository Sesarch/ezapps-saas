'use client'

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      })
      window.location.href = 'https://ezapps.app'
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if fetch fails
      window.location.href = 'https://ezapps.app'
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  )
}
