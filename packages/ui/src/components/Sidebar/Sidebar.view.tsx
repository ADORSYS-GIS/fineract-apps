import React from "react";
import { SidebarProps } from "./Sidebar.types";
import { LogOut } from "lucide-react";

export const SidebarView: React.FC<SidebarProps> = ({ menuItems, onLogout, className }) => {
  return (
    <aside className={`h-screen w-64 bg-white shadow-lg flex flex-col justify-between ${className}`}>
      {/* Logo */}
      <div className="p-4 text-2xl font-bold text-blue-600">OnlineBank</div>

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.link}
              className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 border rounded-lg p-2 hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
