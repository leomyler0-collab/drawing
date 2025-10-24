'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, Search, Filter, TrendingUp, Clock, Star, Trash2, Shield, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { drawingAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { localDB } from '@/utils/localStorageDB';
import { useAuth } from '@/contexts/AuthContext';
import { clientAuth } from '@/utils/clientAuth';

interface Drawing {
  _id: string;
  title: string;
  thumbnail: string;
  likes: number;
  views: number;
  userId: { username: string; avatar: string };
  createdAt: string;
}

export default function GalleryPage() {
  const { user } = useAuth();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [allDrawings, setAllDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [likedDrawings, setLikedDrawings] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'views'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    setIsAuthenticated(!!Cookies.get('token'));
    fetchGallery();
    
    // Listen for visibility changes from other components
    const handleVisibilityChange = (event: CustomEvent) => {
      console.log('🔄 Gallery: Detected visibility change, refreshing...', event.detail);
      fetchGallery(); // Refresh gallery when any drawing visibility changes
    };
    
    window.addEventListener('visibilityChanged', handleVisibilityChange as EventListener);
    
    return () => {
      window.removeEventListener('visibilityChanged', handleVisibilityChange as EventListener);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    console.log('🔄 [Gallery] Fetching gallery drawings...');
    
    try {
      // Try backend first
      const response = await drawingAPI.gallery(page);
      const backendDrawings = response.data.drawings || [];
      console.log(`✅ [Gallery] Loaded ${backendDrawings.length} drawings from backend`);
      setAllDrawings(backendDrawings);
      applyFiltersAndSort(backendDrawings);
    } catch (error) {
      // Fallback to localStorage - ONLY show public drawings
      console.log('⚡ [Gallery] Backend unavailable, using localStorage');
      
      try {
        const publicDrawings = localDB.getPublicDrawings();
        console.log(`📊 [Gallery] Found ${publicDrawings.length} public drawings in localStorage`);
        
        const formattedDrawings = publicDrawings.map(d => ({
          _id: d.id,
          title: d.title,
          thumbnail: d.thumbnail,
          likes: d.likes || 0,
          views: d.views || 0,
          userId: {
            username: d.userId ? getUsername(d.userId) : 'Anonymous',
            avatar: d.userId ? getAvatar(d.userId) : '👻'
          },
          createdAt: d.createdAt || new Date().toISOString(),
          isPublic: true // Already filtered for public
        }));
        
        setAllDrawings(formattedDrawings);
        applyFiltersAndSort(formattedDrawings);
        console.log(`✅ [Gallery] Displaying ${formattedDrawings.length} public drawings`);
        
        if (formattedDrawings.length === 0) {
          console.log('ℹ️ [Gallery] No public drawings found. Create and make drawings public to see them here!');
        }
      } catch (localError) {
        console.error('❌ [Gallery] Error loading from localStorage:', localError);
        setAllDrawings([]);
        applyFiltersAndSort([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getUsername = (userId: string): string => {
    const users = clientAuth.getAllUsers();
    const user = users.find(u => u.id === userId);
    return user?.username || 'Anonymous';
  };

  const getAvatar = (userId: string): string => {
    const users = clientAuth.getAllUsers();
    const user = users.find(u => u.id === userId);
    return user?.avatar || '👻';
  };

  const applyFiltersAndSort = (drawingsToFilter: Drawing[]) => {
    let filtered = [...drawingsToFilter];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.userId.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Pagination
    const total = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(total);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedDrawings = filtered.slice(startIndex, startIndex + itemsPerPage);
    setDrawings(paginatedDrawings);
  };

  useEffect(() => {
    applyFiltersAndSort(allDrawings);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, page, allDrawings]);

  const handleLike = async (drawingId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to like drawings');
      return;
    }

    if (likedDrawings.has(drawingId)) {
      toast('You already liked this drawing!', { icon: '❤️' });
      return;
    }

    try {
      // Try backend first
      const response = await drawingAPI.like(drawingId);
      const newLikes = response.data.likes;
      
      setDrawings(prev => prev.map(d => 
        d._id === drawingId ? { ...d, likes: newLikes } : d
      ));
      setAllDrawings(prev => prev.map(d => 
        d._id === drawingId ? { ...d, likes: newLikes } : d
      ));
      setLikedDrawings(prev => new Set(prev).add(drawingId));
      toast.success('Liked! ❤️');
    } catch (error) {
      // Fallback to localStorage
      const newLikes = localDB.likeDrawing(drawingId);
      setDrawings(prev => prev.map(d => 
        d._id === drawingId ? { ...d, likes: newLikes } : d
      ));
      setAllDrawings(prev => prev.map(d => 
        d._id === drawingId ? { ...d, likes: newLikes } : d
      ));
      setLikedDrawings(prev => new Set(prev).add(drawingId));
      toast.success('Liked! ❤️');
    }
  };

  const handleDeleteDrawing = async (drawingId: string) => {
    if (!user || user.tier !== 'admin') return;
    
    if (!confirm('Are you sure you want to delete this drawing?')) return;

    try {
      // Try backend first
      await drawingAPI.delete(drawingId);
      toast.success('Drawing deleted');
    } catch (error) {
      // Fallback to localStorage
      localDB.deleteDrawing(drawingId);
      toast.success('Drawing deleted (local)');
    } finally {
      fetchGallery();
      setSelectedDrawing(null);
    }
  };

  const handleViewDrawing = (drawing: Drawing) => {
    setSelectedDrawing(drawing);
    // Increment view count
    try {
      localDB.incrementViews(drawing._id);
      setDrawings(prev => prev.map(d => 
        d._id === drawing._id ? { ...d, views: d.views + 1 } : d
      ));
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  const isAdmin = user?.tier === 'admin';

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
              Community Gallery 🎨
            </h1>
            <p className="text-xl text-gray-400">
              Discover amazing spooky artworks from our community
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="spooky-card mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title or artist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-spooky-bg border border-orange-500/30 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                />
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                    sortBy === 'newest'
                      ? 'bg-orange-500 text-white'
                      : 'bg-spooky-bg border border-orange-500/30 text-gray-400 hover:border-orange-500'
                  }`}
                >
                  <Clock size={18} />
                  <span className="hidden sm:inline">Newest</span>
                </button>
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                    sortBy === 'popular'
                      ? 'bg-orange-500 text-white'
                      : 'bg-spooky-bg border border-orange-500/30 text-gray-400 hover:border-orange-500'
                  }`}
                >
                  <Star size={18} />
                  <span className="hidden sm:inline">Popular</span>
                </button>
                <button
                  onClick={() => setSortBy('views')}
                  className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                    sortBy === 'views'
                      ? 'bg-orange-500 text-white'
                      : 'bg-spooky-bg border border-orange-500/30 text-gray-400 hover:border-orange-500'
                  }`}
                >
                  <TrendingUp size={18} />
                  <span className="hidden sm:inline">Views</span>
                </button>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-400">
              Found {allDrawings.length} public drawings
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-400">Loading gallery...</p>
            </div>
          ) : drawings.length === 0 ? (
            <div className="spooky-card text-center py-12">
              <div className="text-6xl mb-4">👻</div>
              <h3 className="text-xl font-bold mb-2">No public drawings yet</h3>
              <p className="text-gray-400">Be the first to share your spooky creation!</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {drawings.map((drawing, index) => (
                  <GalleryCard 
                    key={drawing._id} 
                    drawing={drawing} 
                    index={index}
                    onLike={handleLike}
                    onView={handleViewDrawing}
                    onDelete={isAdmin ? handleDeleteDrawing : undefined}
                    canLike={isAuthenticated}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>

              {/* Drawing Detail Modal */}
              <AnimatePresence>
                {selectedDrawing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedDrawing(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="spooky-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">{selectedDrawing.title}</h2>
                        <button
                          onClick={() => setSelectedDrawing(null)}
                          className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      <div className="relative aspect-video bg-gray-900/50 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                        <img
                          src={selectedDrawing.thumbnail || '/placeholder.png'}
                          alt={selectedDrawing.title}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.png';
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{selectedDrawing.userId.avatar}</span>
                          <div>
                            <p className="font-semibold">{selectedDrawing.userId.username}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(selectedDrawing.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Eye size={20} />
                            <span className="font-semibold">{selectedDrawing.views}</span>
                          </div>
                          <div className="flex items-center gap-2 text-red-400">
                            <Heart size={20} fill="currentColor" />
                            <span className="font-semibold">{selectedDrawing.likes}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleLike(selectedDrawing._id)}
                          disabled={!isAuthenticated}
                          className="flex-1 spooky-btn disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Heart className="inline mr-2" size={18} />
                          {likedDrawings.has(selectedDrawing._id) ? 'Liked' : 'Like'}
                        </button>
                        
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteDrawing(selectedDrawing._id)}
                            className="px-6 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                          >
                            <Trash2 className="inline mr-2" size={18} />
                            Delete
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-6 py-3 rounded-lg bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-6 py-3 rounded-lg bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ 
  drawing, 
  index, 
  onLike,
  onView,
  onDelete,
  canLike,
  isAdmin
}: { 
  drawing: Drawing; 
  index: number;
  onLike: (id: string) => void;
  onView: (drawing: Drawing) => void;
  onDelete?: (id: string) => void;
  canLike: boolean;
  isAdmin: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="spooky-card relative group"
    >
      {/* Admin Badge */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 bg-purple-500/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Shield size={14} />
          <span className="text-xs font-bold">ADMIN</span>
        </div>
      )}

      <div 
        className="aspect-square rounded-lg overflow-hidden mb-3 bg-spooky-bg cursor-pointer relative"
        onClick={() => onView(drawing)}
      >
        <img
          src={drawing.thumbnail || '/placeholder.png'}
          alt={drawing.title}
          className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.png';
          }}
        />
      </div>

      <h3 
        className="font-bold truncate mb-2 cursor-pointer hover:text-orange-500 transition-colors"
        onClick={() => onView(drawing)}
      >
        {drawing.title}
      </h3>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{drawing.userId.avatar}</span>
        <span className="text-sm text-gray-400">{drawing.userId.username}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Eye size={14} /> {drawing.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={14} /> {drawing.likes}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onLike(drawing._id)}
            disabled={!canLike}
            className={`p-2 rounded-lg transition-colors ${
              canLike 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-gray-500/10 text-gray-500 cursor-not-allowed'
            }`}
            title={canLike ? 'Like this drawing' : 'Login to like'}
          >
            <Heart size={18} fill={canLike ? 'currentColor' : 'none'} />
          </button>

          {isAdmin && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(drawing._id);
              }}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete drawing (Admin)"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        {new Date(drawing.createdAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
}
