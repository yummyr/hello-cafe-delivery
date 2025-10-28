import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Pagination from "../components/Pagination";
import { Edit, Ban, Check, X, Trash2 } from "lucide-react";
import api from "../../../api";
import { formatDateTime } from "../../../utils/date";

function EmployeePage() {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);

  // modal states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    name: "",
    phone: "",
    gender: "m",
  });

  // fetch employee list
  const fetchEmployees = async (page = 1, pageSize = 5) => {
    try {
      const res = await api.get("/admin/employees/page", {
        params: { page, pageSize },
      });
      setEmployees(res.data.data.records);
      setTotal(res.data.data.total);
    } catch (error) {
      console.log("Error fetching employees ", error);
      setEmployees([]);
    }
  };

  // excute when employee login successfully
  useEffect(() => {
    fetchEmployees(page, pageSize);
  }, []);

  const deleteEmployees = async (id) => {
    if (
      !window.confirm("Are you sure to delete employee whose id is " + id + "?")
    )
      return;
    try {
      await api.delete(`/admin/employees/${id}`);
      await fetchEmployees(page, pageSize);
    } catch (err) {
      console.log(
        "Fail to delete employee, id is " +
          id +
          "error message is: " +
          err.getMessage()
      );
    }
  };

  // handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchEmployees(page, pageSize);
    }
  };
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchEmployees(page, pageSize);
    } else {
      handleEmpSearch(searchTerm);
    }
  };

  // handle Emp name fuzzy search
  const handleEmpSearch = async (empName) => {
    if (!empName || empName.trim() === "") {
      await fetchEmployees(page, pageSize);
      return;
    }
    const name = empName;
    try {
      const res = await api.get(`/admin/employees/page`, {
        params: { page, pageSize, name },
      });

      setTotal(res.data.data.total);
      setEmployees(res.data.data.records);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Search request was cancelled");
        return;
      }
      console.error("Search failed:", error);
      alert(
        `Fail to find ${empName}, error: ${
          error.response?.data?.message || error.message
        }`
      );
      await fetchEmployees(page, pageSize);
    }
  };

  // open modal for add or edit
  const openModal = (employee = null) => {

    if (employee) {
      setEditing(true);
      setFormData({
        id: employee.id,
        username: employee.username,
        name: employee.name,
        phone: employee.phone,
        gender: employee.gender,
      });
    } else {
      setEditing(false);
      setFormData({
        id: "",
        username: "",
        name: "",
        phone: "",
        gender: "m",
      });
    }
    setShowModal(true);
    setError("");
  };

  // submit add or edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editing) {
        // update
        await api.put(`/admin/employees/${formData.id}`, formData);
        alert("Employee updated successfully!");
      } else {
        // add
        await api.post("/admin/employees", formData);
        alert("Employee added successfully!");
      }
      setShowModal(false);
      await fetchEmployees(page, pageSize);
    } catch (err) {
      console.error("Fail to save employee, error message:", err);
      setError("Server error, please try again.");
    }
  };

  // toggle status
  const toggleStatus = async (id) => {
    if (!window.confirm("Are you sure to change employee status?")) return;
    try {
      await api.put(`/admin/employees/${id}/status`);
      await fetchEmployees(page, pageSize);
    } catch (err) {
      console.error("Failed to toggle status, error message:", err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold text-[#4b3b2b] mb-6">
        Employee Management
      </h2>

      {/* top controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => openModal(null)}
          className="bg-[#b08968] text-white px-4 py-2 rounded-md hover:bg-[#8d6e52]"
        >
          + Add Employee
        </button>
      </div>

      <div className="flex justify-start items-center mb-4">
        <input
          value={searchTerm}
          onChange={handleInputChange}
          className="
                      w-64
                      h-10
                      px-4
                      leading-10
                      rounded-md
                      border border-gray-300
                      text-gray-700
                      placeholder-gray-400
                      focus:outline-none
                      focus:ring-2 focus:ring-amber-400
                    "
          type="text"
          placeholder="Employee Name"
        />
        <button
          onClick={handleSearch}
          className="bg-[#b08968] text-white mx-5 px-4 py-2 rounded-md hover:bg-[#8d6e52]"
        >
          Search
        </button>
      </div>
      {/* employee table */}
      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-[#f8f4ef] text-left text-[#4b3b2b] border-b border-gray-200">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Username</th>
            <th className="py-3 px-4">Phone</th>
            <th className="py-3 px-4">Gender</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Last Update Time</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b hover:bg-[#f8f4ef] transition">
              <td className="py-3 px-4">{emp.id}</td>
              <td className="py-3 px-4">{emp.name}</td>
              <td className="py-3 px-4">{emp.username}</td>
              <td className="py-3 px-4">{emp.phone}</td>
              <td className="py-3 px-4">
                {emp.gender === "f" ? "Female" : "Male"}
              </td>
              <td className="py-3 px-4">
                {emp.status === 1 ? (
                  <span className="text-green-600 font-medium">Enabled</span>
                ) : (
                  <span className="text-gray-500">Disabled</span>
                )}
              </td>
              <td className="py-3 px-4">{formatDateTime(emp.updateTime)}</td>
              <td className="py-3 px-4 text-center flex justify-center gap-3">
                <button
                  className="text-[#b08968] hover:text-[#8d6e52]"
                  onClick={() => openModal(emp)}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleStatus(emp.id)}
                  className={`${
                    emp.status === 1
                      ? "text-red-500 hover:text-red-700"
                      : "text-green-600 hover:text-green-800"
                  }`}
                >
                  {emp.status === 1 ? (
                    <Ban className="w-4 h-4" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => deleteEmployees(emp.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete employee"
                >
                  {" "}
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      <Pagination
        totalItems={total}
        pageSize={pageSize}
        currentPage={page}
        onPageChange={(p) => {
          setPage(p);
          fetchEmployees(p, pageSize);
        }}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1, size); // reset to first page
        }}
        showInfo={true}
      />
      {/* modal form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-[#4b3b2b]">
              {editing ? "Edit Employee" : "Add New Employee"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border rounded px-3 py-2"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
}

export default EmployeePage;
