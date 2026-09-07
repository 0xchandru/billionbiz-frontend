import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { useSiteStore } from '../../../store/siteStore';
import { getDefaultTheme } from '../theme/themePresets';
import type { ThemeOverrideMode } from '../theme/themeResolver';

interface ThemeOverrideControlProps {
  label: string;
  value: any;
  onChange: (newValue: any) => void;
  isBackground?: boolean;
  fieldKey?: string;
}

export const ThemeOverrideControl: React.FC<ThemeOverrideControlProps> = ({
  label,
  value,
  onChange,
  isBackground = false,
  fieldKey = '',
}) => {
  const { theme } = useSiteStore();
  const defaultPalette = getDefaultTheme().palette;
  const palette = theme?.palette || defaultPalette;

  // Determine current active global token for this field
  const getGlobalTokenInfo = (): { name: string; color: string } => {
    const key = fieldKey.toLowerCase();
    if (key.includes('bg') || key.includes('background')) {
      if (key.includes('container')) {
        return { name: 'Container Background', color: palette?.background?.containerBg || defaultPalette.background.containerBg };
      }
      return { name: 'Section Background', color: palette?.background?.sectionBg || palette?.background?.background || defaultPalette.background.sectionBg };
    }
    if (key.includes('heading')) {
      return { name: 'Heading Text', color: palette?.text?.heading || defaultPalette.text.heading };
    }
    if (key.includes('subheading')) {
      return { name: 'Subheading Text', color: palette?.text?.subheading || defaultPalette.text.subheading };
    }
    if (key.includes('muted')) {
      return { name: 'Muted Text', color: palette?.text?.muted || defaultPalette.text.muted };
    }
    if (key.includes('border') || key.includes('divider')) {
      return { name: 'Border', color: palette?.border?.border || defaultPalette.border.border };
    }
    if (key.includes('btn') || key.includes('button')) {
      if (key.includes('text') || key.includes('color')) {
        return { name: 'Button Text', color: palette?.brand?.primary || defaultPalette.brand.primary };
      }
      return { name: 'Primary Button', color: palette?.brand?.primary || defaultPalette.brand.primary };
    }
    // Default to body text or primary
    return { name: 'Body Text', color: palette?.text?.body || defaultPalette.text.body };
  };

  const tokenInfo = getGlobalTokenInfo();

  // Normalize current mode and values
  let currentMode: ThemeOverrideMode = 'inherit';
  let currentColor = tokenInfo.color;
  let currentGradient = {
    type: 'linear' as 'linear' | 'radial',
    color1: palette?.brand?.primary || defaultPalette.brand.primary,
    color2: palette?.brand?.secondary || defaultPalette.brand.secondary,
    angle: '135deg',
  };
  let currentImage = {
    url: '',
    position: 'center',
    size: 'cover',
    overlayColor: '#000000',
    overlayOpacity: 0.3,
  };

  if (value && typeof value === 'object' && value.mode) {
    currentMode = value.mode;
    if (value.color) currentColor = value.color;
    if (value.gradient) currentGradient = { ...currentGradient, ...value.gradient };
    if (value.image) currentImage = { ...currentImage, ...value.image };
  } else if (typeof value === 'string') {
    if (value.startsWith('var(--theme') || value === 'inherit') {
      currentMode = 'inherit';
    } else if (value.includes('gradient')) {
      currentMode = 'gradient';
    } else if (value.startsWith('url(')) {
      currentMode = 'image';
    } else if (value.startsWith('#') || value.startsWith('rgb')) {
      currentMode = 'color';
      currentColor = value;
    }
  }

  const handleModeChange = (newMode: ThemeOverrideMode) => {
    if (newMode === 'inherit') {
      onChange({ mode: 'inherit' });
    } else if (newMode === 'color') {
      onChange({ mode: 'color', color: currentColor });
    } else if (newMode === 'gradient') {
      onChange({ mode: 'gradient', gradient: currentGradient });
    } else if (newMode === 'image') {
      onChange({ mode: 'image', image: currentImage });
    }
  };

  const handleColorChange = (newColor: string) => {
    onChange({
      mode: 'color',
      color: newColor,
    });
  };

  const handleGradientChange = (partial: Partial<typeof currentGradient>) => {
    onChange({
      mode: 'gradient',
      gradient: { ...currentGradient, ...partial },
    });
  };

  const handleImageChange = (partial: Partial<typeof currentImage>) => {
    onChange({
      mode: 'image',
      image: { ...currentImage, ...partial },
    });
  };

  const handleResetToInherit = () => {
    onChange({ mode: 'inherit' });
  };

  const isOverridden = currentMode !== 'inherit';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '10px 12px',
      backgroundColor: isOverridden ? '#fffbeb' : '#fafbfc',
      border: isOverridden ? '1px solid #fef3c7' : '1px solid #e2e8f0',
      borderRadius: '8px',
      transition: 'all 0.15s ease',
    }}>
      {/* Header with Label and Source Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
          {label}
        </span>

        {/* Source Dropdown */}
        <select
          value={currentMode}
          onChange={(e) => handleModeChange(e.target.value as ThemeOverrideMode)}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: currentMode === 'inherit' ? '#2563eb' : '#b45309',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="inherit">Inherit</option>
          <option value="color">Color</option>
          {isBackground && <option value="gradient">Gradient</option>}
          {isBackground && <option value="image">Image</option>}
        </select>
      </div>

      {/* 1. INHERIT VIEW */}
      {currentMode === 'inherit' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 8px',
          backgroundColor: '#eff6ff',
          borderRadius: '6px',
          border: '1px dashed #bfdbfe',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: '11px', color: '#1e40af' }}>
              Following <strong>{tokenInfo.name}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
              {tokenInfo.color}
            </span>
            <div
              title={tokenInfo.color}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: tokenInfo.color,
                border: '1px solid rgba(0,0,0,0.15)',
                flexShrink: 0,
              }}
            />
          </div>
        </div>
      )}

      {/* 2. COLOR OVERRIDE VIEW */}
      {currentMode === 'color' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#b45309', fontWeight: 500 }}>
              Local Override
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div 
                title="Click to choose color"
                style={{
                  position: 'relative',
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  backgroundColor: currentColor || '#2563eb',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <input
                  type="color"
                  value={currentColor && currentColor.startsWith('#') ? currentColor : '#2563eb'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
              </div>
              <input
                type="text"
                value={currentColor || ''}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#000000"
                style={{
                  width: '78px',
                  padding: '4px 6px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  textAlign: 'center',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleResetToInherit}
            title="Reset this property to inherit from global theme"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 500,
              color: '#475569',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#2563eb';
              e.currentTarget.style.borderColor = '#93c5fd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <RotateCcw size={11} />
            Reset to Inherit
          </button>
        </div>
      )}

      {/* 3. GRADIENT OVERRIDE VIEW */}
      {currentMode === 'gradient' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Gradient preview swatch */}
          <div style={{
            height: '24px',
            borderRadius: '4px',
            background: currentGradient.type === 'radial'
              ? `radial-gradient(circle, ${currentGradient.color1}, ${currentGradient.color2})`
              : `linear-gradient(${currentGradient.angle}, ${currentGradient.color1}, ${currentGradient.color2})`,
            border: '1px solid #cbd5e1',
          }} />

          {/* Type & Angle */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={currentGradient.type}
              onChange={(e) => handleGradientChange({ type: e.target.value as any })}
              style={{ flex: 1, padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>

            {currentGradient.type === 'linear' && (
              <select
                value={currentGradient.angle}
                onChange={(e) => handleGradientChange({ angle: e.target.value })}
                style={{ flex: 1, padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value="90deg">Horizontal (90°)</option>
                <option value="180deg">Vertical (180°)</option>
                <option value="135deg">Diagonal (135°)</option>
                <option value="45deg">Diagonal (45°)</option>
              </select>
            )}
          </div>

          {/* Color 1 & Color 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div 
                title="Click to choose color"
                style={{
                  position: 'relative',
                  width: '22px',
                  height: '22px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentGradient.color1 || '#2563eb',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <input
                  type="color"
                  value={currentGradient.color1.startsWith('#') ? currentGradient.color1 : '#2563eb'}
                  onChange={(e) => handleGradientChange({ color1: e.target.value })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </div>
              <span style={{ fontSize: '11px', color: '#475569' }}>Color 1</span>
            </div>
            <input
              type="text"
              value={currentGradient.color1}
              onChange={(e) => handleGradientChange({ color1: e.target.value })}
              style={{ width: '68px', padding: '3px 5px', fontSize: '11px', fontFamily: 'monospace', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div 
                title="Click to choose color"
                style={{
                  position: 'relative',
                  width: '22px',
                  height: '22px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentGradient.color2 || '#4f46e5',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <input
                  type="color"
                  value={currentGradient.color2.startsWith('#') ? currentGradient.color2 : '#4f46e5'}
                  onChange={(e) => handleGradientChange({ color2: e.target.value })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </div>
              <span style={{ fontSize: '11px', color: '#475569' }}>Color 2</span>
            </div>
            <input
              type="text"
              value={currentGradient.color2}
              onChange={(e) => handleGradientChange({ color2: e.target.value })}
              style={{ width: '68px', padding: '3px 5px', fontSize: '11px', fontFamily: 'monospace', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center' }}
            />
          </div>

          <button
            onClick={handleResetToInherit}
            title="Reset this property to inherit from global theme"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 500,
              color: '#475569',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <RotateCcw size={11} />
            Reset to Inherit
          </button>
        </div>
      )}

      {/* 4. IMAGE OVERRIDE VIEW */}
      {currentMode === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#475569' }}>Image URL</label>
            <input
              type="text"
              value={currentImage.url}
              onChange={(e) => handleImageChange({ url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '6px 8px',
                fontSize: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
              }}
            />
          </div>

          {/* Quick placeholder buttons */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleImageChange({ url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop' })}
              style={{ padding: '3px 6px', fontSize: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', cursor: 'pointer' }}
            >
              Gradient Texture
            </button>
            <button
              onClick={() => handleImageChange({ url: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1200&h=800&fit=crop' })}
              style={{ padding: '3px 6px', fontSize: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', cursor: 'pointer' }}
            >
              Minimal Desk
            </button>
          </div>

          {/* Position & Size */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={currentImage.position}
              onChange={(e) => handleImageChange({ position: e.target.value })}
              style={{ flex: 1, padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            >
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
            <select
              value={currentImage.size}
              onChange={(e) => handleImageChange({ size: e.target.value })}
              style={{ flex: 1, padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>

          <button
            onClick={handleResetToInherit}
            title="Reset this property to inherit from global theme"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 500,
              color: '#475569',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <RotateCcw size={11} />
            Reset to Inherit
          </button>
        </div>
      )}
    </div>
  );
};
