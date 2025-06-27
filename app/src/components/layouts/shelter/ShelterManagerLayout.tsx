// src/components/layouts/ShelterManagerLayout.tsx
import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import clsx from "clsx"
import { MoveLeft } from "lucide-react"

const navItems = [
  { label: "Hồ sơ trạm", path: "profile" },
  { label: "Thành viên", path: "members" },
]

export default function ShelterManagerLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 border-r">
        <p className="flex flex-row gap-2 py-2 cursor-pointer"><MoveLeft  className="h-5 w-5"/> <p className="my-auto">Quay về</p></p>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Quản lý trạm</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "px-4 py-2 rounded-md text-sm font-medium",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
              end
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Nội dung */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  )
}
