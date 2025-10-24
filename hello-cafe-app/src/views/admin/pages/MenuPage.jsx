import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, X } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../../api";

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [filter, setFilter] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    active: true,
    image: null,
  });

  // Load menu list
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("admin/menu");
        setMenuItems(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch menu items:", err);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter(
    (item) => (filter === "active" ? item.active : !item.active)
  );

  // Handle image select
  const handleImageChange = (e) => {
    setNewItem({ ...newItem, image: e.target.files[0] });
  };

  // Submit new item
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      formData.append("category", newItem.category);
      formData.append("active", newItem.active ? 1 : 0);
      if (newItem.image) formData.append("image", newItem.image);

      const res = await api.post("admin/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add the new item to UI immediately
      setMenuItems((prev) => [...prev, res.data]);
      setShowModal(false);
      setNewItem({ name: "", price: "", category: "", active: true, image: null });
      alert("✅ Menu item added successfully!");
    } catch (err) {
      console.error("❌ Failed to add item:", err);
      alert("Failed to add item. Please try again.");
    }
  };

  return (
    <AdminLayout >
    <div>
      {/* ===== Title & Button ===== */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#4b3b2b]">Menu Overview</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#8d6e52] transition flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* ===== Filter Tabs ===== */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "active"
              ? "bg-[#b08968] text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("inactive")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "inactive"
              ? "bg-[#b08968] text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Inactive
        </button>
        <button
          onClick={() => alert("Navigating to menu management...")}
          className="ml-auto text-[#b08968] hover:underline"
        >
          Manage Menu →
        </button>
      </div>

      {/* ===== Menu Cards ===== */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => alert(`Viewing ${item.name}`)}
            >
              <img
                src={item.imageUrl || "/assets/default-food.png"}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-[#4b3b2b]">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {item.category || "Uncategorized"}
              </p>
              <p className="text-[#b08968] font-bold">${item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">No items found.</p>
      )}

      {/* ===== Modal for Add New Item ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-[#4b3b2b] mb-4">
              Add New Menu Item
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Category</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Active Status
                </label>
                <select
                  value={newItem.active ? "1" : "0"}
                  onChange={(e) =>
                    setNewItem({ ...newItem, active: e.target.value === "1" })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#b08968] text-white py-2 rounded-lg font-medium hover:bg-[#8d6e52] transition"
              >
                Save Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}

export default MenuPage;
