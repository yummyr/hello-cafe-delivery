import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Pagination from "../../../components/Pagination";
import api from "../../../api";
import { formatDateTime } from "../../../utils/date";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // modal states
  const [showFormModal, setShowFormModal] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "1",
  });

  useEffect(() => {
    fetchCategories(page, pageSize);
  }, []);

  const fetchCategories = async (page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/categories/page", {
        params: { page, pageSize },
      });

      setCategories(res.data.data.records || []);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFilterName(value);
    if (value.trim() == "") {
      fetchCategories(page, pageSize);
    }
  };
  const handleTypeChange = (e) => {
    const rawValue = e.target.value;
    const parsedValue = rawValue === "" ? 0 : parseInt(rawValue, 10);
    setFilterType(parsedValue);

    if (parsedValue === 0) {
      fetchCategories(page, pageSize);
    }
  };
  const handleSearch = async (filterName, filterType) => {
    if ((!filterName || filterName.trim() === "") && filterType == 0) {
      await fetchCategories(page, pageSize);
      return;
    }
    const name = filterName;
    const type = filterType;

    try {
      const res = await api.get("/admin/categories/page", {
        params: {
          page,
          pageSize,
          name,
          type,
        },
      });

      setTotal(res.data.data.total);
      setCategories(res.data.data.records);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Search request was cancelled");
        return;
      }
      console.error("Search failed:", error);
      alert(
        `Fail to find ${filterName} or ${filterType}, error: ${
          error.response?.data?.message || error.message
        }`
      );
      await fetchCategories(page, pageSize);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/admin/categories/${id}`);
        alert("Category deleted successfully!");
        await fetchCategories(page, pageSize);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Search request was cancelled");
          return;
        }
        alert(
          `Fail to delete ${id}, error: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const handleStatusChange = async (id) => {
    try {
      await api.put(`/admin/categories/status/${id}`); // Wait for backend update
      alert(`Updated category ${id} status successfully!`);
      await fetchCategories(page, pageSize);
    } catch (error) {
      alert(
        `Fail to delete ${id}, error: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // open modal for add or edit
  const openModal = (category = null) => {
    if (category) {
      setEditing(true);
      setFormData({
        id: category.id,
        name: category.name,
        type: category.type?.toString() || "1",
      });
    } else {
      setEditing(false);
      setFormData({
        id: "",
        name: "",
        type: "",
      });
    }
    setShowFormModal(true);
    setError("");
  };

  // handle form input
  const handlFormInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const typeValue = formData.type ? parseInt(formData.type, 10) : 1;
      if (editing) {
        // update
        const updateData = {
          id: formData.id,
          name: formData.name.trim(),
          type: typeValue,
        };
        await api.put(`/admin/categories/${formData.id}`, updateData);
        alert(`Update category ${formData.id} successfully!`);
        setShowFormModal(false);
        setEditing(false);
        await fetchCategories(page, pageSize);
      } else {
        const requestData = {
          name: formData.name.trim(),
          type: typeValue,
        };
        await api.post("/admin/categories", requestData);

        alert("Add one category successfully!");
        setShowFormModal(false);
        setFormData({ id: "", name: "", type: "1" });
        await fetchCategories(page, pageSize);
      }
    } catch (error) {
      console.error(
        "fail to add or edit category, error message is:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-[#f8f4ef] min-h-screen">
        <h1 className="text-2xl font-bold text-[#4b3b2b] mb-6">
          Category Management
        </h1>

        {/* Filters */}
        <div className="flex justify-between items-end w-full gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Category Name:
              </label>
              <input
                type="text"
                placeholder="E nter category name"
                value={filterName}
                onChange={handleNameChange}
                className="px-3 py-2 border rounded-md focus:ring-[#b08968] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Category Type:
              </label>
              <select
                value={filterType}
                onChange={handleTypeChange}
                className="px-3 py-2 border rounded-md focus:ring-[#b08968] focus:outline-none"
              >
                <option value="">Select Type</option>
                <option value="1">Dish Category</option>
                <option value="2">Combo Category</option>
              </select>
            </div>

            <button
              onClick={() => handleSearch(filterName, filterType)}
              className="bg-[#8a6949] text-white px-5 py-2 rounded-md hover:bg-[#3a2f24] transition"
            >
              Search
            </button>
          </div>

          <button
            onClick={() => openModal(null)}
            className="bg-[#db9d60] text-white px-4 py-2 rounded-md hover:bg-[#3a2f24] transition"
          >
            + Add Category
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto  p-2">
          <table className="w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="bg-[#f0e8df] text-[#4b3b2b]">
              <tr>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b ">Type</th>
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
                    <td className="py-3 px-4 border-b">
                      {cat.type === 1 ? (
                        <span className="p-1 text-[#a96127] font-medium">
                          Dish
                        </span>
                      ) : (
                        <span className="p-1text-[#a96127]   font-medium">
                          Combo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b">{cat.sort || "-"}</td>
                    <td className="py-3 px-4 border-b ">
                      {cat.status === 1 ? (
                        <span className="p-1 text-[#a04a03] bg-[#e9c9ae] font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="p-1 text-gray-400 font-medium">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b items-center justify-center">
                      {formatDateTime(cat.updateTime)}
                    </td>
                    <td className="py-3 px-4 border-b text-center space-x-3">
                      <button
                        onClick={() => openModal(cat)}
                        className="text-[#665201] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-[#e74c3c] hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleStatusChange(cat.id)}
                        className="text-[#b08968] hover:underline"
                      >
                        {cat.status === 1 ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div>
            <Pagination
              totalItems={total}
              pageSize={pageSize}
              currentPage={page}
              onPageChange={(p) => {
                setPage(p);
                fetchCategories(p, pageSize);
              }}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1, size); // reset to first page
              }}
              showInfo={true}
            />
          </div>
        </div>
      </div>
      {/*Modal form */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handlFormInputChange}
                placeholder="Category name"
                required
                className="w-full border rounded px-3 py-2"
              />

              <p>Category Type</p>
              <select
                name="type"
                value={formData.type}
                onChange={handlFormInputChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="1">Menu Item</option>
                <option value="2">Combo Item</option>
              </select>

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#b08968] text-white rounded-md hover:bg-[#8d6e52]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CategoriesPage;
