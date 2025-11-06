import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Ban, Check, PlusCircle, X, Trash2 } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import Pagination from "../components/Pagination";
import api from "../../../api";
import { formatDateTime } from "../../../utils/date";

function MenuPage() {
  const tdAndThStyle = "py-3 px-4 text-center";
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const handleAddNew = () => {
    navigate("/admin/menu/new");
  };

  const handleEdit = (item) => {
    navigate(`/admin/menu/edit/${item.id}`);
  };

  const fetchMenu = async () => {
    try {
      const params = {
        page: page,
        pageSize: pageSize,
      };

      if (searchName && searchName.trim() !== "") {
        params.name = searchName;
      }
      if (searchCategory && searchCategory.trim() !== "") {
        params.categoryName = searchCategory;
      }

      if (selectedStatus !== null && selectedStatus !== undefined) {
        params.status = selectedStatus;
      }

      console.log("Fetching menu with params:", params);

      const res = await api.get("/admin/menu", { params });
      console.log("Successfully fetched menu items:", res.data.data.records);
      setMenuItems(res.data.data.records);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error(" Failed to fetch menu items:", err);
      alert("Failed to load menu items. Please try again.");
    }
  };

  // Load menu list
  useEffect(() => {
    // fetchCategories();
    fetchMenu();
  }, [page, pageSize, searchName, selectedStatus]);
  // select all /none
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenu();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName, searchCategory]);

  const handleSelectIds = (e) => {
    if (e.target.checked) {
      setSelectedIds(menuItems.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSearchName = (e) => {
    setSearchName(e.target.value);
  };
  const handleSearchCategory = (e) => {
    setSearchCategory(e.target.value);
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
      await api.delete("/admin/menu", { data: idList });
      await fetchMenu();
      setSelectedIds([]);

      alert(`Successfully deleted ${idList.length} item(s)`);
    } catch (error) {
      console.error("Failed to delete items:", error);
      alert("Failed to delete items. Please try again.");
    }
  };

  const toggleStatus = async (id) => {
    console.log(`going to toggle ${id} status~~~~`);
    try {
      await api.put(`/admin/menu/status/${id}`);
      alert(`${id} status updated successfully!`);
      await fetchMenu();
    } catch (error) {
      console.warn(`something wrong to update ${id} status`, error);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <div>
        {/* ===== Search and Action Bar ===== */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            {/* Search and Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 items-end">
              {/* Menu Item Name Search */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#4b3b2b]">
                  Menu Item Name
                </label>
                <input
                  value={searchName}
                  onChange={(e) => handleSearchName(e)}
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
                  value={searchCategory}
                  onChange={(e) => handleSearchCategory(e)}
                  type="text"
                  placeholder="Enter category name"
                  className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 lg:pt-0">
              <button
                onClick={() => handleAddNew()}
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
            onClick={() => setSelectedStatus(null)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedStatus === null
                ? "bg-[#b08968] text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedStatus(1)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedStatus === 1
                ? "bg-[#b08968] text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setSelectedStatus(0)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedStatus === 0
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
                <th className={tdAndThStyle}>
                  <input
                    type="checkbox"
                    onChange={handleSelectIds}
                    checked={
                      menuItems.length > 0 &&
                      selectedIds.length === menuItems.length
                    }
                  />
                </th>
                <th className={tdAndThStyle}>Item Name</th>
                <th className={tdAndThStyle}>Image</th>
                <th className={tdAndThStyle}>Category</th>
                <th className={tdAndThStyle}>Price</th>
                <th className={tdAndThStyle}>Status</th>
                <th className={tdAndThStyle}>Update Time</th>
                <th className={tdAndThStyle}>Actions</th>
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
                  <td className={tdAndThStyle}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td className={tdAndThStyle}>{item.name}</td>
                  <td className={tdAndThStyle}>
                    {item.image ? (
                      <div className="flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "public/assets/default-no-img.png";
                            e.target.alt = "Image not available";
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </td>
                  <td className={tdAndThStyle}>{item.categoryName}</td>
                  <td className={tdAndThStyle}>{item.price}</td>
                  <td className={tdAndThStyle}>
                    {item.status === 1 ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-gray-500">Inactive</span>
                    )}
                  </td>
                  <td className={tdAndThStyle}>
                    {formatDateTime(item.updateTime)}
                  </td>
                  <td className="py-3 px-4 text-center flex justify-center gap-3">
                    <button
                      className="text-[#b08968] hover:text-[#8d6e52]"
                      onClick={() => handleEdit(item)}
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
          <div>
            <Pagination
              totalItems={total}
              pageSize={pageSize}
              currentPage={page}
              onPageChange={(p) => {
                setPage(p);
                fetchMenu(p, pageSize);
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
    </AdminLayout>
  );
}

export default MenuPage;
