import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadZone({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleInputChange = (e) => handleFile(e.target.files[0]);

  return (
    <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}>
      <motion.div
        onClick={() => !preview && inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={{
          borderColor: dragging ? 'var(--accent)' : preview ? 'var(--accent)' : 'var(--border-bright)',
          boxShadow: dragging ? '0 0 40px var(--accent-glow)' : preview ? '0 0 20px var(--accent-glow)' : 'none',
        }}
        transition={{ duration: 0.2 }}
        style={{
          border: '1.5px dashed var(--border-bright)',
          borderRadius: 'var(--radius-xl)',
          background: dragging ? 'var(--accent-dim)' : 'var(--bg-card)',
          padding: preview ? '0' : '3rem 2rem',
          cursor: preview ? 'default' : 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.2s',
          minHeight: preview ? '320px' : 'auto',
        }}
      >
        {/* Scanner sweep animation on hover/drag */}
        {!preview && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, var(--accent-dim) 50%, transparent 100%)',
            animation: dragging ? 'sweep 1.2s ease-in-out infinite' : 'none',
            pointerEvents: 'none',
          }} />
        )}

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'relative' }}
            >
              <img
                src={preview}
                alt="Uploaded packet"
                style={{
                  width: '100%',
                  height: '320px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-xl)',
                  display: 'block',
                }}
              />
              {/* Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(to top, rgba(10,13,18,0.9) 0%, transparent 50%)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '1.2rem',
                left: '1.4rem',
                right: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Ready to scan
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fileName}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFileName(''); }}
                  style={{
                    background: 'rgba(255,78,78,0.15)',
                    color: '#ff4e4e',
                    border: '1px solid rgba(255,78,78,0.3)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
            >
              {/* Icon */}
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '18px',
                background: 'var(--accent-dim)',
                border: '1.5px solid rgba(168,255,62,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 1.5rem',
              }}>
                📦
              </div>

              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                {dragging ? 'Drop it here' : 'Upload Food Packet'}
              </div>

              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '1.5rem' }}>
                Take a photo of the ingredients list on the back of any food packet
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent)',
                color: '#0a0d12',
                borderRadius: '10px',
                padding: '10px 22px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.02em',
              }}>
                <span>Choose Image</span>
                <span>→</span>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '12px', color: 'var(--text-muted)' }}>
                or drag and drop · JPG, PNG, WEBP
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />
      </motion.div>

      <style>{`
        @keyframes sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
