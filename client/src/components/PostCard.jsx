import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function PostCard({ post, onUpdate }) {
  const { token, user } = useAuth();
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);

  async function handleLike() {
    const res = await api.post(`/api/posts/${post.id}/like`, {}, token);
    const data = await res.json();
    setLiked(data.liked);
    setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
  }

  async function handleDelete() {
    await api.delete(`/api/posts/${post.id}`, token);
    if (onUpdate) onUpdate();
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <Link to={`/profile/${post.author.username}`} className="flex items-center gap-2">
          {post.author.avatar ? (
            <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
              {post.author.name?.[0] || post.author.username[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm dark:text-gray-100">{post.author.name || post.author.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{post.author.username}</p>
          </div>
        </Link>
        {user?.id === post.author.id && (
          <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600">Delete</button>
        )}
      </div>

      <Link to={`/post/${post.id}`}>
        <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>
        {post.image && (
          post.mediaType === 'video' ? (
            <video src={post.image} controls className="rounded-lg mb-3 max-h-80 w-full" />
          ) : (
            <img src={post.image} alt="" className="rounded-lg mb-3 max-h-80 w-full object-cover" />
          )
        )}
      </Link>

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <button onClick={handleLike} className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'hover:text-red-500'}`}>
          {liked ? '♥' : '♡'} {likeCount}
        </button>
        <Link to={`/post/${post.id}`} className="hover:text-indigo-500 dark:hover:text-indigo-400">
          💬 {post._count?.comments || 0}
        </Link>
      </div>
    </div>
  );
}
