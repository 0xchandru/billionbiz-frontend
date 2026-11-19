// ============================================================
// PDP BUILDER — COMPONENT LIBRARY MODAL (SHOPIFY ARCHITECTURE)
// Minimal, centered modal dialog with blurred backdrop over topbar
// Filter by Blocks (Product information) or Sections (Page sections)
// Minimal cards: Name, category tag, block/section badge, small preview icon, and quick add
// ============================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Search,
  Plus,
} from 'lucide-react';
import { usePdpStore } from './pdpStore';
import {
  PDP_CATEGORIES,
  PDP_BLOCK_DEFINITIONS,
  getDefaultZoneForType,
} from './pdpBlockRegistry';
import type { PdpBlockType } from './types/pdpBlockTypes';
import { PdpIcon } from './pdpIcons';

export const PdpComponentLibraryModal: React.FC = () => {
  const {
    isComponentLibraryOpen,
    closeComponentLibrary,
    addBlock,
    insertPosition,
    insertTargetBlockId,
    getActiveTemplate,
    getSelectedBlock,
    libraryMode,
  } = usePdpStore();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'block' | 'section'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [placementOption, setPlacementOption] = useState<'bottom' | 'above' | 'below' | 'inside'>(insertPosition);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeTemplate = getActiveTemplate();
  const selectedBlock = getSelectedBlock();

  // Synchronize initial filter scope and placement when opened
  useEffect(() => {
    if (isComponentLibraryOpen) {
      if (libraryMode === 'block') setScopeFilter('block');
      else if (libraryMode === 'section') setScopeFilter('section');
      else setScopeFilter('all');
      setActiveCategory('All');
      setSearchQuery('');
      setPlacementOption(insertPosition);
    }
  }, [isComponentLibraryOpen, libraryMode, insertPosition]);

  // Lock body scroll and handle keyboard shortcuts (Esc)
  useEffect(() => {
    if (!isComponentLibraryOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeComponentLibrary();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isComponentLibraryOpen, closeComponentLibrary]);

  const allBlockDefs = useMemo(() => {
    return Object.values(PDP_BLOCK_DEFINITIONS);
  }, []);

  // Filtered components based on search, category, and scope (block vs section)
  const filteredBlocks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allBlockDefs.filter((block) => {
      const defaultZone = getDefaultZoneForType(block.type);
      const isInfoBlock = defaultZone === 'buy_box' || defaultZone === 'media';
      const isSection = defaultZone === 'full_width';

      // Scope filter: block vs section
      if (scopeFilter === 'block' && !isInfoBlock) return false;
      if (scopeFilter === 'section' && !isSection) return false;

      // Category filter
      const matchesCategory =
        activeCategory === 'All' || block.category === activeCategory;
      if (!matchesCategory) return false;

      // Search query filter
      if (!query) return true;

      const inName = block.name.toLowerCase().includes(query);
      const inDesc = block.description.toLowerCase().includes(query);
      const inCat = block.category.toLowerCase().includes(query);
      const inType = block.type.toLowerCase().includes(query);

      return inName || inDesc || inCat || inType;
    });
  }, [allBlockDefs, scopeFilter, activeCategory, searchQuery]);

  // Dynamic Category counts based on current scopeFilter
  const categoryCounts = useMemo(() => {
    const scopedDefs = allBlockDefs.filter((b) => {
      const defaultZone = getDefaultZoneForType(b.type);
      const isInfoBlock = defaultZone === 'buy_box' || defaultZone === 'media';
      const isSection = defaultZone === 'full_width';
      if (scopeFilter === 'block') return isInfoBlock;
      if (scopeFilter === 'section') return isSection;
      return true;
    });

    const counts: Record<string, number> = { All: scopedDefs.length };
    scopedDefs.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, [allBlockDefs, scopeFilter]);

  // Categories list
  const categoryItems = useMemo(() => {
    return [
      { id: 'All', name: 'All' },
      ...PDP_CATEGORIES.map(cat => ({
        id: cat.id,
        name: cat.name,
      })),
    ];
  }, []);

  if (!isComponentLibraryOpen) return null;

  const handleSelectBlock = (type: PdpBlockType) => {
    addBlock(type, placementOption, insertTargetBlockId || selectedBlock?.id);
    closeComponentLibrary();
  };

  const modalTitle =
    libraryMode === 'block'
      ? 'Add block to Product information'
      : libraryMode === 'section'
      ? 'Add Section'
      : 'Add Component';

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={closeComponentLibrary}
      role="dialog"
      aria-modal="true"
      aria-label={modalTitle}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          height: '680px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header ── */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            flexShrink: 0,
          }}
        >
          {/* Left Title & Template badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                  {modalTitle}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: '#f1f5f9',
                    color: '#475569',
                  }}
                >
                  {activeTemplate.name}
                </span>
              </div>
            </div>
          </div>

          {/* Right Insertion selector & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {selectedBlock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                <span style={{ fontWeight: 500 }}>Insert:</span>
                <select
                  value={placementOption}
                  onChange={(e) => setPlacementOption(e.target.value as any)}
                  style={{
                    height: '30px',
                    padding: '0 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="bottom">At the Bottom</option>
                  <option value="above">Above ({selectedBlock.name})</option>
                  <option value="below">Below ({selectedBlock.name})</option>
                  {selectedBlock.type === 'group' && (
                    <option value="inside">Inside ({selectedBlock.name})</option>
                  )}
                </select>
              </div>
            )}

            <button
              onClick={closeComponentLibrary}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#64748b';
              }}
              title="Close (Esc)"
            >
              <span style={{ fontSize: '10px', padding: '1px 4px', background: '#e2e8f0', borderRadius: '3px', fontWeight: 600 }}>ESC</span>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Search & Filter Controls Bar ── */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid #f1f5f9',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          {/* Top Row: Search Input + Scope Filter (All / Blocks / Sections) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search components (e.g. Gallery, Price, Reviews, FAQ, Ingredients)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '13px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#198754')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Scope Filter Segmented Pill: All / Blocks / Sections */}
            <div
              style={{
                display: 'flex',
                background: '#e2e8f0',
                padding: '3px',
                borderRadius: '8px',
                gap: '2px',
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => setScopeFilter('all')}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontWeight: scopeFilter === 'all' ? 600 : 500,
                  borderRadius: '6px',
                  border: 'none',
                  background: scopeFilter === 'all' ? '#ffffff' : 'transparent',
                  color: scopeFilter === 'all' ? '#0f172a' : '#64748b',
                  boxShadow: scopeFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                }}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter('block')}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontWeight: scopeFilter === 'block' ? 600 : 500,
                  borderRadius: '6px',
                  border: 'none',
                  background: scopeFilter === 'block' ? '#ffffff' : 'transparent',
                  color: scopeFilter === 'block' ? '#15803d' : '#64748b',
                  boxShadow: scopeFilter === 'block' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                }}
              >
                Blocks
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter('section')}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontWeight: scopeFilter === 'section' ? 600 : 500,
                  borderRadius: '6px',
                  border: 'none',
                  background: scopeFilter === 'section' ? '#ffffff' : 'transparent',
                  color: scopeFilter === 'section' ? '#1d4ed8' : '#64748b',
                  boxShadow: scopeFilter === 'section' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                }}
              >
                Sections
              </button>
            </div>
          </div>

          {/* Minimal Category Pills */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '2px',
              scrollbarWidth: 'none',
            }}
          >
            {categoryItems.map((cat) => {
              const isActive = activeCategory === cat.name;
              const count = categoryCounts[cat.name] || 0;
              if (cat.name !== 'All' && count === 0) return null;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: isActive ? '#198754' : '#e2e8f0',
                    background: isActive ? '#198754' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  <span>{cat.name}</span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      opacity: isActive ? 0.9 : 0.6,
                      fontWeight: 600,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Minimal Component Grid (Scrollable) ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            background: '#ffffff',
          }}
        >
          {filteredBlocks.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
              }}
            >
              {filteredBlocks.map((block) => {
                const defaultZone = getDefaultZoneForType(block.type);
                const isInfoBlock = defaultZone === 'buy_box' || defaultZone === 'media';

                return (
                  <div
                    key={block.type}
                    onClick={() => handleSelectBlock(block.type)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#198754';
                      e.currentTarget.style.boxShadow = '0 3px 10px rgba(25, 135, 84, 0.08)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      const addBtn = e.currentTarget.querySelector('.quick-add-btn') as HTMLElement;
                      if (addBtn) {
                        addBtn.style.background = '#198754';
                        addBtn.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'none';
                      const addBtn = e.currentTarget.querySelector('.quick-add-btn') as HTMLElement;
                      if (addBtn) {
                        addBtn.style.background = '#f1f5f9';
                        addBtn.style.color = '#334155';
                      }
                    }}
                    title={`Add ${block.name} to template`}
                  >
                    {/* Left: Icon square & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#198754',
                          flexShrink: 0,
                        }}
                      >
                        <PdpIcon name={block.iconName} size={18} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#0f172a',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.3,
                          }}
                        >
                          {block.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '2px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              background: isInfoBlock ? '#f0fdf4' : '#eff6ff',
                              color: isInfoBlock ? '#15803d' : '#1d4ed8',
                              fontWeight: 600,
                            }}
                          >
                            {isInfoBlock ? 'Block' : 'Section'}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#64748b',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {block.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Add Button */}
                    <div
                      className="quick-add-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        color: '#334155',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'all 0.15s ease',
                        flexShrink: 0,
                      }}
                    >
                      <Plus size={13} strokeWidth={2.5} />
                      <span>Add</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search size={32} color="#cbd5e1" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                No components found
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                No component matching "{searchQuery}"
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                  setScopeFilter('all');
                }}
                style={{
                  marginTop: '14px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid #f1f5f9',
            background: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: '#64748b',
            flexShrink: 0,
          }}
        >
          <span>Showing {filteredBlocks.length} available components</span>
          <span>Click any component to immediately insert it into your layout</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
