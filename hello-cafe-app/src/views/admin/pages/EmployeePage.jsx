import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Pagination from "../components/Pagination";
import { Edit, Ban, Check, X, Trash2 } from "lucide-react";
import api from "../../../api";

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // modal states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    name: "",
    phone: "",
    gender: "m",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  // fetch employee list
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/admin/employees");
      setEmployees(res.data.data);
    } catch (error) {
      console.log("Try to fetch employees list but error happened :{}", error);
      setEmployees([]);
    }
  };

  // excute when employee login successfully
  useEffect(() => {
    fetchEmployees();
  }, []);

  const deleteEmployees = async (id) => {
    if (
      !window.confirm("Are you sure to delete employee whose id is " + id + "?")
    )
      return;
    try {
      await api.delete(`/admin/employees/${id}`);
      await fetchEmployees();
    } catch (err) {
      console.log(
        "Fail to delete employee, id is " +
          id +
          "error message is: " +
          err.getMessage()
      );
    }
  };


  // sort + pagination
  const sorted = [...employees].sort((a, b) => {
    const fieldA = a[sortField]?.toString().toLowerCase();
    const fieldB = b[sortField]?.toString().toLowerCase();
    return sortOrder === "asc"
      ? fieldA.localeCompare(fieldB)
      : fieldB.localeCompare(fieldA);
  });

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  // handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // open modal for add or edit
  const openModal = (employee = null) => {
    console.log("employee is :", employee);

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
      await fetchEmployees();
    } catch (err) {
      console.error("Fail to save employee, error message:", err);
      setError("Server error, please try again.");
    }
  };

  // toggle status
  const toggleStatus = async (id) => {
    if (!window.confirm("Are you sure to change employee status?")) return;
    try {
      const res = await api.put(`/admin/employees/${id}/status`);
      console.log(
        "try to change employee status, id is: " +
          id +
          "response data is " +
          res.data.data
      );

      await fetchEmployees();
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

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="name">Sort by Name</option>
          <option value="updateTime">Sort by Update Time</option>
        </select>
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
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((emp) => (
            <tr key={emp.id} className="border-b hover:bg-[#f8f4ef] transition">
              <td className="py-3 px-4">
                <button onClick={() => getEmpInfo(emp.id)}>{emp.id}</button>
              </td>
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
        totalItems={employees.length}
        pageSize={pageSize}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1); // reset to first page
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
