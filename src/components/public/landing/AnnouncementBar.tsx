import Link from "next/link"

export const AnnouncementBar = () => {
  return (
    <div className="bg-yellow-50 border-b border-yellow-100 pt-16">
      <div className="container mx-auto px-4 py-2 text-center">
        <span className="text-sm text-gray-700">
          B360 is hiring! Explore our positions and{" "}
          <Link href="#" className="underline font-medium">
            apply today
          </Link>
          .
        </span>
      </div>
    </div>
  )
}
