import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  User,
  X
} from 'lucide-react';

const PostsAdminPage = () => {
  // State variables for search, filter, and modals
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // New state for edit modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // New state for view modal
  const [selectedPost, setSelectedPost] = useState(null); // Stores the post selected for edit/delete/view
  const [posts, setPosts] = useState([]); // Stores the list of posts
  const [loading, setLoading] = useState(true); // Loading indicator for API calls
  const [error, setError] = useState(null); // Stores any error messages

  // Form data for creating/editing posts
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: [],
    image: null // Stores the file object for image upload
  });

  // API Base URL - adjust according to your backend
  // For demonstration, we'll use a mock API endpoint.
  // In a real application, this would point to your actual backend.
  const API_BASE_URL = 'http://localhost:5000/api/posts';

  // API Functions
  /**
   * Fetches all posts from the API.
   */
  const fetchPosts = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        // If response is not OK, throw an error
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json(); // Parse JSON response
      // Add mock views and comments if not present for demonstration purposes
      const postsWithMockStats = data.map(post => ({
        ...post,
        views: post.views || Math.floor(Math.random() * 1000) + 50, // Random views
        comments: post.comments || Math.floor(Math.random() * 50) + 5, // Random comments
        createdAt: post.createdAt || new Date().toISOString(), // Mock creation date
        tags: post.tags || ['general'] // Ensure tags array exists
      }));
      setPosts(postsWithMockStats); // Update posts state
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
    }
  };

  /**
   * Creates a new post by sending data to the API.
   * @param {object} postData - The data for the new post.
   */
  const createPost = async (postData) => {
    try {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('title', postData.title);
      formDataToSend.append('content', postData.content);
      formDataToSend.append('author', postData.author);
      formDataToSend.append('tags', JSON.stringify(postData.tags)); // Tags as JSON string
      if (postData.image) {
        formDataToSend.append('image', postData.image); // Append image file
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formDataToSend, // Use FormData for body
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.statusText}`);
      }
      const newPost = await response.json(); // Get the newly created post from response
      // Add mock stats for the new post
      const postWithMockStats = {
        ...newPost,
        views: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 10) + 1,
        createdAt: new Date().toISOString(),
        tags: newPost.tags || ['general']
      };
      setPosts([...posts, postWithMockStats]); // Add new post to existing posts
      setShowCreateModal(false); // Close the create modal
      resetForm(); // Reset form fields
      setError(null); // Clear errors
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message); // Set error message
    }
  };

  /**
   * Updates an existing post by sending data to the API.
   * @param {string} id - The ID of the post to update.
   * @param {object} postData - The updated data for the post.
   */
  const updatePost = async (id, postData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', postData.title);
      formDataToSend.append('content', postData.content);
      formDataToSend.append('author', postData.author);
      formDataToSend.append('tags', JSON.stringify(postData.tags));
      if (postData.image) {
        formDataToSend.append('image', postData.image);
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.statusText}`);
      }
      const updatedPost = await response.json();
      // Update mock stats for the updated post if necessary, or use existing
      const postWithMockStats = {
        ...updatedPost,
        views: updatedPost.views || (selectedPost ? selectedPost.views : 0),
        comments: updatedPost.comments || (selectedPost ? selectedPost.comments : 0),
        createdAt: updatedPost.createdAt || (selectedPost ? selectedPost.createdAt : new Date().toISOString()),
        tags: updatedPost.tags || ['general']
      };
      setPosts(posts.map(post => post.id === id ? postWithMockStats : post)); // Update post in state
      setShowEditModal(false); // Close the edit modal
      resetForm(); // Reset form fields
      setSelectedPost(null); // Clear selected post
      setError(null); // Clear errors
    } catch (err) {
      console.error("Error updating post:", err);
      setError(err.message); // Set error message
    }
  };

  /**
   * Deletes a post by sending a DELETE request to the API.
   * @param {string} id - The ID of the post to delete.
   */
  const deletePost = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }
      setPosts(posts.filter(post => post.id !== id)); // Remove deleted post from state
      setShowDeleteModal(false); // Close delete modal
      setSelectedPost(null); // Clear selected post
      setError(null); // Clear errors
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err.message); // Set error message
    }
  };

  // Form handlers
  /**
   * Handles changes in text input fields.
   * @param {object} e - The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles changes in the file input for image upload.
   * @param {object} e - The event object.
   */
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0] // Store the file object
    }));
  };

  /**
   * Handles changes in the tags input field, splitting by comma.
   * @param {object} e - The event object.
   */
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  /**
   * Resets the form data to its initial empty state.
   */
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      tags: [],
      image: null
    });
  };

  // Lifecycle hook to fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Event handlers for CRUD operations
  /**
   * Handles the click event for deleting a post.
   * @param {string} postId - The ID of the post to delete.
   */
  const handleDeletePost = (postId) => {
    deletePost(postId);
  };

  /**
   * Handles the click event for creating a new post.
   */
  const handleCreatePost = () => {
    if (!formData.title || !formData.content || !formData.author) {
      setError('Please fill in all required fields (Title, Content, Author).');
      return;
    }
    createPost(formData);
  };

  /**
   * Handles the click event for updating an existing post.
   */
  const handleUpdatePost = () => {
    if (!formData.title || !formData.content || !formData.author) {
      setError('Please fill in all required fields (Title, Content, Author).');
      return;
    }
    if (selectedPost) {
      updatePost(selectedPost.id, formData);
    }
  };

  /**
   * Handles the click event for opening the edit modal.
   * @param {object} post - The post object to be edited.
   */
  const handleEditClick = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      tags: post.tags || [], // Ensure tags is an array
      image: null // Image input should be handled separately for updates (user re-selects or keeps old)
    });
    setShowEditModal(true);
  };

  /**
   * Handles the click event for opening the view modal.
   * @param {object} post - The post object to be viewed.
   */
  const handleViewClick = (post) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  // Derived state for filtering and display
  // Get unique categories from posts for the filter dropdown
  const categories = [...new Set(posts.flatMap(post => post.tags || []))].sort();

  // Filter posts based on search term and category filter
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || (post.tags && post.tags.includes(categoryFilter));

    return matchesSearch && matchesCategory;
  });

  /**
   * Formats a date string into a readable format.
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Posts Management</h1>
            <button
              onClick={() => { setShowCreateModal(true); resetForm(); setError(null); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <Plus size={20} />
              New Post
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{filteredPosts.length}</div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 shadow-sm">
              {error}
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search posts by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Table Section */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            // Loading state
            <div className="text-center py-8">
              <p className="text-gray-500">Loading posts...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mt-4"></div>
            </div>
          ) : (
            // Display posts in a table
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="max-w-xs overflow-hidden text-ellipsis">
                          <div className="font-medium text-gray-900 truncate">{post.title}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {post.content ? post.content.substring(0, 70) + '...' : 'No content'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{post.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {post.tags && post.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded-lg shadow-sm"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x48/E0E0E0/A0A0A0?text=No+Image`; }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{formatDate(post.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{post.views} views</div>
                          <div className="text-gray-500">{post.comments} comments</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {/* View Button */}
                          <button
                            onClick={() => handleViewClick(post)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            title="View Post"
                          >
                            <Eye size={16} />
                          </button>
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditClick(post)}
                            className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Edit Post"
                          >
                            <Edit3 size={16} />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* No Posts Found Message */}
          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination Section (Placeholder) */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200" disabled>
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200" disabled>
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreatePostModal
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleTagsChange={handleTagsChange}
          handleCreatePost={handleCreatePost}
          setShowCreateModal={setShowCreateModal}
          resetForm={resetForm}
          setError={setError}
        />
      )}
      {showEditModal && (
        <EditPostModal
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleTagsChange={handleTagsChange}
          handleUpdatePost={handleUpdatePost}
          setShowEditModal={setShowEditModal}
          resetForm={resetForm}
          setError={setError}
          selectedPost={selectedPost} // Pass selectedPost to pre-fill form
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          selectedPost={selectedPost}
          setShowDeleteModal={setShowDeleteModal}
          setSelectedPost={setSelectedPost}
          handleDeletePost={handleDeletePost}
        />
      )}
      {showViewModal && (
        <ViewPostModal
          selectedPost={selectedPost}
          setShowViewModal={setShowViewModal}
          setSelectedPost={setSelectedPost}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

/**
 * Modal component for creating a new post.
 * @param {object} props - Props for the CreatePostModal.
 */
const CreatePostModal = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleTagsChange,
  handleCreatePost,
  setShowCreateModal,
  resetForm,
  setError
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
        <button
          onClick={() => {
            setShowCreateModal(false);
            resetForm();
            setError(null);
          }}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="create-title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="create-title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter post title"
            required
          />
        </div>

        <div>
          <label htmlFor="create-author" className="block text-sm font-medium text-gray-700 mb-2">
            Author <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="create-author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter author name"
            required
          />
        </div>

        <div>
          <label htmlFor="create-tags" className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            id="create-tags"
            value={formData.tags.join(', ')}
            onChange={handleTagsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., tech, programming, react"
          />
        </div>

        <div>
          <label htmlFor="create-image" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <input
            type="file"
            id="create-image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="create-content" className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="create-content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows="8"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Write your post content here..."
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setShowCreateModal(false);
              resetForm();
              setError(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreatePost}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Modal component for editing an existing post.
 * @param {object} props - Props for the EditPostModal.
 */
const EditPostModal = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleTagsChange,
  handleUpdatePost,
  setShowEditModal,
  resetForm,
  setError,
  selectedPost // Used to display current image if no new one is uploaded
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Edit Post</h2>
        <button
          onClick={() => {
            setShowEditModal(false);
            resetForm();
            setError(null);
          }}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="edit-title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter post title"
            required
          />
        </div>

        <div>
          <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700 mb-2">
            Author <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="edit-author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter author name"
            required
          />
        </div>

        <div>
          <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            id="edit-tags"
            value={formData.tags.join(', ')}
            onChange={handleTagsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., tech, programming, react"
          />
        </div>

        <div>
          <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          {selectedPost?.image && !formData.image && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">Current Image:</span>
              <img src={selectedPost.image} alt="Current Post" className="w-24 h-24 object-cover rounded-lg mt-1 shadow-sm" />
            </div>
          )}
          <input
            type="file"
            id="edit-image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank to keep current image. Select a new file to change.</p>
        </div>

        <div>
          <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="edit-content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows="8"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Write your post content here..."
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setShowEditModal(false);
              resetForm();
              setError(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdatePost}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Update Post
          </button>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Modal component for confirming post deletion.
 * @param {object} props - Props for the DeleteModal.
 */
const DeleteModal = ({ selectedPost, setShowDeleteModal, setSelectedPost, handleDeletePost }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Post</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete "<span className="font-semibold">{selectedPost?.title}</span>"? This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedPost(null);
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => handleDeletePost(selectedPost.id)}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

/**
 * Modal component for viewing post details.
 * @param {object} props - Props for the ViewPostModal.
 */
const ViewPostModal = ({ selectedPost, setShowViewModal, setSelectedPost, formatDate }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{selectedPost?.title}</h2>
        <button
          onClick={() => {
            setShowViewModal(false);
            setSelectedPost(null);
          }}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4 text-gray-700">
        {selectedPost?.image && (
          <div className="mb-4">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x256/E0E0E0/A0A0A0?text=No+Image`; }}
            />
          </div>
        )}
        <p className="text-sm flex items-center gap-2">
          <User size={16} className="text-gray-500" /> <strong>Author:</strong> {selectedPost?.author}
        </p>
        <p className="text-sm flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" /> <strong>Published On:</strong> {formatDate(selectedPost?.createdAt)}
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <strong>Tags:</strong>
          {(selectedPost?.tags || []).map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {tag}
            </span>
          ))}
          {(selectedPost?.tags || []).length === 0 && <span className="text-gray-500">No tags</span>}
        </div>
        <div className="text-sm">
          <strong>Stats:</strong> {selectedPost?.views} views, {selectedPost?.comments} comments
        </div>
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Content:</h3>
          <p className="whitespace-pre-wrap">{selectedPost?.content}</p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => {
            setShowViewModal(false);
            setSelectedPost(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default PostsAdminPage;
