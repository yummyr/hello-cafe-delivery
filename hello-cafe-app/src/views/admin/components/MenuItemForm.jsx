import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import api from "../../../api";

function MenuItemForm({ mode = "add", onSuccess, onCancel }) {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    image: null,
    oldImageUrl: null,
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
  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategoryList(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      alert("Failed to load categories");
    }
  };

  // 编辑模式下获取菜单项详情
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
        image: null,
        oldImageUrl: item.image || null,
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

  // 处理图片选择
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("categoryId", formData.categoryId || "");

      if (formData.oldImageUrl) {
        formDataToSend.append("oldImageUrl", formData.oldImageUrl);
      }

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      let res;
      if (isEditMode) {
        const itemId = id || editingItemId;
        res = await api.put(`/admin/menu/${itemId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/admin/menu", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 成功回调
      if (onSuccess) {
        onSuccess(res.data.data);
      } else {
        // 默认行为：跳转回菜单页面
        navigate("/admin/menu");
      }

      alert(`Menu item ${isEditMode ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error(`Failed to ${isEditMode ? "update" : "add"} item:`, err);
      alert(`Failed to ${isEditMode ? "update" : "add"} item. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/admin/menu");
    }
  };

  if (loading && isEditMode) {
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
              placeholder="Enter menu item name"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
              placeholder="Enter item description"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image {!isEditMode && "(optional)"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm border border-gray-300 rounded-lg p-3"
            />

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                />
              </div>
            )}
          </div>
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
      </form>
    </div>
  );
}

export default MenuItemForm;