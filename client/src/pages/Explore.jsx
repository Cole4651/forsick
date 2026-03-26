import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import socket from '../utils/socket';

export default function Explore() {
  const [posts, setPosts] = useState([]);

  function loadPosts() {
    api.get('/api/posts').then(res => res.json()).then(setPosts);
  }

  useEffect(() => {
    loadPosts();
    socket.on('newPost', loadPosts);
    socket.on('postLiked', loadPosts);
    return () => {
      socket.off('newPost', loadPosts);
      socket.off('postLiked', loadPosts);
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No posts yet. Be the first!</p>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} onUpdate={loadPosts} />)
      )}
    </div>
  );
}
