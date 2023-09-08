import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import useOnClickOutside from 'use-onclickoutside'

function DashboardHeader({ changeAsideStatus, setMenuOpen }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const { data: session } = useSession()
  const navRef = useRef(null)
  const router = useRouter()

  const closeMenu = () => {
    setMenuOpen(false)
  }
  // useOnClickOutside(navRef, closeMenu)
  async function logOut() {
    await router.push('/')
    await signOut()
  }
  return (
    <header className="flex w-full items-center justify-between border-b-2 border-gray-200 bg-white p-2">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="text-3xl"
          // ref={navRef}
          onClick={() => changeAsideStatus()}
        >
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAATElEQVRIS2NkoDFgpLH5DKMWEAzhAQmi/wSdhV8BiqOx+YDmFlDoAVTtAxIHNPcBzeOA5hbQPIiGvgU0jwOaWzD042DUByghQPPSFABt6AYZfO/+XQAAAABJRU5ErkJggg==" />
        </button>
        <div>Logo</div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setProfileOpen(!profileOpen)}
          className="h-9 w-9 overflow-hidden rounded-full"
        >
          <img
            src={
              session?.user?.image ? session?.user?.image :
              '/user_placeholder.png'
            }
            alt="profile image"
          />
        </button>

        <div
          className={`absolute right-2 mt-1 w-48 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white shadow-md ${
            profileOpen ? 'block' : 'hidden'
          }`}
          x-transition="true"
        >
          <div className="flex items-center space-x-2 p-2">
            <img
              src={session?.user?.image || '/user_placeholder.png'}
              alt="profile image"
              className="h-9 w-9 rounded-full"
            />
            <div className="font-medium">{session?.user?.name}</div>
          </div>

          <div className="p-2">
            <button
              onClick={logOut}
              className="flex items-center space-x-2 transition hover:text-blue-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              <div>Log Out</div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
export default DashboardHeader
