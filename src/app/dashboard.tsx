// Create a new file: components/Dashboard.tsx
"use client";

import { useState } from "react";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isVerified");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold flex items-center">
                <span className="text-white bg-blue-600 px-2 py-1 rounded-lg">
                  B
                </span>
                <span className="relative mx-1">
                  <span className="text-orange-400 absolute -top-1 left-0 text-sm">
                    •
                  </span>
                  <span className="text-gray-800">i</span>
                </span>
                <span className="text-gray-800">saMe</span>
              </div>
              <span className="ml-4 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Verified ✓
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                Sell Item
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {[
                  { id: "overview", label: "Overview", icon: "📊" },
                  { id: "profile", label: "My Profile", icon: "👤" },
                  { id: "products", label: "My Products", icon: "📦" },
                  { id: "orders", label: "My Orders", icon: "🛒" },
                  { id: "messages", label: "Messages", icon: "💬" },
                  { id: "settings", label: "Settings", icon: "⚙️" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        activeSection === item.id
                          ? "bg-orange-50 text-orange-600 border border-orange-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeSection === "overview" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Welcome to Your Dashboard!
                  </h1>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">
                            Total Products
                          </p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">
                            12
                          </p>
                        </div>
                        <div className="text-blue-500 text-2xl">📦</div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">
                            Active Orders
                          </p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">
                            5
                          </p>
                        </div>
                        <div className="text-green-500 text-2xl">🛒</div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">
                            Messages
                          </p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">
                            3
                          </p>
                        </div>
                        <div className="text-purple-500 text-2xl">💬</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="bg-white border border-gray-200 p-4 rounded-lg hover:border-orange-300 transition-colors text-left">
                        <div className="text-orange-500 text-lg mb-2">➕</div>
                        <h3 className="font-medium text-gray-800">
                          Add New Product
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          List a new item for sale
                        </p>
                      </button>

                      <button className="bg-white border border-gray-200 p-4 rounded-lg hover:border-orange-300 transition-colors text-left">
                        <div className="text-orange-500 text-lg mb-2">👀</div>
                        <h3 className="font-medium text-gray-800">
                          Browse Marketplace
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Discover new products
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "profile" && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    My Profile
                  </h1>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">John Doe</h2>
                        <p className="text-gray-600">+233 123 456 789</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <p className="mt-1 text-gray-600">
                          john.doe@example.com
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <p className="mt-1 text-gray-600">Accra, Ghana</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "products" && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    My Products
                  </h1>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Your listed products will appear here.
                    </p>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Add Your First Product
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "orders" && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    My Orders
                  </h1>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Your order history will appear here.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === "messages" && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Messages
                  </h1>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Your messages will appear here.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === "settings" && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Settings
                  </h1>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Account Settings
                      </h3>
                      <div className="space-y-4">
                        <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                          Change Password
                        </button>
                        <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                          Notification Preferences
                        </button>
                        <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                          Privacy Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
