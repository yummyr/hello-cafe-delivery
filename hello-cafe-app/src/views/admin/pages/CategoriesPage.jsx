import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import axios from "axios";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Example API endpoint
      const res = await axios.get("http://localhost:8080/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // You can add search logic here
    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(filterName.toLowerCase())
    );
    setCategories(filtered);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleDisable = (id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "Active" ? "Disabled" : "Active" } : c
      )
    );
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-[#f8f4ef] min-h-screen">
        <h1 className="text-2xl font-bold text-[#4b3b2b] mb-6">Category Management</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Category Name:</label>
            <input
              type="text"
              placeholder="Enter category name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-[#b08968] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Category Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-[#b08968] focus:outline-none"
            >
              <option value="">Select Type</option>
              <option value="Dish">Dish Category</option>
              <option value="Combo">Combo Category</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="bg-[#4b3b2b] text-white px-5 py-2 rounded-md hover:bg-[#3a2f24] transition"
          >
            Search
          </button>

          <div className="flex gap-3 ml-auto">
            <button className="bg-[#4b3b2b] text-white px-4 py-2 rounded-md hover:bg-[#3a2f24] transition">
              + Add Dish Category
            </button>
            <button className="bg-[#b08968] text-white px-4 py-2 rounded-md hover:bg-[#8d6e52] transition">
              + Add Combo Category
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="bg-[#f0e8df] text-[#4b3b2b]">
              <tr>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Type</th>
                <th className="py-3 px-4 border-b">Sort Order</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Updated At</th>
                <th className="py-3 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#f9f6f2]">
                    <td className="py-3 px-4 border-b">{cat.name}</td>
                    <td className="py-3 px-4 border-b">{cat.type}</td>
                    <td className="py-3 px-4 border-b">{cat.sort || "-"}</td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          cat.status === "Active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {cat.status}
                    </td>
                    <td className="py-3 px-4 border-b">{cat.updatedAt || "—"}</td>
                    <td className="py-3 px-4 border-b text-center space-x-3">
                      <button className="text-[#007bff] hover:underline">Edit</button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-[#e74c3c] hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleDisable(cat.id)}
                        className="text-[#b08968] hover:underline"
                      >
                        {cat.status === "Active" ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;
