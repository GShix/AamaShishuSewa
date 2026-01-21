// client/src/components/admin/ServicesManagement.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, X } from 'lucide-react';
import axios from 'axios';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    features: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/admin/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const data = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        duration: parseInt(formData.duration) || 60,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
      };

      if (editingId) {
        await axios.put(
          `/api/admin/services/${editingId}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Service updated successfully');
      } else {
        await axios.post(
          '/api/admin/services',
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Service created successfully');
      }

      setShowModal(false);
      setEditingId(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert(error.response?.data?.error || 'Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      features: Array.isArray(service.features) ? service.features.join(', ') : ''
    });
    setEditingId(service.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      duration: '',
      features: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
        <div className="flex gap-3">
          <button
            onClick={fetchServices}
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
            Add Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No services found. Create your first service!
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                  <p className="text-sm text-indigo-600">{service.category}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-semibold">Rs. {service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-semibold">{service.duration} min</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
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
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => { setShowModal(false); setEditingId(null); }}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Service Name *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Category *</option>
                <option value="prenatal">Prenatal Care</option>
                <option value="postnatal">Postnatal Care</option>
                <option value="childcare">Child Care</option>
                <option value="consultation">Consultation</option>
                <option value="nwaran">Nwaran Ceremony</option>
              </select>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price (Rs)"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>

              <input
                type="text"
                placeholder="Features (comma-separated)"
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
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

export default ServicesManagement;
