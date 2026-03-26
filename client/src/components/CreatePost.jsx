import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function CreatePost({ onCreated }) {
  const { token } = useAuth();
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setFileType(selected.type.startsWith('video/') ? 'video' : 'image');
    }
  }

  function removeFile() {
    setFile(null);
    setPreview(null);
    setFileType(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    try {
      let mediaUrl = null;
      let mediaType = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Upload failed');
        const uploadData = await uploadRes.json();
        mediaUrl = uploadData.url;
        mediaType = uploadData.type;
      }
      const res = await api.post('/api/posts', { content, image: mediaUrl, mediaType }, token);
      if (!res.ok) throw new Error('Failed to create post');
      setContent('');
      removeFile();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Could not connect to server. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full resize-none border-0 focus:ring-0 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent outline-none"
        rows={3}
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {preview && (
        <div className="relative mb-3">
          {fileType === 'video' ? (
            <video src={preview} controls className="rounded-lg max-h-60 w-full" />
          ) : (
            <img src={preview} alt="Preview" className="rounded-lg max-h-60 w-full object-cover" />
          )}
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80"
          >
            X
          </button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          📎 Files
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Post'}
        </button>
      </div>
    </form>
  );
}
