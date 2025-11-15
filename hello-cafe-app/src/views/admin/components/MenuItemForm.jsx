import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Plus } from "lucide-react";
import api from "../../../api";

function MenuItemForm({ mode = "add", onSuccess, onCancel }) {
  const navigate = useNavigate();
  const { id } = useParams();
  // Predefined flavor options
  const FLAVOR_OPTIONS = {
    Sweetness: ["Full Sugar", "Half Sugar", "Less Sugar", "No Sugar"],
    "Ice Level": ["No Ice", "Less Ice", "Regular Ice"],
    "Milk Option": [
      "Whole Milk",
      "Skim Milk",
      "Oat Milk",
      "Almond Milk",
      "No Milk",
    ],
    "Espresso Shots": ["Single", "Double", "Triple"],
    "Spicy Level": ["Mild", "Medium", "Spicy", "Very Spicy"],
  };
  const [selectedFlavorType, setSelectedFlavorType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    status: 1, // 1 = selling, 0 = not selling
    image: null,
    oldImageUrl: null,
    flavors: [], // Array of {name: "", options: [""]}
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchMenuItem(id);
    }
  }, [id]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategoryList(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      alert("Failed to load categories");
    }
  };

  // Fetch menu item details for edit mode
  const fetchMenuItem = async (itemId) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/menu/${itemId}`);
      const item = res.data.data;

      setFormData({
        name: item.name || "",
        price: item.price || "",
        description: item.description || "",
        categoryId: item.categoryId || "",
        status: item.status !== undefined ? item.status : 1,
        image: null,
        oldImageUrl: item.image || null,
        flavors: item.flavors || [],
      });

      if (item.image) {
        setImagePreview(item.image);
      }

      setEditingItemId(itemId);
    } catch (err) {
      console.error("Failed to fetch menu item:", err);
      alert("Failed to load menu item details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    if (isEditMode && id) {
      fetchMenuItem(id);
    } else if (isEditMode && !id) {
      console.warn("Edit mode requires an item ID");
    }
  }, [isEditMode, id]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., 2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  };

  // Add a new flavor type
  const addFlavorType = () => {
    if (!selectedFlavorType) {
      alert("Please select a flavor type");
      return;
    }

    // Check if flavor already exists
    const exists = formData.flavors.some(
      (flavor) => flavor.name === selectedFlavorType
    );
    if (exists) {
      alert("This flavor type has already been added");
      return;
    }

    // Add new flavor with all available options selected by default
    const newFlavor = {
      name: selectedFlavorType,
      options: [...FLAVOR_OPTIONS[selectedFlavorType]],
    };

    setFormData((prev) => ({
      ...prev,
      flavors: [...prev.flavors, newFlavor],
    }));

    setSelectedFlavorType("");
  };
  // Remove flavor
  // Remove entire flavor type
  const removeFlavor = (flavorName) => {
    setFormData((prev) => ({
      ...prev,
      flavors: prev.flavors.filter((flavor) => flavor.name !== flavorName),
    }));
  };

  // Remove a specific option from a flavor
  const removeFlavorOption = (flavorName, optionToRemove) => {
    setFormData((prev) => ({
      ...prev,
      flavors: prev.flavors.map((flavor) => {
        if (flavor.name === flavorName) {
          const newOptions = flavor.options.filter(
            (option) => option !== optionToRemove
          );
          // Keep at least one option
          if (newOptions.length === 0) {
            alert(
              "A flavor must have at least one option. Remove the entire flavor instead."
            );
            return flavor;
          }
          return { ...flavor, options: newOptions };
        }
        return flavor;
      }),
    }));
  };
  // Get available flavor types (not already added)
  const availableFlavorTypes = Object.keys(FLAVOR_OPTIONS).filter(
    (flavorType) =>
      !formData.flavors.some((flavor) => flavor.name === flavorType)
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("categoryId", formData.categoryId || "");
      formDataToSend.append("status", formData.status);
      // Add flavors as JSON string
      if (formData.flavors.length > 0) {
        const flavorsForBackend = formData.flavors.map((flavor) => ({
          name: flavor.name,
          value: flavor.options,
        }));
        formDataToSend.append("flavors", JSON.stringify(flavorsForBackend));
      }

      if (formData.oldImageUrl) {
        formDataToSend.append("oldImageUrl", formData.oldImageUrl);
      }

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      let res;
      if (isEditMode && id) {
        const itemId = id || editingItemId;
        res = await api.put(`/admin/menu/${itemId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/admin/menu", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Update UI immediately
      if (onSuccess) {
        onSuccess(res.data.data);
      } else {
        // Refresh the menu
        navigate("/admin/menu");
      }

      alert(`Menu item ${isEditMode ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error(`Failed to ${isEditMode ? "update" : "add"} item:`, err);
      alert(
        `Failed to ${isEditMode ? "update" : "add"} item. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  /*************  ✨ Windsurf Command 🌟  *************/
  // handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/admin/menu");
    }
  };

  if (loading && isEditMode && !formData.name) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading menu item details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#4b3b2b]">
          {isEditMode ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>
        {onCancel && (
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
              placeholder="Enter menu item name"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price($) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
            >
              <option value="">Select category</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={1}
                  checked={formData.status === 1}
                  onChange={() => setFormData({ ...formData, status: 1 })}
                  className="mr-2 w-4 h-4 text-[#b08968] focus:ring-[#b08968]"
                />
                <span className="text-gray-700">Selling</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={0}
                  checked={formData.status === 0}
                  onChange={() => setFormData({ ...formData, status: 0 })}
                  className="mr-2 w-4 h-4 text-[#b08968] focus:ring-[#b08968]"
                />
                <span className="text-gray-700">Not Selling</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
              placeholder="Enter item description"
            />
          </div>

          {/* Image Upload */}

          <div className="space-y-4 md:col-span-2 ">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Image
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image {isEditMode && "(optional)"}
                <span className="text-gray-500 text-xs ml-2">
                  (Max size: 2MB, formats: JPG, PNG, GIF)
                </span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
                className="w-full text-sm border border-gray-300 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#b08968] file:text-white hover:file:bg-[#8d6e52] file:cursor-pointer"
              />

              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300 shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/default-no-img.png";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: null });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flavors Section */}
          {/* Add Flavor Type */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <select
                value={selectedFlavorType}
                onChange={(e) => setSelectedFlavorType(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select flavor type to add</option>
                {availableFlavorTypes.map((flavorType) => (
                  <option key={flavorType} value={flavorType}>
                    {flavorType}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addFlavorType}
                disabled={!selectedFlavorType}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Flavor
              </button>
            </div>

            {/* Display Added Flavors */}
            {formData.flavors.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No flavors added yet. Select a flavor type above to add
                customization options.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.flavors.map((flavor) => (
                  <div
                    key={flavor.name}
                    className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                  >
                    {/* Flavor Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">
                        {flavor.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFlavor(flavor.name)}
                        className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm"
                      >
                        <X className="w-4 h-4" />
                        Remove Flavor
                      </button>
                    </div>

                    {/* Flavor Options as Tags */}
                    <div className="flex flex-wrap gap-2">
                      {flavor.options.map((option) => (
                        <div
                          key={option}
                          className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
                        >
                          <span>{option}</span>
                          <button
                            type="button"
                            onClick={() =>
                              removeFlavorOption(flavor.name, option)
                            }
                            className="hover:bg-blue-200 rounded-full p-0.5 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Show warning if only one option left */}
                    {flavor.options.length === 1 && (
                      <p className="text-xs text-amber-600 mt-2">
                        ⚠️ This is the last option. Remove the entire flavor if
                        you don't need it.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#b08968] text-white py-3 rounded-lg font-medium hover:bg-[#8d6e52] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : isEditMode ? "Update Item" : "Save Item"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MenuItemForm;
