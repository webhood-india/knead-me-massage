import { useRef, useState } from 'react';
import { adminApi, getErrorMessage } from '../api/client';
import toast from 'react-hot-toast';

/**
 * Drop-in image uploader for admin forms (treatments, blog). Uploads to the backend,
 * which stores the file on disk and returns a URL — `value` is that URL string.
 */
export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await adminApi.post('/upload', formData, {
        
      });
      onChange(res.data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="text-sm text-charcoal-900/50 block mb-1">{label}</label>
      {value && (
        <div className="relative mb-2 w-32">
          <img src={value.startsWith('/uploads/') ? value : value} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-charcoal-900/10" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-charcoal-900 text-white w-6 h-6 rounded-full text-xs"
          >
            ✕
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="text-sm" />
      {uploading && <p className="text-xs text-charcoal-900/40 mt-1">Uploading…</p>}
    </div>
  );
}
