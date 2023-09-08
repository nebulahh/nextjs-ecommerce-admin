import Link from 'next/link'

function Home() {
  return (
    <div className="flex justify-center gap-4 items-center min-h-screen w-full">
      <Link href={'/login'} className="p-3 text-green-600 bg-purple-800 rounded-md">
        Login
      </Link>
      <Link href={'/signup'} className="p-3 text-blue-600 rounded-md bg-gray-800">
        Register
      </Link>
    </div>
  )
}
export default Home
