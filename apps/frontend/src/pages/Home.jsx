import React, { useEffect, useState } from 'react';
import { Calendar, User, Tag, ArrowRight, TrendingUp, Clock, Eye, Star, BookOpen, Edit, Plus } from 'lucide-react';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalAuthors: 0,
    totalTags: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts from API
        const postsResponse = await fetch('http://localhost:5000/api/posts');
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }
        const postsData = await postsResponse.json();
        console.log('Posts data:', postsData);

        // Fetch stats from API
        const statsResponse = await fetch('http://localhost:5000/api/stats');
        const statsData = statsResponse.ok ? await statsResponse.json() : null;
        console.log('Stats data:', statsData);

        // Sort posts by date (newest first)
        const sortedPosts = postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Get featured posts (assuming you have a 'featured' field, or take the first 2 posts)
        const featured = sortedPosts.filter(post => post.featured) || sortedPosts.slice(0, 2);
        const recent = sortedPosts.slice(0, 6); // Get 6 most recent posts

        setFeaturedPosts(featured);
        setRecentPosts(recent);

        // Set stats from API or calculate from posts data
        if (statsData) {
          setStats(statsData);
        } else {
          // Calculate stats from posts if stats API not available
          const uniqueAuthors = [...new Set(postsData.map(post => post.author).filter(Boolean))];
          const allTags = postsData.flatMap(post => post.tags || []);
          const uniqueTags = [...new Set(allTags)];
          const totalViews = postsData.reduce((sum, post) => sum + (post.views || 0), 0);

          setStats({
            totalPosts: postsData.length,
            totalViews: totalViews,
            totalAuthors: uniqueAuthors.length,
            totalTags: uniqueTags.length
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setStats({
          totalPosts: 0,
          totalViews: 0,
          totalAuthors: 0,
          totalTags: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gagal Memuat Data</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/400/250';
    return imagePath.startsWith('http') ? imagePath : `http://localhost:5000${imagePath}`;
  };

  const handlePostClick = (postId) => {
    window.location.href = `/posts/${postId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-300 rounded-lg mb-8 w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="h-12 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Blog CMS Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kelola konten blog Anda dengan mudah dan efisien. Buat, edit, dan publikasikan artikel dengan tools yang powerful dan user-friendly.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-lg">
              <Plus className="w-5 h-5" />
              Buat Artikel Baru
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 flex items-center gap-2 shadow-lg">
              <BookOpen className="w-5 h-5" />
              Lihat Semua Artikel
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Artikel</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalPosts}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-gray-800">{formatNumber(stats.totalViews)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Penulis</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalAuthors}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Tags</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalTags}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Tag className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-800">Artikel Unggulan</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => handlePostClick(post.id)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl cursor-pointer group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={getImageUrl(post.image)} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/250';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Unggulan
                  </div>
                  {post.views && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(post.views)}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      Edit Artikel
                    </button>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-green-500" />
              <h2 className="text-3xl font-bold text-gray-800">Artikel Terbaru</h2>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => handlePostClick(post.id)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getImageUrl(post.image)} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/250';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  {post.views && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(post.views)}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags && post.tags.length > 2 && (
                      <span className="text-xs text-gray-500 py-1">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;