import React, { useEffect, useState } from "react";
import { Edit, Ban, Check, PlusCircle, X, Trash2 } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../../api";
import { formatDateTime } from "../../../utils/date";

function MenuPage() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    image: null,
    description: "",
  });

  // select all /none
  const handleSelectIds = (e) => {
    if (e.target.checked) {
      setSelectedIds(menuItems.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value === "" ? null : parseInt(value));
  };
  // single select checkbox
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const deleteCheckedItems = async (ids) => {
    // fomate params,if single id, convert it to list
    const idList = Array.isArray(ids) ? ids : [ids];
    console.log("try to delete id list", idList);

    const confirmMessage =
      idList.length === 1
        ? "Are you sure you want to delete this item?"
        : `Are you sure you want to delete ${idList.length} items?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const res = await api.delete("/admin/menu", { data: idList });
      console.log("Successfully deleted items");

      setMenuItems((prev) => prev.filter((item) => !idList.includes(item.id)));
      setSelectedIds((prev) => prev.filter((id) => !idList.includes(id)));

      alert(`Successfully deleted ${idList.length} item(s)`);
    } catch (error) {
      console.error("Failed to delete items:", error);
      alert("Failed to delete items. Please try again.");
    }
  };
  // Load menu list
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("admin/menu");
        console.log("Successfully fetch menu page:", res.data.data.records);

        setMenuItems(res.data.data.records);
      } catch (err) {
        console.error("❌ Failed to fetch menu items:", err);
      }
    };
    fetchMenu();
  }, []);

  // Handle image select
  const handleImageChange = (e) => {
    setNewItem({ ...newItem, image: e.target.files[0] });
  };

  const toggleStatus = (id) => {};

  // Submit new item
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      formData.append("description", newItem.description);

      if (newItem.image) formData.append("image", newItem.image);

      const res = await api.post("admin/menu", formData);

      // Add the new item to UI immediately
      setMenuItems((prev) => [...prev, res.data]);
      setShowModal(false);
      setNewItem({
        name: "",
        price: "",
        image: null,
        description: "",
      });
      alert("✅ Menu item added successfully!");
    } catch (err) {
      console.error("❌ Failed to add item:", err);
      alert("Failed to add item. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* ===== Search and Action Bar ===== */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            {/* Search and Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              {/* Menu Item Name Search */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#4b3b2b]">
                  Menu Item Name
                </label>
                <input
                  type="text"
                  placeholder="Enter menu item name"
                  className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#4b3b2b]">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#4b3b2b]">
                  Menu Item Status
                </label>
                <select
                  value={statusFilter === null ? "" : statusFilter.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStatusFilter(value === "" ? null : parseInt(value));
                  }}
                  className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 lg:pt-0">
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#8d6e52] transition flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Item
              </button>

              <button
                onClick={() => deleteCheckedItems(selectedIds)}
                disabled={selectedIds.length === 0}
                className={`px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap ${
                  selectedIds.length === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#ef4444] text-white hover:bg-[#dc2626]"
                }`}
              >
                <Trash2 size={16} />
                Delete Selected ({selectedIds.length})
              </button>
            </div>
          </div>
        </div>

        {/* ===== Filter Tabs ===== */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium ${
              statusFilter === "active"
                ? "bg-[#b08968] text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("inactive")}
            className={`px-4 py-2 rounded-lg font-medium ${
              statusFilter === "inactive"
                ? "bg-[#b08968] text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Inactive
          </button>
        </div>

        {/* ===== Table to display menu items ===== */}

        <div>
          <table className="w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-[#f8f4ef] text-left text-[#4b3b2b] border-b border-gray-200">
                <th className="py-3 px-4">
                  <input
                    type="checkbox"
                    onChange={handleSelectIds}
                    checked={
                      menuItems.length > 0 &&
                      selectedIds.length === menuItems.length
                    }
                  />
                </th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Update Time</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b hover:bg-[#f8f4ef] transition ${
                    selectedIds.includes(item.id) ? "bg-amber-50" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">{item.image}</td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">{item.price}</td>
                  <td className="py-3 px-4">
                    {item.status === 1 ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-gray-500">Inactive</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {formatDateTime(item.updateTime)}
                  </td>
                  <td className="py-3 px-4 text-center flex justify-center gap-3">
                    <button
                      className="text-[#b08968] hover:text-[#8d6e52]"
                      onClick={() => openModal(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`${
                        item.status === 1
                          ? "text-red-500 hover:text-red-700"
                          : "text-green-600 hover:text-green-800"
                      }`}
                    >
                      {item.status === 1 ? (
                        <Ban className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => deleteCheckedItems(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete item"
                    >
                      {" "}
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
                  <label className="block text-sm text-gray-700">
                    Category
                  </label>
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
