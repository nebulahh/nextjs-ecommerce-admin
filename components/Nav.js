import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function Nav({ open }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { pathname } = router


  const inactiveLink =
    'flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600'
  const activeLink = inactiveLink + ' text-blue-600 bg-gray-100'

  return (
    <aside
      className={`flex h-[90.5vh] w-72 flex-col space-y-2 border-r-2 border-gray-200 bg-white p-2 ${
        open ? 'block' : 'hidden'
      }`}
    >
      <Link href="/" className={pathname === '/' ? activeLink : inactiveLink}>
        <span className="text-2xl">
          <i className="bx bx-home"></i>
        </span>
        <span>Dashboard</span>
      </Link>

      <Link
        href="/products"
        className={pathname.includes('/products') ? activeLink : inactiveLink}
      >
        <span className="text-2xl">
          <i className="bx bx-cart"></i>
        </span>
        <span>Products</span>
      </Link>

      {session.isAdmin === true && (
        <Link
          href="/category"
          className={pathname.includes('/category') ? activeLink : inactiveLink}
        >
          <span className="text-2xl">
            <i className="bx bx-shopping-bag"></i>
          </span>
          <span>Categories</span>
        </Link>
      )}

      <Link
        href="/orders"
        className={pathname.includes('/orders') ? activeLink : inactiveLink}
      >
        <span className="text-2xl">
          <i className="bx bx-shopping-bag"></i>
        </span>
        <span>Orders</span>
      </Link>
    </aside>
  )
}
export default Nav
