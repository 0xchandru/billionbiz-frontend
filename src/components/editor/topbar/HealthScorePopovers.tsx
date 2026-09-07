import React, { useState, useRef, useEffect } from 'react';
import { Activity, Search, Zap, CheckCircle2, AlertCircle, ExternalLink, X } from 'lucide-react';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import styles from './topbar.module.css';

type ActivePopoverType = 'health' | 'seo' | 'speed' | null;

export const HealthScorePopovers: React.FC = () => {
  const [activePopover, setActivePopover] = useState<ActivePopoverType>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setActivePanel, setActiveSettingItem } = useLandingEditorStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    if (activePopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePopover]);

  const togglePopover = (type: ActivePopoverType) => {
    setActivePopover((prev) => (prev === type ? null : type));
  };

  const handleOpenSeoSettings = () => {
    setActivePanel('settings');
    setActiveSettingItem('SEO');
    setActivePopover(null);
  };

  return (
    <div ref={containerRef} className={styles.scoresContainer}>
      {/* 1. Page Health Pill */}
      <button
        className={`${styles.scorePill} ${activePopover === 'health' ? styles.scoreActive : ''}`}
        onClick={() => togglePopover('health')}
        title="Page Health Score (Click for breakdown)"
      >
        <Activity size={13} color="#059669" />
        <span>Health</span>
        <span className={styles.scoreValueGreen}>96%</span>
      </button>

      {/* 2. SEO Health Pill */}
      <button
        className={`${styles.scorePill} ${activePopover === 'seo' ? styles.scoreActive : ''}`}
        onClick={() => togglePopover('seo')}
        title="SEO Optimization Score (Click for checklist)"
      >
        <Search size={13} color="#0284c7" />
        <span>SEO</span>
        <span className={styles.scoreValueTeal}>92%</span>
      </button>

      {/* 3. Speed / Performance Pill */}
      <button
        className={`${styles.scorePill} ${activePopover === 'speed' ? styles.scoreActive : ''}`}
        onClick={() => togglePopover('speed')}
        title="Store Speed Performance (Click for details)"
      >
        <Zap size={13} color="#7c3aed" />
        <span>Speed</span>
        <span className={styles.scoreValuePurple}>98%</span>
      </button>

      {/* Popovers */}
      {activePopover === 'health' && (
        <div className={`${styles.popoverCard} ${styles.healthPopover}`}>
          <div className={styles.popoverHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#059669" />
              <span className={styles.popoverTitle}>Page Health</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={styles.scoreLargeBadge} style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                96 / 100 • Excellent
              </span>
              <button 
                onClick={() => setActivePopover(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> Layout Stability (CLS)
            </span>
            <span className={styles.metricVal}>0.01 (Pass)</span>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> Mobile Responsiveness
            </span>
            <span className={styles.metricVal}>100% Ready</span>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> Color Contrast & A11y
            </span>
            <span className={styles.metricVal}>AAA Rating</span>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> Broken Links Check
            </span>
            <span className={styles.metricVal}>0 Broken</span>
          </div>

          <div className={styles.popoverFooterAction}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              All critical layout checks passed. Page is fully optimized.
            </span>
          </div>
        </div>
      )}

      {activePopover === 'seo' && (
        <div className={`${styles.popoverCard} ${styles.healthPopover}`}>
          <div className={styles.popoverHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={16} color="#0284c7" />
              <span className={styles.popoverTitle}>SEO Health</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={styles.scoreLargeBadge} style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                92 / 100 • High
              </span>
              <button 
                onClick={() => setActivePopover(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> Meta Title Tag
            </span>
            <span className={styles.metricVal}>Configured (54 chars)</span>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> Meta Description
            </span>
            <span className={styles.metricVal}>Configured (142 chars)</span>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> OpenGraph Social Preview
            </span>
            <span className={styles.metricVal}>Generated</span>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <AlertCircle size={13} color="#f59e0b" /> Image Alt Tags
            </span>
            <span className={styles.metricVal} style={{ color: '#d97706' }}>1 Missing</span>
          </div>

          <div className={styles.popoverFooterAction}>
            <button className={styles.linkBtn} onClick={handleOpenSeoSettings}>
              Edit SEO Settings <ExternalLink size={11} style={{ display: 'inline', marginLeft: 3 }} />
            </button>
          </div>
        </div>
      )}

      {activePopover === 'speed' && (
        <div className={`${styles.popoverCard} ${styles.healthPopover}`}>
          <div className={styles.popoverHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="#7c3aed" />
              <span className={styles.popoverTitle}>Store Speed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={styles.scoreLargeBadge} style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
                98 / 100 • Blazing
              </span>
              <button 
                onClick={() => setActivePopover(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> First Contentful Paint
            </span>
            <span className={styles.metricVal}>0.4s</span>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> Largest Contentful Paint
            </span>
            <span className={styles.metricVal}>0.8s (Fast)</span>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> Cumulative Layout Shift
            </span>
            <span className={styles.metricVal}>0.00</span>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricName}>
              <CheckCircle2 size={13} color="#10b981" /> WebP Image Compression
            </span>
            <span className={styles.metricVal}>Enabled</span>
          </div>

          <div className={styles.popoverFooterAction}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Storefront assets served via high-speed global CDN edge.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
