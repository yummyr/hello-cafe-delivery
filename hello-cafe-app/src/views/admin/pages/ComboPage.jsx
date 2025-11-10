import React, { useEffect, useState } from "react";
import { PlusCircle, X, Edit2, Trash2, Power, PowerOff } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../../api";

function ComboPage() {
  const [combos, setCombos] = useState([]);
  const [filteredCombos, setFilteredCombos] = useState([]);
  const [filter, setFilter] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  const [newCombo, setNewCombo] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
    status: 1,
    comboItems: [],
    image: null,
  });

  // API functions
  const getCombos = async (params = {}) => {
    try {
      const response = await api.get('/admin/combo_item/page', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching combos:', error);
      throw error;
    }
  };

  const getComboById = async (id) => {
    try {
      const response = await api.get(`/admin/combo_item/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching combo:', error);
      throw error;
    }
  };

  const createCombo = async (comboData) => {
    try {
      const response = await api.post('/admin/combo_item', comboData);
      return response.data;
    } catch (error) {
      console.error('Error creating combo:', error);
      throw error;
    }
  };

  const updateCombo = async (comboData) => {
    try {
      const response = await api.put('/admin/combo_item', comboData);
      return response.data;
    } catch (error) {
      console.error('Error updating combo:', error);
      throw error;
    }
  };

  const deleteCombos = async (ids) => {
    try {
      const response = await api.delete('/admin/combo_item', {
        params: { ids: ids.join(',') }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting combos:', error);
      throw error;
    }
  };

  const changeComboStatus = async (id, status) => {
    try {
      const response = await api.post(`/admin/combo_item/status/${status}`, null, {
        params: { id }
      });
      return response.data;
    } catch (error) {
      console.error('Error changing combo status:', error);
      throw error;
    }
  };

  // Load combo list
  useEffect(() => {
    fetchCombos();
  }, [filter, pagination.page, pagination.pageSize]);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        status: filter === "active" ? 1 : filter === "inactive" ? 0 : undefined
      };

      const response = await getCombos(params);

      if (response.code === 1 && response.data) {
        const comboData = response.data.records || [];
        setCombos(comboData);
        setFilteredCombos(comboData);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0
        }));
      } else {
        console.error("Invalid response format:", response);
        setCombos([]);
        setFilteredCombos([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch combos:", err);
      setCombos([]);
      setFilteredCombos([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setNewCombo({ ...newCombo, image: e.target.files[0] });
  };

  // Handle combo submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const comboData = {
        name: newCombo.name,
        categoryId: newCombo.categoryId || null,
        price: parseFloat(newCombo.price),
        description: newCombo.description,
        status: newCombo.status,
        comboItems: newCombo.comboItems || []
      };

      let response;
      if (isEditMode && currentCombo) {
        // Update existing combo
        comboData.id = currentCombo.id;
        response = await updateCombo(comboData);
      } else {
        // Create new combo
        response = await createCombo(comboData);
      }

      if (response.code === 1) {
        await fetchCombos();
        setShowModal(false);
        resetForm();
        alert(`✅ Combo ${isEditMode ? 'updated' : 'created'} successfully!`);
      } else {
        alert(`Failed to ${isEditMode ? 'update' : 'create'} combo: ${response.msg}`);
      }
    } catch (err) {
      console.error(`❌ Failed to ${isEditMode ? 'update' : 'create'} combo:`, err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} combo. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewCombo({
      name: "",
      categoryId: "",
      price: "",
      description: "",
      status: 1,
      comboItems: [],
      image: null,
    });
    setIsEditMode(false);
    setCurrentCombo(null);
  };

  // Handle edit combo
  const handleEditCombo = async (combo) => {
    try {
      const response = await getComboById(combo.id);
      if (response.code === 1 && response.data) {
        const comboData = response.data;
        setNewCombo({
          name: comboData.name || "",
          categoryId: comboData.categoryId || "",
          price: comboData.price?.toString() || "",
          description: comboData.description || "",
          status: comboData.status || 1,
          comboItems: comboData.comboItems || [],
          image: null,
        });
        setCurrentCombo(combo);
        setIsEditMode(true);
        setShowModal(true);
      }
    } catch (err) {
      console.error("❌ Failed to fetch combo details:", err);
      alert("Failed to fetch combo details. Please try again.");
    }
  };

  // Handle delete combo
  const handleDeleteCombo = async (comboId) => {
    if (!window.confirm("Are you sure you want to delete this combo?")) {
      return;
    }

    try {
      const response = await deleteCombos([comboId]);
      if (response.code === 1) {
        await fetchCombos();
        alert("✅ Combo deleted successfully!");
      } else {
        alert("Failed to delete combo: " + response.msg);
      }
    } catch (err) {
      console.error("❌ Failed to delete combo:", err);
      alert("Failed to delete combo. Please try again.");
    }
  };

  // Handle change combo status
  const handleChangeStatus = async (comboId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const action = newStatus === 1 ? "activate" : "deactivate";

    try {
      const response = await changeComboStatus(comboId, newStatus);
      if (response.code === 1) {
        await fetchCombos();
        alert(`✅ Combo ${action}d successfully!`);
      } else {
        alert(`Failed to ${action} combo: ` + response.msg);
      }
    } catch (err) {
      console.error(`❌ Failed to ${action} combo:`, err);
      alert(`Failed to ${action} combo. Please try again.`);
    }
  };

  return (
    <AdminLayout >
    <div>
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#4b3b2b]">Combo Overview</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
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
        <div className="ml-auto text-sm text-gray-600">
          Total: {pagination.total} combos
        </div>
      </div>

      {/* ===== Combo Grid ===== */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#b08968]"></div>
          <p className="mt-2 text-gray-600">Loading combos...</p>
        </div>
      ) : filteredCombos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCombos.map((combo) => (
            <div
              key={combo.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="relative">
                <img
                  src={combo.image || "/assets/default-combo.png"}
                  alt={combo.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                  combo.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {combo.status === 1 ? 'Active' : 'Inactive'}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#4b3b2b] mb-2">
                {combo.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {combo.description || 'No description available'}
              </p>
              <p className="text-[#b08968] font-bold text-lg mb-3">${combo.price}</p>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCombo(combo);
                  }}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeStatus(combo.id, combo.status);
                  }}
                  className={`flex-1 px-3 py-2 rounded transition flex items-center justify-center gap-1 ${
                    combo.status === 1
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {combo.status === 1 ? (
                    <>
                      <PowerOff className="w-4 h-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCombo(combo.id);
                  }}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-[#4b3b2b] mb-4">
              {isEditMode ? 'Edit Combo' : 'Add New Combo'}
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
                  Description
                </label>
                <textarea
                  placeholder="Enter combo description..."
                  value={newCombo.description}
                  onChange={(e) =>
                    setNewCombo({ ...newCombo, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newCombo.status}
                  onChange={(e) =>
                    setNewCombo({ ...newCombo, status: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#b08968]"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
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
                {newCombo.image && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {newCombo.image.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#b08968] text-white py-2 rounded-lg font-medium hover:bg-[#8d6e52] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (isEditMode ? 'Update Combo' : 'Save Combo')}
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
