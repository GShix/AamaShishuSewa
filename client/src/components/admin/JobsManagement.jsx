// client/src/components/admin/JobsManagement.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, X, Briefcase, MapPin, Clock, Users, Calendar, DollarSign } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employment_type: 'full-time',
    experience_level: 'entry',
    salary_range: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    vacancies: 1,
    deadline: '',
    status: 'open'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getJobs();
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').filter(Boolean),
        benefits: formData.benefits.split('\n').filter(Boolean),
        vacancies: parseInt(formData.vacancies) || 1
      };

      if (editingId) {
        await adminAPI.updateJob(editingId, data);
        alert('Job updated successfully');
      } else {
        await adminAPI.createJob(data);
        alert('Job created successfully');
      }

      setShowModal(false);
      setEditingId(null);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert(error.response?.data?.error || 'Failed to save job');
    }
  };

  const handleEdit = (job) => {
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      employment_type: job.employment_type,
      experience_level: job.experience_level,
      salary_range: job.salary_range || '',
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
      vacancies: job.vacancies || 1,
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
      status: job.status || 'open'
    });
    setEditingId(job.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await adminAPI.deleteJob(id);
      alert('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      employment_type: 'full-time',
      experience_level: 'entry',
      salary_range: '',
      description: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      vacancies: 1,
      deadline: '',
      status: 'open'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      on_hold: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || styles.open;
  };

  const getEmploymentTypeBadge = (type) => {
    const styles = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-purple-100 text-purple-800',
      'contract': 'bg-orange-100 text-orange-800',
      'internship': 'bg-pink-100 text-pink-800'
    };
    return styles[type] || styles['full-time'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Jobs Management</h2>
          <p className="text-gray-600 mt-1">Manage job openings and applications</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchJobs}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Posted</h3>
          <p className="text-gray-500 mb-6">Post your first job opening to start receiving applications</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Post First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentTypeBadge(job.employment_type)}`}>
                      {job.employment_type.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Info */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary_range && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary_range}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{job.vacancies} {job.vacancies === 1 ? 'Position' : 'Positions'}</span>
                </div>
                {job.deadline && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Apply by: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">{job.description}</p>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(job)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Job' : 'Post New Job'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Senior Nurse"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Healthcare"
                    required
                  />
                </div>
              </div>

              {/* Location, Employment Type, Experience */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Kathmandu"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="entry">Entry Level</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="senior">Senior</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Salary, Vacancies, Deadline, Status */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Rs 30-40K"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vacancies *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Describe the role and responsibilities..."
                  required
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements (one per line)
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Bachelor's degree in Nursing&#10;Minimum 2 years experience&#10;Valid license"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsibilities (one per line)
                </label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Provide patient care&#10;Maintain medical records&#10;Coordinate with doctors"
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits (one per line)
                </label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Health insurance&#10;Paid leave&#10;Professional development"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 font-medium"
                >
                  {editingId ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsManagement;
