import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import socket from '../utils/socket';

export default function Feed() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);

  function loadFeed() {
    api.get('/api/posts/feed', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setPosts);
  }

  useEffect(() => {
    loadFeed();
    socket.on('newPost', loadFeed);
    socket.on('postLiked', loadFeed);
    return () => {
      socket.off('newPost', loadFeed);
      socket.off('postLiked', loadFeed);
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
      <CreatePost onCreated={loadFeed} />
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No posts yet. Follow some people or create a post!</p>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} onUpdate={loadFeed} />)
      )}
    </div>
  );
}
