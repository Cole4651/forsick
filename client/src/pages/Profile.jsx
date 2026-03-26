import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../utils/api';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const avatarRef = useRef();

  function loadProfile() {
    api.get(`/api/users/${username}`).then(res => res.json()).then(data => {
      setProfile(data);
      if (currentUser && data.id !== currentUser.id) {
        api.get(`/api/follows/${data.id}/status`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.json())
          .then(d => setIsFollowing(d.following));
      }
    });
  }

  useEffect(() => { loadProfile(); }, [username]);

  async function handleFollow() {
    const res = await api.post(`/api/follows/${profile.id}`, {}, token);
    const data = await res.json();
    setIsFollowing(data.following);
    loadProfile();
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const { url } = await uploadRes.json();
      await api.put('/api/users/me', { avatar: url }, token);
      loadProfile();
    } finally {
      setUploading(false);
    }
  }

  if (!profile) return <p className="text-center py-8">Loading...</p>;

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative group">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                {profile.name?.[0] || profile.username[0]}
              </div>
            )}
            {isOwnProfile && (
              <>
                <button
                  onClick={() => avatarRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <span className="text-white text-xs font-medium">
                    {uploading ? '...' : 'Edit'}
                  </span>
                </button>
                <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{profile.name || profile.username}</h1>
            <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
          </div>
          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isFollowing
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        {profile.bio && <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.bio}</p>}
        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
          <span><strong className="text-gray-900 dark:text-gray-100">{profile._count.posts}</strong> posts</span>
          <span><strong className="text-gray-900 dark:text-gray-100">{profile._count.followers}</strong> followers</span>
          <span><strong className="text-gray-900 dark:text-gray-100">{profile._count.following}</strong> following</span>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Posts</h2>
      {profile.posts?.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No posts yet.</p>
      ) : (
        profile.posts?.map(post => <PostCard key={post.id} post={post} onUpdate={loadProfile} />)
      )}
    </div>
  );
}
