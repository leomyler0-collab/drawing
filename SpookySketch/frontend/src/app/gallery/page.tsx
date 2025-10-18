'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { localDB } from '@/utils/localStorageDB';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

  const fetchGallery = async () => {
    try {
      // Try backend first
      const response = await axios.get(`${API_URL}/api/drawings/gallery/public?page=${page}`, {
        timeout: 3000,
      });
      setDrawings(response.data.drawings);
    } catch (error) {
      // Gracefully fallback to localStorage
      console.log('⚡ Backend unavailable, showing local public drawings');
      const localDrawings = localDB.getAllDrawings()
        .filter(d => d.isPublic)
        .map(d => ({
          _id: d.id,
          title: d.title,
          thumbnail: d.thumbnail,
          likes: d.likes,
          views: d.views,
          userId: { username: 'Local Artist', avatar: '🎨' },
          createdAt: d.createdAt,
        }));
      setDrawings(localDrawings);
    } finally {
      setLoading(false);
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
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {drawings.map((drawing, index) => (
                <GalleryCard key={drawing._id} drawing={drawing} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ drawing, index }: { drawing: Drawing; index: number }) {
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

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <Eye size={14} /> {drawing.views}
        </span>
        <span className="flex items-center gap-1">
          <Heart size={14} /> {drawing.likes}
        </span>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        {new Date(drawing.createdAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
}
