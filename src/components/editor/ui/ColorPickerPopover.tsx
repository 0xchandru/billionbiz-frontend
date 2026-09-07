import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Pipette, Check } from 'lucide-react';
import { useSiteStore } from '../../../store/siteStore';
import { getDefaultTheme } from '../theme/themePresets';

interface ColorPickerPopoverProps {
  value?: string;
  onChange: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

const COMMON_PRESET_COLORS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#94a3b8', '#475569', '#1e293b', '#0f172a', '#000000',
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#ec4899', '#f43f5e', '#14b8a6', '#84cc16', '#a855f7', '#64748b'
];

export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  value,
  onChange,
  size = 'md',
  className,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hiddenColorInputRef = useRef<HTMLInputElement>(null);

  const { theme } = useSiteStore();
  const defaultPalette = getDefaultTheme().palette;
  const palette = theme?.palette || defaultPalette;

  // Key theme swatches to offer first
  const themeSwatches = [
    { label: 'Primary', color: palette.brand?.primary || '#2563eb' },
    { label: 'Secondary', color: palette.brand?.secondary || '#4f46e5' },
    { label: 'Accent', color: palette.brand?.accent || '#f59e0b' },
    { label: 'Surface', color: palette.background?.surface || '#f8fafc' },
    { label: 'Section Bg', color: palette.background?.sectionBg || '#ffffff' },
    { label: 'Heading', color: palette.text?.heading || '#0f172a' },
    { label: 'Body Text', color: palette.text?.body || '#475569' },
    { label: 'Border', color: palette.border?.border || '#e2e8f0' },
  ];

  // Calculate safe position inside the viewport
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 260;
    const popoverHeight = 310;

    // Prefer opening to the left of the trigger (since sidebar is on the right)
    let left = rect.right - popoverWidth;
    
    // Check right screen collision
    if (left + popoverWidth > window.innerWidth - 12) {
      left = window.innerWidth - popoverWidth - 12;
    }
    // Check left screen collision
    if (left < 12) {
      left = 12;
    }

    // Vertical positioning: try below, if clipped try above
    let top = rect.bottom + 6;
    if (top + popoverHeight > window.innerHeight - 12) {
      top = Math.max(12, rect.top - popoverHeight - 6);
    }

    setPopoverPos({ top, left });
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close on outside click or scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleResizeOrScroll = () => {
      updatePosition();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [isOpen]);

  // Eyedropper API support
  const handleEyeDropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          onChange(result.sRGBHex);
        }
      } catch {
        // User cancelled eyedropper
      }
    } else if (hiddenColorInputRef.current) {
      hiddenColorInputRef.current.click();
    }
  };

  const sizeDimensions = {
    sm: { width: '22px', height: '22px', borderRadius: '4px' },
    md: { width: '28px', height: '28px', borderRadius: '6px' },
    lg: { width: '34px', height: '34px', borderRadius: '8px' },
  }[size];

  const currentColor = (value && (value.startsWith('#') || value.startsWith('rgb'))) 
    ? value 
    : '#2563eb';

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className={className}
        title="Click to choose color"
        style={{
          ...sizeDimensions,
          position: 'relative',
          backgroundColor: currentColor,
          border: '1px solid #cbd5e1',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        {/* Subtle inner highlight to make white/light swatches clearly visible */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: sizeDimensions.borderRadius,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
          pointerEvents: 'none',
        }} />
      </div>

      {isOpen && createPortal(
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: `${popoverPos.top}px`,
            left: `${popoverPos.left}px`,
            width: '260px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            zIndex: 999999,
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontFamily: 'Inter, -apple-system, sans-serif',
            animation: 'fadeIn 0.12s ease-out',
          }}
        >
          {/* Header Row: Current swatch, Hex input, and Eyedropper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: currentColor,
                border: '1px solid #cbd5e1',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                flexShrink: 0,
              }}
            />
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '6px 8px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  color: '#1e293b',
                  backgroundColor: '#f8fafc',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>
            {/* Eyedropper / Native Picker button */}
            <button
              type="button"
              onClick={handleEyeDropper}
              title="Pick color from screen or advanced chooser"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#475569',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <Pipette size={15} />
            </button>
            {/* Hidden native input positioned safely inside portal, not at screen edge */}
            <input
              ref={hiddenColorInputRef}
              type="color"
              value={currentColor.startsWith('#') ? currentColor : '#2563eb'}
              onChange={(e) => onChange(e.target.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
            />
          </div>

          {/* Theme Palette Swatches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Theme Colors
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {themeSwatches.map((item) => {
                const isSelected = value?.toLowerCase() === item.color.toLowerCase();
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onChange(item.color)}
                    title={`${item.label}: ${item.color}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 6px',
                      backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                      border: isSelected ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      border: '1px solid rgba(0,0,0,0.15)',
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Standard Color Palette Swatches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Preset Swatches
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px' }}>
              {COMMON_PRESET_COLORS.map((hex) => {
                const isSelected = value?.toLowerCase() === hex.toLowerCase();
                return (
                  <div
                    key={hex}
                    onClick={() => onChange(hex)}
                    title={hex}
                    style={{
                      height: '22px',
                      borderRadius: '4px',
                      backgroundColor: hex,
                      border: isSelected ? '2px solid #2563eb' : '1px solid rgba(0,0,0,0.12)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {isSelected && (
                      <Check size={11} color={['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#fef08a'].includes(hex) ? '#0f172a' : '#ffffff'} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
