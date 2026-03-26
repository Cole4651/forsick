import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import socket from '../utils/socket';

export default function PostDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  function loadPost() {
    api.get(`/api/posts/${id}`).then(res => res.json()).then(setPost);
  }

  useEffect(() => {
    loadPost();
    socket.on('newComment', (data) => {
      if (data.postId === parseInt(id)) loadPost();
    });
    socket.on('postLiked', (data) => {
      if (data.postId === parseInt(id)) loadPost();
    });
    return () => {
      socket.off('newComment');
      socket.off('postLiked');
    };
  }, [id]);

  async function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    await api.post(`/api/comments/${id}`, { content: comment }, token);
    setComment('');
    loadPost();
  }

  if (!post) return <p className="text-center py-8">Loading...</p>;

  return (
    <div>
      <PostCard post={post} onUpdate={loadPost} />

      <form onSubmit={handleComment} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full resize-none border-0 focus:ring-0 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent outline-none"
          rows={2}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!comment.trim()}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            Comment
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {post.comments?.map(c => (
          <div key={c.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
                {c.author.name?.[0] || c.author.username[0]}
              </div>
              <span className="text-sm font-semibold dark:text-gray-100">{c.author.name || c.author.username}</span>
              <span className="text-xs text-gray-400">@{c.author.username}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 ml-9">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
