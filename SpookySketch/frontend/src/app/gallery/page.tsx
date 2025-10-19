'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { drawingAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

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
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [likedDrawings, setLikedDrawings] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsAuthenticated(!!Cookies.get('token'));
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await drawingAPI.gallery(page);
      setDrawings(response.data.drawings || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      toast.error('Failed to load gallery');
      setDrawings([]);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await drawingAPI.like(drawingId);
      setDrawings(prev => prev.map(d => 
        d._id === drawingId ? { ...d, likes: response.data.likes } : d
      ));
      setLikedDrawings(prev => new Set(prev).add(drawingId));
      toast.success('Liked! ❤️');
    } catch (error: any) {
      console.error('Failed to like:', error);
      toast.error(error.response?.data?.error || 'Failed to like drawing');
    }
  };

  useEffect(() => {
    fetchGallery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
              Community Gallery 🎨
            </h1>
            <p className="text-xl text-gray-400">
              Discover amazing spooky artworks from our community
            </p>
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
                    canLike={isAuthenticated}
                  />
                ))}
              </div>

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
  canLike
}: { 
  drawing: Drawing; 
  index: number;
  onLike: (id: string) => void;
  canLike: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="spooky-card"
    >
      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-spooky-bg">
        <img
          src={drawing.thumbnail}
          alt={drawing.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      <h3 className="font-bold truncate mb-2">{drawing.title}</h3>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{drawing.userId.avatar}</span>
        <span className="text-sm text-gray-400">{drawing.userId.username}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Eye size={14} /> {drawing.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={14} /> {drawing.likes}
          </span>
        </div>
        
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
      </div>

      <div className="text-xs text-gray-500 mt-2">
        {new Date(drawing.createdAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
}
