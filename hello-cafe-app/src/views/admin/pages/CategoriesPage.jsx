import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Pagination from "../components/Pagination";
import api from "../../../api";
import { Edit, Ban, Check, X, Trash2 } from "lucide-react";
import defaultNoImg from "/assets/default-no-img.png";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    type: 0,
    image: "",
    description: "",
  });

  // modal states
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [showComboItemModal, setShowComboItemModal] = useState(false);

  useEffect(() => {
    fetchCategories(page, pageSize);
  }, []);

  const fetchCategories = async (page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/categories/page", {
        params: { page, pageSize },
      });
      console.log("categories response data: ", res.data.data.records);

      setCategories(res.data.data.records || []);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error("❌ Failed to load categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filterName) => {
    if (!filterName || filterName.trim() === "") {
      await fetchCategories(page, pageSize);
      return;
    }
    const name = filterName;
  
    try {
      const res = await api.get("/admin/categories/page", {
        params: {
          page,
          pageSize,
          name,
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
        `Fail to find ${filterName}, error: ${
          error.response?.data?.message || error.message
        }`
      );
      await fetchCategories(page, pageSize);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        api.delete(`/admin/categories/${id}`);
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
        await fetchCategories(page, pageSize);
      }
    }
  };

  const handleDisable = (id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Disabled" : "Active" }
          : c
      )
    );
  };

  // handle form input
  const handlMenuItemChange = (e) => {
    const value =
      e.target.name === "type" ? parseInt(e.target.value) : e.target.value;
    setMenuItem({ ...menuItem, [e.target.name]: value });
  };

  // handle image file input change
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(defaultNoImg);
    }
  };
  const hanleAddMenuItem = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log(menuItem);

      const res = await api.put("/admin/categories/menu_item", menuItem);

      console.log("Try to add one menu item", res.data.data);

      alert("Add one menu item successfully!");
      setShowMenuItemModal(false);

      await fetchCategories();
    } catch (error) {
      console.log(
        "fail to add menu item, error message is:" + error.getMessage
      );
    }
  };

  const hanleAddComboItem = async (e) => {
    e.preventDefault();
    setError("");
  };
  return (
    <AdminLayout>
      <div className="p-8 bg-[#f8f4ef] min-h-screen">
        <h1 className="text-2xl font-bold text-[#4b3b2b] mb-6">
          Category Management
        </h1>

        <div className="pb-3 ">
          <div className="flex gap-3 justify-flex ">
            <button
              onClick={() => setShowMenuItemModal(true)}
              className="bg-[#4b3b2b] text-white px-4 py-2 rounded-md hover:bg-[#3a2f24] transition"
            >
              + Add Menu Item Category
            </button>
            <button
              onClick={() => setShowComboItemModal(true)}
              className="bg-[#b08968] text-white px-4 py-2 rounded-md hover:bg-[#8d6e52] transition"
            >
              + Add Combo Item Category
            </button>
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Category Name:
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-[#b08968] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Category Type:
            </label>
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
            onClick={() => handleSearch(filterName)}
            className="bg-[#8a6949] text-white px-5 py-2 rounded-md hover:bg-[#3a2f24] transition"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
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
                    <td className="py-3 px-4 border-b">{cat.type}</td>
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
                      {cat.updateTime || "—"}
                    </td>
                    <td className="py-3 px-4 border-b text-center space-x-3">
                      <button className="text-[#665201] hover:underline">
                        Edit
                      </button>
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
      {/*Menu item modal form */}
      {showMenuItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
            <form onSubmit={hanleAddMenuItem} className="space-y-4">
              <input
                type="text"
                name="name"
                value={menuItem.name}
                onChange={handlMenuItemChange}
                placeholder="menu item name"
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="price"
                value={menuItem.price}
                onChange={handlMenuItemChange}
                placeholder="Price"
                required
                className="w-full border rounded px-3 py-2"
              />
              <p>Item Type</p>
              <select
                name="type"
                value={menuItem.type}
                onChange={handlMenuItemChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="1">Coffee</option>
                <option value="2">Sandwichs</option>
                <option value="3">Burgers</option>
                <option value="4">Tarts</option>
              </select>

              <input
                type="text"
                name="description"
                value={menuItem.description}
                onChange={handlMenuItemChange}
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
              />
              <p>Upload menu item image below</p>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleImgChange}
                className="text-sm text-gray-600"
              />

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowMenuItemModal(false)}
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

      {/*Combo item modal form */}
      {showComboItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
            <form onSubmit={hanleAddComboItem} className="space-y-4">
              <input
                type="text"
                name="name"
                value={menuItem.name}
                onChange={handlMenuItemChange}
                placeholder="menu item name"
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="price"
                value={menuItem.price}
                onChange={handlMenuItemChange}
                placeholder="Price"
                required
                className="w-full border rounded px-3 py-2"
              />
              <p>Item Type</p>
              <select
                name="type"
                value={menuItem.type}
                onChange={handlMenuItemChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="1">Coffee</option>
                <option value="2">Sandwichs</option>
                <option value="3">Burgers</option>
                <option value="4">Tarts</option>
              </select>

              <input
                type="text"
                name="description"
                value={menuItem.description}
                onChange={handlMenuItemChange}
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
              />
              <p>Upload menu item image below</p>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleImgChange}
                className="text-sm text-gray-600"
              />

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowComboItemModal(false)}
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
