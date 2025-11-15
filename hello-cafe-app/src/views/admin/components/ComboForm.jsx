import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Search, Plus, DollarSign, Package, ChevronDown } from 'lucide-react';
import api from '../../../api';

const ComboForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  isEditMode = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    status: 1,
    image: null,
    imageUrl: '',
    items: [],
    ...initialData,
    // Handle price conversion for edit mode
    ...(initialData.price && { price: initialData.price.toString() }),
    // Ensure imageUrl is set correctly from initialData.image
    ...(initialData.image && { imageUrl: initialData.image })
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || initialData.image || '');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasExistingImage, setHasExistingImage] = useState(!!(initialData.imageUrl || initialData.image));
  const [imageChanged, setImageChanged] = useState(false);
  const fileInputRef = useRef(null);
  const searchRef = useRef(null);

  // Load menu items details when in edit mode
  useEffect(() => {
    if (isEditMode && (initialData.items || initialData.combos)) {
      loadMenuItemsDetails();
    }
  }, [isEditMode, initialData.items, initialData.combos]);

  // Function to load full menu item details for edit mode
  const loadMenuItemsDetails = async () => {
    try {
      // Check for new format (items) or old format (combos)
      const itemsToProcess = initialData.items || initialData.combos;
      if (!itemsToProcess || itemsToProcess.length === 0) return;

      const menuItemsDetails = await Promise.all(
        itemsToProcess.map(async (item) => {
          try {
            const response = await api.get(`/admin/menu/${item.menuItemId}`);
            if (response.data.code === 1 && response.data.data) {
              const menuItem = response.data.data;
              return {
                id: item.id || Date.now() + Math.random(),
                menuItemId: item.menuItemId,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity || 1,
                image: menuItem.image
              };
            }
            return null;
          } catch (error) {
            console.error(`Error loading menu item ${item.menuItemId}:`, error);
            return null;
          }
        })
      );

      // Filter out null values and set selected menu items
      const validItems = menuItemsDetails.filter(item => item !== null);
      setSelectedMenuItems(validItems);
    } catch (error) {
      console.error('Error loading menu items details:', error);
    }
  };

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadProgress(0);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Mark image as changed and store file
      setImageChanged(true);
      setHasExistingImage(false);

      setFormData(prev => ({
        ...prev,
        image: file,
        imageUrl: '' // Clear existing image URL since we're using a new file
      }));

      setUploadProgress(100);
    } catch (error) {
      alert('Failed to process image: ' + error.message);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImagePreview('');
    setHasExistingImage(false);
    setImageChanged(true);
    setFormData(prev => ({
      ...prev,
      image: null,
      imageUrl: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const searchMenuItems = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get(`/admin/combo/menu-items/search`, {
        params: { query }
      });

      if (response.data.code === 1) {
        setSearchResults(response.data.data || []);
      }
    } catch (error) {
      console.error('Error searching menu items:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search query change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchMenuItems(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  
  // Handle menu item selection
  const handleSelectMenuItem = (menuItem) => {
    // Check if already selected
    if (selectedMenuItems.find(item => item.id === menuItem.id)) {
      return;
    }

    const newItem = {
      id: Date.now(), // temporary ID for list key
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      image: menuItem.image
    };

    setSelectedMenuItems(prev => [...prev, newItem]);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Handle menu item removal
  const handleRemoveMenuItem = (itemId) => {
    setSelectedMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;

    setSelectedMenuItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create clean data object matching ComboDTO structure
    const submissionData = {
      id: formData.id, // Include id for edit mode
      name: formData.name,
      categoryId: formData.categoryId || null,
      price: parseFloat(formData.price) || 0,
      description: formData.description || '',
      status: formData.status || 1,
      image: formData.image || formData.imageUrl || '', // Use file object for new images, URL for existing ones
      imageUrl: formData.imageUrl || '', // Keep existing image URL reference
      imageChanged: imageChanged, // Flag to indicate if image was modified
      hasExistingImage: hasExistingImage, // Flag to indicate if there was an existing image
      items: selectedMenuItems.map(({ menuItemId, name, price, quantity, image }) => ({
        id: menuItemId,
        name: name,
        categoryId: null, // This will be set by the backend
        price: parseFloat(price) || 0,
        image: image,
        description: '', // This will be set by the backend
        status: 1, // This will be set by the backend
        quantity: quantity || 1 // Include quantity field
      }))
    };

    onSubmit(submissionData);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return selectedMenuItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit Combo' : 'Add New Combo'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Combo Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price * ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter combo description..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Combo Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Choose Image</span>
                </button>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {(imagePreview || formData.imageUrl || formData.image) && (
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={imagePreview || formData.imageUrl || formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Menu Items
            </label>
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search menu items..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && (searchResults.length > 0 || isSearching) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-center text-gray-500">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectMenuItem(item)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">${item.price}</div>
                          </div>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      No menu items found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Selected Menu Items */}
          {selectedMenuItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Menu Items
              </label>
              <div className="space-y-2">
                {selectedMenuItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">${item.price}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <label className="text-sm text-gray-600">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900 w-20 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <div className="text-sm font-medium text-blue-900">
                  Total Menu Items Price:
                </div>
                <div className="text-lg font-bold text-blue-900">
                  ${calculateTotalPrice()}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update Combo' : 'Create Combo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComboForm;