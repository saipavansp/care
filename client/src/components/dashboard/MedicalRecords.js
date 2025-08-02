import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiDownload, FiTrash2, FiCamera, FiFolder, FiSearch, FiFilter } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MedicalRecords = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      name: 'Blood Test Report - January 2024',
      type: 'Lab Report',
      date: '2024-01-15',
      size: '2.3 MB',
      category: 'lab'
    },
    {
      id: 2,
      name: 'Prescription - Dr. Sharma',
      type: 'Prescription',
      date: '2024-01-10',
      size: '1.1 MB',
      category: 'prescription'
    }
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'camera'

  const categories = [
    { value: 'all', label: 'All Records' },
    { value: 'prescription', label: 'Prescriptions' },
    { value: 'lab', label: 'Lab Reports' },
    { value: 'imaging', label: 'X-rays/Scans' },
    { value: 'discharge', label: 'Discharge Summary' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileUpload = (files) => {
    // Handle file upload logic
    console.log('Uploading files:', files);
    toast.success('Files uploaded successfully');
    setShowUploadModal(false);
  };

  const handleCameraCapture = () => {
    // Handle camera capture logic
    toast.info('Camera feature coming soon!');
  };

  const handleDelete = (recordId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(records.filter(r => r.id !== recordId));
      toast.success('Record deleted successfully');
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesCategory = selectedCategory === 'all' || record.category === selectedCategory;
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          Medical Records
        </h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary inline-flex items-center"
        >
          <FiUpload className="mr-2" />
          Upload Records
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12">
          <FiFolder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No records found
          </h3>
          <p className="text-gray-600 mb-6">
            Upload your medical records to keep them organized and accessible
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-secondary inline-flex items-center"
          >
            <FiUpload className="mr-2" />
            Upload First Record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FiFile className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {record.type}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2 truncate">
                {record.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {formatDate(record.date)} • {record.size}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 btn-ghost text-sm inline-flex items-center justify-center">
                  <FiDownload className="mr-1" />
                  Download
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-lg w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Medical Records
            </h3>

            {/* Upload Method Selector */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              <button
                onClick={() => setUploadMethod('file')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
                  uploadMethod === 'file'
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiFolder className="mr-2" />
                Upload Files
              </button>
              <button
                onClick={() => setUploadMethod('camera')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
                  uploadMethod === 'camera'
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiCamera className="mr-2" />
                Use Camera
              </button>
            </div>

            {uploadMethod === 'file' ? (
              <>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn-primary mt-4 inline-flex items-center cursor-pointer"
                  >
                    Select Files
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select className="w-full input-field">
                    {categories.filter(c => c.value !== 'all').map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-8 mb-4">
                  <FiCamera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Position your document clearly in the camera view
                  </p>
                  <button
                    onClick={handleCameraCapture}
                    className="btn-primary inline-flex items-center"
                  >
                    <FiCamera className="mr-2" />
                    Open Camera
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Make sure the document is well-lit and all text is readable
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              {uploadMethod === 'file' && (
                <button className="btn-primary">
                  Upload Records
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;