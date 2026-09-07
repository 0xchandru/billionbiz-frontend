import React, { useState, useEffect } from 'react';
import { Sparkles, X, Wand2, Zap, Palette, CheckCircle2 } from 'lucide-react';
import styles from './topbar.module.css';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className={styles.aiDrawerOverlay} onClick={onClose}>
      <div 
        className={styles.aiDrawerPanel} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.aiDrawerHeader}>
          <div className={styles.aiHeaderLeft}>
            <div className={styles.aiSparkleIcon}>
              <Sparkles size={18} />
            </div>
            <div>
              <div className={styles.aiDrawerTitle}>BillionBiz AI</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Next-Gen Store Intelligence</div>
            </div>
          </div>
          <button 
            className={styles.aiDrawerCloseBtn} 
            onClick={onClose}
            title="Close drawer (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className={styles.aiDrawerBody}>
          <div className={styles.aiHeroIllustration}>
            <Sparkles size={38} />
          </div>

          <div className={styles.aiComingSoonBadge}>
            <Sparkles size={12} /> Coming Soon • Beta Access
          </div>

          <h2 className={styles.aiHeadline}>
            Supercharge Your Storefront With AI
          </h2>

          <p className={styles.aiSubtext}>
            We're building intelligent generative design and high-converting marketing tools directly inside the BillionBiz editor.
          </p>

          {/* Feature Teasers */}
          <div className={styles.aiFeatureList}>
            <div className={styles.aiFeatureItem}>
              <div className={styles.aiFeatureIcon} style={{ color: '#7c3aed' }}>
                <Wand2 size={20} />
              </div>
              <div>
                <div className={styles.aiFeatureTitle}>1-Click Generative Sections</div>
                <div className={styles.aiFeatureDesc}>
                  Describe your product or brand and let AI craft complete, responsive page layouts in seconds.
                </div>
              </div>
            </div>

            <div className={styles.aiFeatureItem}>
              <div className={styles.aiFeatureIcon} style={{ color: '#ec4899' }}>
                <Zap size={20} />
              </div>
              <div>
                <div className={styles.aiFeatureTitle}>Smart E-commerce Copywriting</div>
                <div className={styles.aiFeatureDesc}>
                  Generate high-converting headlines, feature bullet points, and marketing taglines optimized for sales.
                </div>
              </div>
            </div>

            <div className={styles.aiFeatureItem}>
              <div className={styles.aiFeatureIcon} style={{ color: '#3b82f6' }}>
                <Palette size={20} />
              </div>
              <div>
                <div className={styles.aiFeatureTitle}>Intelligent Color & Font Harmonizer</div>
                <div className={styles.aiFeatureDesc}>
                  AI creates mathematically harmonious color palettes tailored specifically to your brand logo.
                </div>
              </div>
            </div>
          </div>

          {/* Waitlist Box */}
          <div className={styles.aiWaitlistCard}>
            <div className={styles.aiWaitlistTitle}>Get Early Access When AI Launches</div>
            {isSubmitted ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#059669', fontSize: '13px', fontWeight: 600, padding: '8px 0' }}>
                <CheckCircle2 size={16} /> You're on the priority early access list!
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className={styles.aiWaitlistInputRow}>
                <input
                  type="email"
                  className={styles.aiWaitlistInput}
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className={styles.aiWaitlistBtn}>
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
