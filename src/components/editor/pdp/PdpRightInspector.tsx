// ============================================================
// PDP BUILDER — STREAMLINED VERTICAL RIGHT INSPECTOR
// All editing options displayed continuously in the same vertical flow
// without separating outlines, boxed cards, or divider lines.
// Top bar displays ONLY the selected item name with close button on the left.
// Provides high-visibility labels, inputs, and comprehensive customizations.
// ============================================================

import React from 'react';
import {
  ChevronRight,
  RotateCcw,
  Copy,
  Trash2,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { usePdpStore } from './pdpStore';
import { useLandingEditorStore } from '../../../store/landingEditorStore';
import { PDP_BLOCK_DEFINITIONS, isProductInfoBlock, getPdpBlockDisplayName } from './pdpBlockRegistry';
import { PdpIcon } from './pdpIcons';
import styles from '../../../pages/editor/EditorLayout.module.css';

export const PdpRightInspector: React.FC = () => {
  const {
    selectedBlockId,
    getSelectedBlock,
    updateBlockContent,
    updateBlockDesign,
    updateBlockVisibility,
    getActiveTemplate,
    updateTemplateSettings,
    resetBlockStyles,
    removeBlock,
    duplicateBlock,
    selectBlock,
    openComponentLibrary,
    updateBlockName,
  } = usePdpStore();

  const activeTemplate = getActiveTemplate();

  const closeInspector = () => {
    selectBlock(null);
    useLandingEditorStore.getState().setRightSidebarOpen(false);
  };

  // ══════════════════════════════════════════════════════════════
  // CASE 1: "PRODUCT SECTION" INSPECTOR
  // ══════════════════════════════════════════════════════════════
  if (selectedBlockId === 'section-product-info') {
    const infoBlocks = activeTemplate.blocks.filter(b => isProductInfoBlock(b));
    const mediaLayout = activeTemplate.desktopMediaLayout || 'thumbnails-bottom';
    const mobileLayout = activeTemplate.mobileMediaLayout || 'carousel';
    const zoomMode = activeTemplate.imageZoom || 'lightbox';
    const mediaPosition = activeTemplate.layout === 'gallery-right' ? 'gallery-right' : activeTemplate.layout === 'stacked' ? 'stacked' : 'gallery-left';
    const isSticky = activeTemplate.stickyBuyBox !== false;
    const columnRatio = activeTemplate.columnRatio || '50-50';
    const columnGap = activeTemplate.columnGap || '40px';
    const detailsCardStyle = activeTemplate.detailsCardStyle || 'flat';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
        {/* ── Top Header: Close on Left, ONLY Selected Item Name on Top ── */}
        <div className={styles.panelHeader}>
          <div className={styles.phLeft}>
            <button
              className={styles.iconBtn}
              onClick={closeInspector}
              title="Close Section Settings"
            >
              <ChevronRight size={20} className={styles.backIcon} />
            </button>
            <h3 className={styles.fw600} style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>
              Product Section
            </h3>
          </div>
        </div>

        {/* ── Continuous Vertical Stream (No Boxed Outlines, No Separating Divider Lines) ── */}
        <div className={styles.propContent} style={{ padding: '20px 18px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* 1. Image Position */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Image Position</span>
              <div style={segmentedContainerStyle}>
                {(['gallery-left', 'gallery-right', 'stacked'] as const).map((pos) => {
                  const label = pos === 'gallery-left' ? 'Left' : pos === 'gallery-right' ? 'Right' : 'Full Width';
                  const isActive = mediaPosition === pos;
                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => updateTemplateSettings(activeTemplate.id, { layout: pos })}
                      style={getSegmentedButtonStyle(isActive)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Desktop Gallery Style */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Desktop Gallery Style</span>
              <select
                className={styles.inputField}
                value={mediaLayout}
                onChange={(e) => updateTemplateSettings(activeTemplate.id, { desktopMediaLayout: e.target.value as any })}
                style={selectInputStyle}
              >
                <option value="thumbnails-bottom">Thumbnails Bottom</option>
                <option value="thumbnails-left">Thumbnails Left</option>
                <option value="grid-2col">2-Column Grid</option>
                <option value="carousel">Full Carousel Slider</option>
              </select>
            </div>

            {/* 3. Desktop Column Width Ratio */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Desktop Column Width (Media / Details)</span>
              <div style={segmentedContainerStyle}>
                {[
                  { label: '50 / 50', val: '50-50' },
                  { label: '55 / 45', val: '55-45' },
                  { label: '60 / 40', val: '60-40' },
                  { label: '45 / 55', val: '45-55' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => updateTemplateSettings(activeTemplate.id, { columnRatio: item.val as any })}
                    style={getSegmentedButtonStyle(columnRatio === item.val)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Column Spacing Gap */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Column Spacing Gap</span>
              <div style={segmentedContainerStyle}>
                {['24px', '32px', '40px', '48px'].map((gapVal) => (
                  <button
                    key={gapVal}
                    type="button"
                    onClick={() => updateTemplateSettings(activeTemplate.id, { columnGap: gapVal as any })}
                    style={getSegmentedButtonStyle(columnGap === gapVal)}
                  >
                    {gapVal}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Image Zoom Interaction */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Image Zoom Interaction</span>
              <select
                className={styles.inputField}
                value={zoomMode}
                onChange={(e) => updateTemplateSettings(activeTemplate.id, { imageZoom: e.target.value as any })}
                style={selectInputStyle}
              >
                <option value="lightbox">Open Lightbox Popup</option>
                <option value="hover">Hover Zoom Lens</option>
                <option value="none">No Zoom</option>
              </select>
            </div>

            {/* 6. Sticky Buy Box on Desktop */}
            <div
              style={toggleRowStyle}
              onClick={() => updateTemplateSettings(activeTemplate.id, { stickyBuyBox: !isSticky })}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                  Sticky details on desktop
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                  Docks details while scrolling long gallery imagery
                </div>
              </div>
              <input
                type="checkbox"
                checked={isSticky}
                readOnly
                style={checkboxStyle}
              />
            </div>

            {/* 7. Mobile Gallery Layout */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Mobile Gallery Layout</span>
              <div style={segmentedContainerStyle}>
                {[
                  { label: 'Carousel Slider', val: 'carousel' },
                  { label: 'Stacked Images', val: 'stacked' },
                ].map((m) => (
                  <button
                    key={m.val}
                    type="button"
                    onClick={() => updateTemplateSettings(activeTemplate.id, { mobileMediaLayout: m.val as any })}
                    style={getSegmentedButtonStyle(mobileLayout === m.val)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 8. Details Panel Background Style */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Details Panel Styling</span>
              <div style={segmentedContainerStyle}>
                {[
                  { label: 'Flat Clean', val: 'flat' },
                  { label: 'Card Box', val: 'card' },
                  { label: 'Soft Tinted', val: 'tinted' },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => updateTemplateSettings(activeTemplate.id, { detailsCardStyle: s.val as any })}
                    style={getSegmentedButtonStyle(detailsCardStyle === s.val)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 9. Action: Add Block to Product Information */}
            <div style={{ paddingTop: '8px' }}>
              <button
                onClick={() => openComponentLibrary('inside', 'section-product-info', 'block')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #2563eb',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dbeafe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#eff6ff';
                }}
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Add block to Product Section</span>
              </button>
            </div>

            {/* 10. List of Blocks in Product Section for quick navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={labelStyle}>Blocks in Product Section ({infoBlocks.length})</span>
                <button
                  type="button"
                  onClick={() => openComponentLibrary('inside', 'section-product-info', 'block')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <Plus size={13} />
                  <span>Add block</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '340px', overflowY: 'auto' }}>
                {infoBlocks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => selectBlock(b.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <PdpIcon name={PDP_BLOCK_DEFINITIONS[b.type]?.iconName || 'Box'} size={15} color="#475569" />
                      <span style={{ fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {getPdpBlockDisplayName(b)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openComponentLibrary('below', b.id, 'block');
                        }}
                        title="Insert block below"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '3px',
                          borderRadius: '4px',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                      >
                        <Plus size={13} />
                      </button>
                      <ChevronRight size={14} color="#94a3b8" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // CASE 2: REGULAR BLOCK & SECTION INSPECTOR
  // All options in same vertical stream, no separating outlines,
  // top bar displays ONLY selected item name.
  // ══════════════════════════════════════════════════════════════
  const block = getSelectedBlock();

  if (!block) {
    return null;
  }

  // ══════════════════════════════════════════════════════════════
  // CASE 2: "GROUP" CONTAINER INSPECTOR
  // ══════════════════════════════════════════════════════════════
  if (block.type === 'group') {
    const children = block.children || [];
    const c = block.content || {};
    const d = block.design || {};
    const isHorizontal = c.direction === 'horizontal' || c.direction === 'row';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
        {/* ── Top Header ── */}
        <div className={styles.panelHeader}>
          <div className={styles.phLeft}>
            <button
              className={styles.iconBtn}
              onClick={closeInspector}
              title="Close Inspector"
            >
              <ChevronRight size={20} className={styles.backIcon} />
            </button>
            <h3 className={styles.fw600} style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>
              {block.name || 'Group Container'}
            </h3>
          </div>
        </div>

        {/* ── Vertical Stream of Group Settings ── */}
        <div className={styles.propContent} style={{ padding: '20px 18px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* 1. Group Label / Name */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Group Name</span>
              <input
                type="text"
                className={styles.inputField}
                value={block.name || ''}
                onChange={(e) => updateBlockName(block.id, e.target.value)}
                placeholder="e.g. Action Buttons, Key Highlights"
                style={inputStyle}
              />
            </div>

            {/* 2. Layout Direction */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Layout Direction</span>
              <div style={segmentedContainerStyle}>
                <button
                  type="button"
                  onClick={() => updateBlockContent(block.id, { direction: 'vertical' })}
                  style={getSegmentedButtonStyle(!isHorizontal)}
                >
                  Vertical (Column)
                </button>
                <button
                  type="button"
                  onClick={() => updateBlockContent(block.id, { direction: 'horizontal' })}
                  style={getSegmentedButtonStyle(isHorizontal)}
                >
                  Horizontal (Row)
                </button>
              </div>
            </div>

            {/* 3. Responsive Stacking on Mobile */}
            <div
              style={toggleRowStyle}
              onClick={() => updateBlockContent(block.id, { stackOnMobile: c.stackOnMobile === false ? true : false })}
            >
              <div>
                <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>
                  Stack on Mobile
                </span>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
                  Auto-convert row to column on phone screens
                </div>
              </div>
              <input
                type="checkbox"
                checked={c.stackOnMobile !== false}
                readOnly
                style={checkboxStyle}
              />
            </div>

            {/* 4. Flex Wrap */}
            <div
              style={toggleRowStyle}
              onClick={() => updateBlockContent(block.id, { wrap: c.wrap === false ? true : false })}
            >
              <div>
                <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>
                  Wrap Items
                </span>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
                  Wrap onto next line if content exceeds width
                </div>
              </div>
              <input
                type="checkbox"
                checked={c.wrap !== false}
                readOnly
                style={checkboxStyle}
              />
            </div>

            {/* 5. Item Gap */}
            <div style={fieldGroupStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={labelStyle}>Gap Between Items</span>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                  {c.gap ?? d.gap ?? 12}px
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={48}
                step={4}
                value={c.gap ?? d.gap ?? 12}
                onChange={(e) => updateBlockContent(block.id, { gap: parseInt(e.target.value, 10) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* 6. Align Items & Justify Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={fieldGroupStyle}>
                <span style={labelStyle}>Cross-Axis Align</span>
                <select
                  className={styles.inputField}
                  value={c.alignItems || (isHorizontal ? 'center' : 'stretch')}
                  onChange={(e) => updateBlockContent(block.id, { alignItems: e.target.value })}
                  style={selectInputStyle}
                >
                  <option value="stretch">Stretch</option>
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                </select>
              </div>

              <div style={fieldGroupStyle}>
                <span style={labelStyle}>Main-Axis Justify</span>
                <select
                  className={styles.inputField}
                  value={c.justifyContent || 'flex-start'}
                  onChange={(e) => updateBlockContent(block.id, { justifyContent: e.target.value })}
                  style={selectInputStyle}
                >
                  <option value="flex-start">Start (Left)</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End (Right)</option>
                  <option value="space-between">Space Between</option>
                  <option value="space-around">Space Around</option>
                </select>
              </div>
            </div>

            {/* 7. Padding (Vertical & Horizontal) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={fieldGroupStyle}>
                <span style={labelStyle}>Vertical Padding</span>
                <input
                  type="number"
                  min={0}
                  max={60}
                  step={4}
                  className={styles.inputField}
                  value={c.paddingTop ?? d.padding?.top ?? 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    updateBlockContent(block.id, { paddingTop: val, paddingBottom: val });
                  }}
                  style={inputStyle}
                />
              </div>
              <div style={fieldGroupStyle}>
                <span style={labelStyle}>Horizontal Padding</span>
                <input
                  type="number"
                  min={0}
                  max={60}
                  step={4}
                  className={styles.inputField}
                  value={c.paddingLeft ?? d.padding?.left ?? 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    updateBlockContent(block.id, { paddingLeft: val, paddingRight: val });
                  }}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 8. Background Color */}
            <div style={fieldGroupStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={labelStyle}>Container Background</span>
                {c.backgroundColor && c.backgroundColor !== 'transparent' && (
                  <button
                    type="button"
                    onClick={() => updateBlockContent(block.id, { backgroundColor: 'transparent' })}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Set Transparent
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={c.backgroundColor && c.backgroundColor !== 'transparent' ? c.backgroundColor : '#ffffff'}
                  onChange={(e) => updateBlockContent(block.id, { backgroundColor: e.target.value })}
                  style={colorSwatchStyle}
                />
                <input
                  type="text"
                  className={styles.inputField}
                  value={c.backgroundColor || 'transparent'}
                  onChange={(e) => updateBlockContent(block.id, { backgroundColor: e.target.value })}
                  style={{ ...inputStyle, width: '120px', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* 9. Border & Radius */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={fieldGroupStyle}>
                <span style={labelStyle}>Border Style</span>
                <select
                  className={styles.inputField}
                  value={c.borderStyle || 'none'}
                  onChange={(e) => updateBlockContent(block.id, { borderStyle: e.target.value })}
                  style={selectInputStyle}
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                </select>
              </div>

              <div style={fieldGroupStyle}>
                <span style={labelStyle}>Corner Radius (px)</span>
                <input
                  type="number"
                  min={0}
                  max={32}
                  step={2}
                  className={styles.inputField}
                  value={c.borderRadius ?? d.borderRadius ?? 8}
                  onChange={(e) => updateBlockContent(block.id, { borderRadius: parseInt(e.target.value, 10) || 0 })}
                  style={inputStyle}
                />
              </div>
            </div>

            {c.borderStyle && c.borderStyle !== 'none' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={fieldGroupStyle}>
                  <span style={labelStyle}>Border Width</span>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    step={1}
                    className={styles.inputField}
                    value={c.borderWidth ?? 1}
                    onChange={(e) => updateBlockContent(block.id, { borderWidth: parseInt(e.target.value, 10) || 1 })}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldGroupStyle}>
                  <span style={labelStyle}>Border Color</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={c.borderColor || '#e2e8f0'}
                      onChange={(e) => updateBlockContent(block.id, { borderColor: e.target.value })}
                      style={colorSwatchStyle}
                    />
                    <input
                      type="text"
                      className={styles.inputField}
                      value={c.borderColor || '#e2e8f0'}
                      onChange={(e) => updateBlockContent(block.id, { borderColor: e.target.value })}
                      style={{ ...inputStyle, width: '90px', fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 10. Container Shadow */}
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Shadow</span>
              <div style={segmentedContainerStyle}>
                {(['none', 'subtle', 'soft', 'elevated'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateBlockContent(block.id, { boxShadow: s })}
                    style={getSegmentedButtonStyle((c.boxShadow || 'none') === s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* 11. Child Blocks in Group & Quick Add */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={labelStyle}>Child Blocks in this Group ({children.length})</span>
                <button
                  type="button"
                  onClick={() => openComponentLibrary('inside', block.id, block.zone === 'buy_box' ? 'block' : 'all')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={13} />
                  <span>Add block</span>
                </button>
              </div>

              {children.length === 0 ? (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#64748b',
                  }}
                >
                  No blocks inside this group yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {children.map((child) => (
                    <div
                      key={child.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        fontSize: '12.5px',
                        fontWeight: 500,
                        color: '#1e293b',
                      }}
                    >
                      <span
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => selectBlock(child.id)}
                      >
                        {child.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeBlock(child.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                        title="Remove from group"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => openComponentLibrary('inside', block.id, block.zone === 'buy_box' ? 'block' : 'all')}
                style={{
                  marginTop: '6px',
                  width: '100%',
                  padding: '9px',
                  borderRadius: '6px',
                  border: '1px dashed #2563eb',
                  background: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>+ Add block into this Group</span>
              </button>
            </div>

            {/* 12. Actions: Duplicate & Delete Group */}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => duplicateBlock(block.id)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Duplicate Group
              </button>
              <button
                type="button"
                onClick={() => {
                  removeBlock(block.id);
                  closeInspector();
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  background: '#fee2e2',
                  color: '#dc2626',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete Group
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // CASE 3: REGULAR BLOCK & SECTION INSPECTOR
  // All options in same vertical stream, no separating outlines,
  // top bar displays ONLY selected item name.
  // ══════════════════════════════════════════════════════════════
  const def = PDP_BLOCK_DEFINITIONS[block.type];
  const selectedItemName = getPdpBlockDisplayName(block);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* ── Top Header: Close on Left, ONLY Selected Item Name on Top ── */}
      <div className={styles.panelHeader}>
        <div className={styles.phLeft}>
          <button
            className={styles.iconBtn}
            onClick={closeInspector}
            title="Close Inspector"
          >
            <ChevronRight size={20} className={styles.backIcon} />
          </button>
          <h3 className={styles.fw600} style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>
            {selectedItemName}
          </h3>
        </div>
      </div>

      {/* ── All Editing Options in the Same Vertical Flow (No Outlines / Box Dividers) ── */}
      <div className={styles.propContent} style={{ padding: '20px 18px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* ── PART A: CONTENT & COMPONENT CUSTOMIZATION OPTIONS ── */}
          {def?.contentFields.map((field) => {
            if (field.showWhen) {
              const triggerVal = block.content[field.showWhen.field];
              if ('valueIn' in field.showWhen && Array.isArray(field.showWhen.valueIn)) {
                if (!field.showWhen.valueIn.includes(triggerVal)) return null;
              } else if ('value' in field.showWhen) {
                if (triggerVal !== field.showWhen.value) return null;
              }
            }

            const value = block.content[field.key] !== undefined ? block.content[field.key] : field.defaultValue;

            return (
              <div key={field.key} style={fieldGroupStyle}>
                {field.type !== 'toggle' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={labelStyle}>{field.label}</span>
                    {field.unit && <span style={{ fontSize: '11px', color: '#64748b' }}>{field.unit}</span>}
                  </div>
                )}

                {field.type === 'text' && (
                  <input
                    type="text"
                    className={styles.inputField}
                    value={value ?? ''}
                    onChange={(e) => updateBlockContent(block.id, { [field.key]: e.target.value })}
                    style={inputStyle}
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    className={styles.inputField}
                    rows={3}
                    value={value ?? ''}
                    onChange={(e) => updateBlockContent(block.id, { [field.key]: e.target.value })}
                    style={{ ...inputStyle, height: 'auto', padding: '10px 12px' }}
                  />
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    className={styles.inputField}
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                    value={value ?? ''}
                    onChange={(e) => updateBlockContent(block.id, { [field.key]: parseFloat(e.target.value) || 0 })}
                    style={inputStyle}
                  />
                )}

                {field.type === 'select' && (
                  <select
                    className={styles.inputField}
                    value={value ?? ''}
                    onChange={(e) => updateBlockContent(block.id, { [field.key]: e.target.value })}
                    style={selectInputStyle}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'segmented' && (
                  <div style={segmentedContainerStyle}>
                    {field.options?.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateBlockContent(block.id, { [field.key]: opt.value })}
                        style={getSegmentedButtonStyle(value === opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {field.type === 'color' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={value || '#000000'}
                      onChange={(e) => updateBlockContent(block.id, { [field.key]: e.target.value })}
                      style={colorSwatchStyle}
                    />
                    <input
                      type="text"
                      className={styles.inputField}
                      value={value || ''}
                      onChange={(e) => updateBlockContent(block.id, { [field.key]: e.target.value })}
                      style={{ ...inputStyle, width: '120px', fontFamily: 'monospace' }}
                    />
                  </div>
                )}

                {field.type === 'toggle' && (
                  <div
                    style={toggleRowStyle}
                    onClick={() => updateBlockContent(block.id, { [field.key]: !value })}
                  >
                    <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>
                      {field.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!value}
                      readOnly
                      style={checkboxStyle}
                    />
                  </div>
                )}

                {field.helpText && (
                  <span style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.3 }}>
                    {field.helpText}
                  </span>
                )}
              </div>
            );
          })}

          {/* ── PART B: VISUAL STYLING IN SAME VERTICAL FLOW ── */}
          {/* Colors: Text & Background */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Text Color</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="color"
                  value={block.design.textColor || '#0f172a'}
                  onChange={(e) => updateBlockDesign(block.id, { textColor: e.target.value })}
                  style={colorSwatchStyle}
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="#0f172a"
                  value={block.design.textColor || ''}
                  onChange={(e) => updateBlockDesign(block.id, { textColor: e.target.value })}
                  style={{ ...inputStyle, fontSize: '12px', padding: '6px 8px', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Background</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="color"
                  value={block.design.bgColor || '#ffffff'}
                  onChange={(e) => updateBlockDesign(block.id, { bgColor: e.target.value })}
                  style={colorSwatchStyle}
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Transparent"
                  value={block.design.bgColor || ''}
                  onChange={(e) => updateBlockDesign(block.id, { bgColor: e.target.value })}
                  style={{ ...inputStyle, fontSize: '12px', padding: '6px 8px', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>

          {/* Typography: Font Size & Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Font Size (px)</span>
              <input
                type="number"
                className={styles.inputField}
                min={10}
                max={72}
                value={block.design.fontSize || ''}
                placeholder="Default"
                onChange={(e) => updateBlockDesign(block.id, { fontSize: parseInt(e.target.value) || undefined })}
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Font Weight</span>
              <select
                className={styles.inputField}
                value={block.design.fontWeight || 'normal'}
                onChange={(e) => updateBlockDesign(block.id, { fontWeight: e.target.value })}
                style={selectInputStyle}
              >
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
          </div>

          {/* Spacing & Border Radius */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Vertical Spacing (px)</span>
              <input
                type="number"
                className={styles.inputField}
                min={0}
                max={120}
                value={block.design.padding?.top ?? 0}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  updateBlockDesign(block.id, {
                    padding: { ...block.design.padding, top: v, bottom: v, left: 0, right: 0 }
                  });
                }}
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <span style={labelStyle}>Corner Radius (px)</span>
              <input
                type="number"
                className={styles.inputField}
                min={0}
                max={48}
                value={typeof block.design.borderRadius === 'number' ? block.design.borderRadius : 0}
                onChange={(e) => updateBlockDesign(block.id, { borderRadius: parseInt(e.target.value) || 0 })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Alignment Controls */}
          <div style={fieldGroupStyle}>
            <span style={labelStyle}>Text Alignment</span>
            <div style={segmentedContainerStyle}>
              <button
                type="button"
                onClick={() => updateBlockDesign(block.id, { textAlign: 'left' } as any)}
                style={getSegmentedButtonStyle(block.design.textAlign === 'left' || !block.design.textAlign)}
                title="Align Left"
              >
                <AlignLeft size={14} style={{ display: 'inline', margin: '0 auto' }} />
              </button>
              <button
                type="button"
                onClick={() => updateBlockDesign(block.id, { textAlign: 'center' } as any)}
                style={getSegmentedButtonStyle(block.design.textAlign === 'center')}
                title="Align Center"
              >
                <AlignCenter size={14} style={{ display: 'inline', margin: '0 auto' }} />
              </button>
              <button
                type="button"
                onClick={() => updateBlockDesign(block.id, { textAlign: 'right' } as any)}
                style={getSegmentedButtonStyle(block.design.textAlign === 'right')}
                title="Align Right"
              >
                <AlignRight size={14} style={{ display: 'inline', margin: '0 auto' }} />
              </button>
            </div>
          </div>

          {/* Reset Styles Button */}
          <button
            onClick={() => resetBlockStyles(block.id)}
            style={{
              padding: '8px 12px',
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          >
            <RotateCcw size={13} />
            <span>Reset Styles to Default</span>
          </button>

          {/* ── PART C: VISIBILITY RULES IN SAME VERTICAL FLOW ── */}
          {/* Smart Empty-State Rule */}
          <div
            style={toggleRowStyle}
            onClick={() => updateBlockVisibility(block.id, { hideIfEmpty: !block.visibility.hideIfEmpty })}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                Hide when content is empty
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                Prevents blank containers or empty spacing if product has no data
              </div>
            </div>
            <input
              type="checkbox"
              checked={block.visibility.hideIfEmpty}
              readOnly
              style={checkboxStyle}
            />
          </div>

          {/* Device Visibility */}
          <div style={fieldGroupStyle}>
            <span style={labelStyle}>Device Visibility</span>

            <div
              style={toggleRowStyle}
              onClick={() => updateBlockVisibility(block.id, { desktop: !block.visibility.desktop })}
            >
              <span style={{ fontSize: '13px', color: '#1e293b' }}>Show on Desktop</span>
              <input
                type="checkbox"
                checked={block.visibility.desktop}
                readOnly
                style={checkboxStyle}
              />
            </div>

            <div
              style={toggleRowStyle}
              onClick={() => updateBlockVisibility(block.id, { tablet: !block.visibility.tablet })}
            >
              <span style={{ fontSize: '13px', color: '#1e293b' }}>Show on Tablet</span>
              <input
                type="checkbox"
                checked={block.visibility.tablet}
                readOnly
                style={checkboxStyle}
              />
            </div>

            <div
              style={toggleRowStyle}
              onClick={() => updateBlockVisibility(block.id, { mobile: !block.visibility.mobile })}
            >
              <span style={{ fontSize: '13px', color: '#1e293b' }}>Show on Mobile</span>
              <input
                type="checkbox"
                checked={block.visibility.mobile}
                readOnly
                style={checkboxStyle}
              />
            </div>
          </div>

          {/* ── PART D: ACTIONS (DUPLICATE & DELETE) AT BOTTOM OF FLOW ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', paddingBottom: '16px' }}>
            <button
              onClick={() => duplicateBlock(block.id)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#94a3b8';
                e.currentTarget.style.background = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              <Copy size={14} />
              <span>Duplicate Block</span>
            </button>

            <button
              onClick={() => removeBlock(block.id)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: 'none',
                background: '#fee2e2',
                color: '#dc2626',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fecaca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fee2e2';
              }}
            >
              <Trash2 size={14} />
              <span>Delete Block</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ── Common Styling Helpers for Unified Vertical Inspector ──
const fieldGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#1e293b',
  lineHeight: 1.3,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '38px',
  padding: '8px 12px',
  fontSize: '13.5px',
  color: '#0f172a',
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  boxSizing: 'border-box',
};

const selectInputStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

const segmentedContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  background: '#f1f5f9',
  padding: '3px',
  borderRadius: '6px',
};

const getSegmentedButtonStyle = (isActive: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '6px 8px',
  fontSize: '12px',
  fontWeight: isActive ? 600 : 500,
  borderRadius: '4px',
  border: 'none',
  background: isActive ? '#ffffff' : 'transparent',
  color: isActive ? '#2563eb' : '#64748b',
  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
  cursor: 'pointer',
  transition: 'all 0.12s ease',
  textAlign: 'center',
});

const toggleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 0',
  cursor: 'pointer',
};

const checkboxStyle: React.CSSProperties = {
  cursor: 'pointer',
  accentColor: '#2563eb',
  width: '18px',
  height: '18px',
};

const colorSwatchStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  padding: 0,
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  cursor: 'pointer',
};
