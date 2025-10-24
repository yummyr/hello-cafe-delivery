import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, X } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../../api";

function ComboPage() {
  const [combos, setCombos] = useState([]);
  const [filter, setFilter] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [newCombo, setNewCombo] = useState({
    name: "",
    price: "",
    items: "",
    active: true,
    image: null,
  });

  // Load combo list
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await api.get("admin/combos");
        setCombos(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch combos:", err);
      }
    };
    fetchCombos();
  }, []);

  const filteredCombos = combos.filter(
    (combo) => (filter === "active" ? combo.active : !combo.active)
  );

  // Handle image upload
  const handleImageChange = (e) => {
    setNewCombo({ ...newCombo, image: e.target.files[0] });
  };

  // Handle new combo submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", newCombo.name);
      formData.append("price", newCombo.price);
      formData.append("items", newCombo.items);
      formData.append("active", newCombo.active ? 1 : 0);
      if (newCombo.image) formData.append("image", newCombo.image);

      const res = await api.post("admin/combos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update UI immediately
      setCombos((prev) => [...prev, res.data]);
      setShowModal(false);
      setNewCombo({ name: "", price: "", items: "", active: true, image: null });
      alert("✅ Combo added successfully!");
    } catch (err) {
      console.error("❌ Failed to add combo:", err);
      alert("Failed to add combo. Please try again.");
    }
  };

  return (
    <AdminLayout >
    <div>
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#4b3b2b]">Combo Overview</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#8d6e52] transition flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Combo
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
          onClick={() => alert("Navigating to combo management...")}
          className="ml-auto text-[#b08968] hover:underline"
        >
          Manage Combo →
        </button>
      </div>

      {/* ===== Combo Grid ===== */}
      {filteredCombos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCombos.map((combo) => (
            <div
              key={combo.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => alert(`Viewing combo: ${combo.name}`)}
            >
              <img
                src={combo.imageUrl || "/assets/default-combo.png"}
                alt={combo.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-[#4b3b2b]">
                {combo.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Includes: {combo.items || "N/A"}
              </p>
              <p className="text-[#b08968] font-bold">${combo.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">No combos found.</p>
      )}

      {/* ===== Modal for Add New Combo ===== */}
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
              Add New Combo
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  value={newCombo.name}
                  onChange={(e) =>
                    setNewCombo({ ...newCombo, name: e.target.value })
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
                  value={newCombo.price}
                  onChange={(e) =>
                    setNewCombo({ ...newCombo, price: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">
                  Included Items (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Latte, Croissant, Juice"
                  value={newCombo.items}
                  onChange={(e) =>
                    setNewCombo({ ...newCombo, items: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Active Status
                </label>
                <select
                  value={newCombo.active ? "1" : "0"}
                  onChange={(e) =>
                    setNewCombo({ ...newCombo, active: e.target.value === "1" })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Combo Image (optional)
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
                Save Combo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}

export default ComboPage;
