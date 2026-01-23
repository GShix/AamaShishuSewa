// client/src/components/admin/JobsManagement.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, X, Briefcase, MapPin, Clock, Users, Calendar, DollarSign, FileText, Mail, Phone, ExternalLink, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const JobsManagement = () => {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationStats, setApplicationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
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
    fetchApplications();
    fetchApplicationStats();
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

  const fetchApplications = async () => {
    try {
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await adminAPI.getAllJobApplications(params);
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    }
  };

  const fetchApplicationStats = async () => {
    try {
      const response = await adminAPI.getJobApplicationStats();
      setApplicationStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [filterStatus, activeTab]);

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

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await adminAPI.updateApplicationStatus(applicationId, newStatus);
      alert(`Application ${newStatus} successfully`);
      fetchApplications();
      fetchApplicationStats();
      setShowApplicationModal(false);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      await adminAPI.deleteJobApplication(applicationId);
      alert('Application deleted successfully');
      fetchApplications();
      fetchApplicationStats();
      setShowApplicationModal(false);
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      on_hold: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || styles.open;
  };

  const getApplicationStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status] || styles.pending;
  };

  const getApplicationStatusIcon = (status) => {
    const icons = {
      pending: AlertCircle,
      reviewed: Eye,
      shortlisted: FileText,
      accepted: CheckCircle,
      rejected: XCircle
    };
    return icons[status] || AlertCircle;
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
          <h2 className="text-2xl font-bold text-gray-900">Jobs & Careers Management</h2>
          <p className="text-gray-600 mt-1">Manage job openings and review applications</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchJobs}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          {activeTab === 'jobs' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post New Job
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'jobs'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Job Openings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'applications'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Applications {applicationStats && `(${applicationStats.total})`}
        </button>
      </div>

      {/* Jobs Tab Content */}
      {activeTab === 'jobs' && (
        <>
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
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium text-blue-600">
                    {job.application_count || 0} {job.application_count === 1 ? 'Application' : 'Applications'}
                  </span>
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
        </>
      )}

      {/* Applications Tab Content */}
      {activeTab === 'applications' && (
        <>
          {/* Statistics Cards */}
          {applicationStats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.total}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
                <p className="text-sm text-yellow-700 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">{applicationStats.pending}</p>
              </div>
              <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
                <p className="text-sm text-blue-700 mb-1">Reviewed</p>
                <p className="text-2xl font-bold text-blue-800">{applicationStats.reviewed}</p>
              </div>
              <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
                <p className="text-sm text-purple-700 mb-1">Shortlisted</p>
                <p className="text-2xl font-bold text-purple-800">{applicationStats.shortlisted}</p>
              </div>
              <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
                <p className="text-sm text-green-700 mb-1">Accepted</p>
                <p className="text-2xl font-bold text-green-800">{applicationStats.accepted}</p>
              </div>
              <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
                <p className="text-sm text-red-700 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-800">{applicationStats.rejected}</p>
              </div>
            </div>
          )}

          {/* Filter */}
          <div className="flex gap-2 mb-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Found</h3>
              <p className="text-gray-500">Applications will appear here once candidates apply</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => {
                      const StatusIcon = getApplicationStatusIcon(application.status);
                      return (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{application.full_name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <Mail className="w-3 h-3" />
                                {application.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                {application.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{application.jobs?.title || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{application.jobs?.department}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(application.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusBadge(application.status)}`}>
                              <StatusIcon className="w-3 h-3" />
                              {application.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewApplication(application)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
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

      {/* Application Detail Modal */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedApplication(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getApplicationStatusBadge(selectedApplication.status)}`}>
                  {React.createElement(getApplicationStatusIcon(selectedApplication.status), { className: "w-4 h-4" })}
                  {selectedApplication.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  Applied on {new Date(selectedApplication.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Job Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Position Applied For</h4>
                <p className="text-lg font-medium text-blue-600">{selectedApplication.jobs?.title}</p>
                <p className="text-sm text-gray-600">{selectedApplication.jobs?.department} • {selectedApplication.jobs?.location}</p>
              </div>

              {/* Applicant Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Applicant Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <p className="font-medium text-gray-900">{selectedApplication.full_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {selectedApplication.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {selectedApplication.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume */}
              {selectedApplication.resume_url && (
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Resume</label>
                  <a
                    href={selectedApplication.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Resume
                  </a>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApplication.cover_letter && (
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Cover Letter</label>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                    {selectedApplication.cover_letter}
                  </div>
                </div>
              )}

              {/* Status Actions */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Update Application Status</h4>
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'pending')}
                    disabled={selectedApplication.status === 'pending'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedApplication.status === 'pending'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'reviewed')}
                    disabled={selectedApplication.status === 'reviewed'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedApplication.status === 'reviewed'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'shortlisted')}
                    disabled={selectedApplication.status === 'shortlisted'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedApplication.status === 'shortlisted'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    Shortlisted
                  </button>
                  <button
                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'accepted')}
                    disabled={selectedApplication.status === 'accepted'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedApplication.status === 'accepted'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'rejected')}
                    disabled={selectedApplication.status === 'rejected'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedApplication.status === 'rejected'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Delete Button */}
              <div className="border-t pt-4">
                <button
                  onClick={() => handleDeleteApplication(selectedApplication.id)}
                  className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsManagement;
