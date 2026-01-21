// client/src/components/admin/EmployeesManagement.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, RefreshCw, X } from 'lucide-react';
import axios from 'axios';

const EmployeesManagement = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    license_number: '',
    address: '',
    bio: '',
    hourly_rate: ''
  });

  useEffect(() => {
    fetchProfessionals();
  }, [searchTerm]);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = searchTerm ? `?search=${searchTerm}` : '';
      const response = await axios.get(`/api/admin/employees${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle both 'employees' and 'professionals' response keys for backward compatibility
      setProfessionals(response.data.employees || response.data.professionals || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      alert('Failed to fetch professionals. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingId) {
        await axios.put(
          `/api/admin/professionals/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Professional updated successfully');
      } else {
        await axios.post(
          '/api/admin/professionals',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Professional created successfully');
      }
      
      setShowModal(false);
      setEditingId(null);
      resetForm();
      fetchProfessionals();
    } catch (error) {
      console.error('Error saving professional:', error);
      alert(error.response?.data?.error || 'Failed to save professional');
    }
  };

  const handleEdit = (professional) => {
    setFormData({
      fullName: professional.full_name,
      email: professional.email,
      phone: professional.phone,
      specialization: professional.specialization,
      experience: professional.experience,
      qualification: professional.qualification,
      license_number: professional.license_number,
      address: professional.address,
      bio: professional.bio,
      hourly_rate: professional.hourly_rate
    });
    setEditingId(professional.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this professional?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/admin/professionals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Professional deleted successfully');
      fetchProfessionals();
    } catch (error) {
      console.error('Error deleting professional:', error);
      alert('Failed to delete professional');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      qualification: '',
      license_number: '',
      address: '',
      bio: '',
      hourly_rate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Employees Management</h2>
        <div className="flex gap-3">
          <button
            onClick={fetchProfessionals}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          professionals.map((prof) => (
            <div key={prof.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{prof.full_name}</h3>
                  <p className="text-sm text-indigo-600">{prof.specialization}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  prof.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {prof.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <p>📧 {prof.email}</p>
                <p>📱 {prof.phone}</p>
                <p>💼 {prof.experience} years experience</p>
                <p>💰 Rs. {prof.hourly_rate}/hr</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(prof)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prof.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingId ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button onClick={() => { setShowModal(false); setEditingId(null); }}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Specialization *"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Experience (years)"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="License Number"
                  value={formData.license_number}
                  onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Hourly Rate"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
              
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingId(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesManagement;
