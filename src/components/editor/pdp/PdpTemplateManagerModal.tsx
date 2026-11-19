// ============================================================
// PDP BUILDER — TEMPLATE MANAGER MODAL
// Minimal, sleek modal dialog with blurred backdrop over topbar
// No template descriptions (clean name, block count, product count)
// Multi-product batch assignment with "In use by [Template]" indicators
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Star,
  Download,
  Upload,
  Package,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { usePdpStore } from './pdpStore';

export const PdpTemplateManagerModal: React.FC = () => {
  const {
    isTemplateManagerOpen,
    setTemplateManagerOpen,
    templates,
    activeTemplateId,
    selectTemplate,
    createTemplate,
    duplicateTemplate,
    renameTemplate,
    deleteTemplate,
    setDefaultTemplate,
    products,
    bulkAssignTemplate,
    exportTemplateJson,
    importTemplateJson,
  } = usePdpStore();

  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [cloneSourceId, setCloneSourceId] = useState('template-default');

  const [activeTab, setActiveTab] = useState<'templates' | 'assignments' | 'io'>('templates');
  const [targetTemplateId, setTargetTemplateId] = useState<string>(activeTemplateId || 'template-default');
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [assignmentFeedback, setAssignmentFeedback] = useState<string | null>(null);

  // Set of selected product IDs for batch assignment to targetTemplateId
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Sync selected products whenever target template changes or modal opens
  useEffect(() => {
    const currentlyAssigned = products
      .filter((p) => {
        const target = templates.find((t) => t.id === targetTemplateId);
        if (target?.isDefault) {
          return !p.assignedTemplateId || p.assignedTemplateId === targetTemplateId;
        }
        return p.assignedTemplateId === targetTemplateId;
      })
      .map((p) => p.id);

    setSelectedProductIds(currentlyAssigned);
  }, [targetTemplateId, products, templates]);

  // Esc key closes modal & lock body scroll
  useEffect(() => {
    if (!isTemplateManagerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setTemplateManagerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTemplateManagerOpen, setTemplateManagerOpen]);

  const targetTemplate = useMemo(() => {
    return templates.find((t) => t.id === targetTemplateId) || templates[0];
  }, [templates, targetTemplateId]);

  if (!isTemplateManagerOpen) return null;

  const handleStartEdit = (t: typeof templates[0]) => {
    setEditingTemplateId(t.id);
    setEditName(t.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renameTemplate(id, editName.trim());
    }
    setEditingTemplateId(null);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const createdId = createTemplate(newName.trim(), '', cloneSourceId);
    selectTemplate(createdId);
    setTargetTemplateId(createdId);
    setIsCreatingNew(false);
    setNewName('');
  };

  const handleExport = (templateId: string) => {
    const json = exportTemplateJson(templateId);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pdp-template-${templateId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!jsonInput.trim()) return;
    const success = importTemplateJson(jsonInput);
    if (success) {
      setImportStatus('Template imported successfully!');
      setJsonInput('');
      setTimeout(() => setImportStatus(null), 3500);
    } else {
      setImportStatus('Error: Invalid PDP template JSON format.');
      setTimeout(() => setImportStatus(null), 4000);
    }
  };

  // Categories list for product filter
  const productCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Toggle single product selection
  const handleToggleProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Select all filtered products
  const handleSelectAllFiltered = () => {
    const filteredIds = filteredProducts.map((p) => p.id);
    setSelectedProductIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
  };

  // Deselect all filtered products
  const handleDeselectAllFiltered = () => {
    const filteredIds = new Set(filteredProducts.map((p) => p.id));
    setSelectedProductIds((prev) => prev.filter((id) => !filteredIds.has(id)));
  };

  // Save batch assignments
  const handleApplyAssignments = () => {
    const targetIsDefault = targetTemplate.isDefault;

    // Products that were selected are assigned to targetTemplateId (or null if default)
    const assignTargetVal = targetIsDefault ? null : targetTemplateId;
    bulkAssignTemplate(selectedProductIds, assignTargetVal);

    // Products that were previously assigned to this template but unchecked are reassigned to Default
    const previouslyAssigned = products
      .filter((p) => p.assignedTemplateId === targetTemplateId)
      .map((p) => p.id);

    const removedProductIds = previouslyAssigned.filter((id) => !selectedProductIds.includes(id));
    if (removedProductIds.length > 0) {
      bulkAssignTemplate(removedProductIds, null);
    }

    setAssignmentFeedback(
      `Updated: ${selectedProductIds.length} product(s) assigned to "${targetTemplate.name}".`
    );
    setTimeout(() => setAssignmentFeedback(null), 3500);
  };

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
      onClick={() => setTemplateManagerOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="PDP Templates & Catalogue Assignment"
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
              <Package size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                PDP Templates & Catalogue
              </h3>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b' }}>
                Manage layout templates and assign multiple products in bulk
              </p>
            </div>
          </div>

          <button
            onClick={() => setTemplateManagerOpen(false)}
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

        {/* ── Tabs Navigation ── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            background: '#fafafa',
            padding: '0 20px',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setActiveTab('templates')}
            style={{
              padding: '10px 14px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'templates' ? '#15803d' : '#64748b',
              borderBottom: activeTab === 'templates' ? '2px solid #15803d' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Templates</span>
            <span
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '999px',
                background: activeTab === 'templates' ? '#dcfce7' : '#e2e8f0',
                color: activeTab === 'templates' ? '#15803d' : '#475569',
              }}
            >
              {templates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            style={{
              padding: '10px 14px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'assignments' ? '#15803d' : '#64748b',
              borderBottom: activeTab === 'assignments' ? '2px solid #15803d' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Assign Products</span>
            <span
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '999px',
                background: activeTab === 'assignments' ? '#dcfce7' : '#e2e8f0',
                color: activeTab === 'assignments' ? '#15803d' : '#475569',
              }}
            >
              {products.length} Products
            </span>
          </button>

          <button
            onClick={() => setActiveTab('io')}
            style={{
              padding: '10px 14px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'io' ? '#15803d' : '#64748b',
              borderBottom: activeTab === 'io' ? '2px solid #15803d' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Import / Export
          </button>
        </div>

        {/* ── Tab 1: Templates (Minimal, No Descriptions) ── */}
        {activeTab === 'templates' && (
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#ffffff',
            }}
          >
            {/* Top Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                  PDP Templates
                </span>
                <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>
                  ({templates.length} configured)
                </span>
              </div>

              {!isCreatingNew && (
                <button
                  onClick={() => setIsCreatingNew(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#198754',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(25, 135, 84, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#157347')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#198754')}
                >
                  <Plus size={14} />
                  <span>New Template</span>
                </button>
              )}
            </div>

            {/* Create New Template (Minimal, No Description) */}
            {isCreatingNew && (
              <div
                style={{
                  padding: '14px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                  Create New PDP Template
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Template Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Beauty & Skincare PDP"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Clone Blocks From
                    </label>
                    <select
                      value={cloneSourceId}
                      onChange={(e) => setCloneSourceId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        outline: 'none',
                        background: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    >
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.blocks.length} blocks)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '2px' }}>
                  <button
                    onClick={() => setIsCreatingNew(false)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#198754',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Create Template
                  </button>
                </div>
              </div>
            )}

            {/* Template Cards: Name, Blocks count, Products count, Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {templates.map((tmpl) => {
                const isActive = tmpl.id === activeTemplateId;
                const assignedProductsCount = products.filter((p) => {
                  if (tmpl.isDefault) {
                    return !p.assignedTemplateId || p.assignedTemplateId === tmpl.id;
                  }
                  return p.assignedTemplateId === tmpl.id;
                }).length;

                return (
                  <div
                    key={tmpl.id}
                    style={{
                      border: isActive ? '1.5px solid #198754' : '1px solid #e2e8f0',
                      background: isActive ? '#f0fdf4' : '#ffffff',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Left: Name and Counts only */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {editingTemplateId === tmpl.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '340px' }}>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            style={{
                              padding: '5px 8px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              fontSize: '13px',
                              fontWeight: 600,
                              flex: 1,
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(tmpl.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '4px',
                              border: 'none',
                              background: '#198754',
                              color: '#fff',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTemplateId(null)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: '#fff',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                            {tmpl.name}
                          </span>

                          {tmpl.isDefault && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                background: '#dcfce7',
                                color: '#15803d',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                border: '1px solid #bbf7d0',
                              }}
                            >
                              DEFAULT PDP
                            </span>
                          )}

                          {isActive && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                background: '#e0f2fe',
                                color: '#0369a1',
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              ACTIVE
                            </span>
                          )}

                          <span
                            style={{
                              fontSize: '11px',
                              color: '#475569',
                              background: '#f1f5f9',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontWeight: 500,
                            }}
                          >
                            {tmpl.blocks.length} blocks
                          </span>

                          <span
                            style={{
                              fontSize: '11px',
                              color: '#16a34a',
                              background: '#f0fdf4',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontWeight: 600,
                              border: '1px solid #dcfce7',
                            }}
                          >
                            {assignedProductsCount} products
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                      {/* Assign Products Button */}
                      <button
                        onClick={() => {
                          setTargetTemplateId(tmpl.id);
                          setActiveTab('assignments');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#334155',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        title={`Assign products to ${tmpl.name}`}
                      >
                        <Users size={13} color="#15803d" />
                        <span>Assign</span>
                      </button>

                      {!tmpl.isDefault && (
                        <button
                          onClick={() => setDefaultTemplate(tmpl.id)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: '#ffffff',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title="Set as Default PDP"
                        >
                          <Star size={13} />
                        </button>
                      )}

                      <button
                        onClick={() => handleStartEdit(tmpl)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          background: '#ffffff',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Rename template"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        onClick={() => duplicateTemplate(tmpl.id)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          background: '#ffffff',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Duplicate template"
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        onClick={() => handleExport(tmpl.id)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          background: '#ffffff',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Export JSON"
                      >
                        <Download size={13} />
                      </button>

                      {!tmpl.isDefault && templates.length > 1 && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete "${tmpl.name}"? Any assigned products will be safely reassigned to the Default PDP.`
                              )
                            ) {
                              deleteTemplate(tmpl.id);
                            }
                          }}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #fee2e2',
                            background: '#ffffff',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title="Delete template"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          selectTemplate(tmpl.id);
                          setTemplateManagerOpen(false);
                        }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: isActive ? '1px solid #198754' : '1px solid #cbd5e1',
                          background: isActive ? '#198754' : '#ffffff',
                          color: isActive ? '#ffffff' : '#0f172a',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          marginLeft: '2px',
                        }}
                      >
                        {isActive ? 'In Editor' : 'Edit'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab 2: Batch Multi-Product Assignment ── */}
        {activeTab === 'assignments' && (
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#ffffff',
            }}
          >
            {/* Top Assignment Control Bar: Select Target Template & Actions */}
            <div
              style={{
                padding: '12px 14px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                  Target Template:
                </span>
                <select
                  value={targetTemplateId}
                  onChange={(e) => setTargetTemplateId(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {templates.map((t) => {
                    const count = products.filter((p) => {
                      if (t.isDefault) {
                        return !p.assignedTemplateId || p.assignedTemplateId === t.id;
                      }
                      return p.assignedTemplateId === t.id;
                    }).length;
                    return (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.isDefault ? '(Default)' : ''} — {count} product(s)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Apply Changes Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleApplyAssignments}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#198754',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(25, 135, 84, 0.25)',
                  }}
                >
                  <Check size={14} strokeWidth={2.5} />
                  <span>Save Product Assignments</span>
                </button>
              </div>
            </div>

            {/* Feedback Banner */}
            {assignmentFeedback && (
              <div
                style={{
                  padding: '8px 12px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{assignmentFeedback}</span>
              </div>
            )}

            {/* Search & Bulk Selection Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {/* Search & Category Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '260px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search
                    size={14}
                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  />
                  <input
                    type="text"
                    placeholder="Search products by title, SKU, or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px 6px 30px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    background: '#ffffff',
                    color: '#334155',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Categories</option>
                  {productCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bulk Checkbox Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={handleSelectAllFiltered}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    color: '#0f172a',
                    cursor: 'pointer',
                  }}
                >
                  Select All Filtered ({filteredProducts.length})
                </button>
                <button
                  onClick={handleDeselectAllFiltered}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Deselect All
                </button>
              </div>
            </div>

            {/* Instruction Notice */}
            <div
              style={{
                fontSize: '11.5px',
                color: '#64748b',
                background: '#f8fafc',
                padding: '6px 10px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>
                Checked products will be rendered using <strong>{targetTemplate.name}</strong>.
              </span>
              <span>
                {selectedProductIds.length} of {products.length} products assigned
              </span>
            </div>

            {/* Products List with Checkboxes & Template in Use Indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredProducts.map((prod) => {
                const isChecked = selectedProductIds.includes(prod.id);

                // Determine template currently assigned in store
                const currentAssignedId = prod.assignedTemplateId;
                const assignedTemplate = currentAssignedId
                  ? templates.find((t) => t.id === currentAssignedId)
                  : templates.find((t) => t.isDefault);

                const isAssignedToTarget =
                  (targetTemplate.isDefault && (!currentAssignedId || currentAssignedId === targetTemplate.id)) ||
                  currentAssignedId === targetTemplate.id;

                const isAssignedToOther =
                  !isAssignedToTarget && currentAssignedId && currentAssignedId !== targetTemplate.id;

                return (
                  <div
                    key={prod.id}
                    onClick={() => handleToggleProduct(prod.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: isChecked ? '#f0fdf4' : '#ffffff',
                      border: isChecked ? '1px solid #86efac' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    {/* Left: Checkbox + Thumbnail + Product Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#198754',
                          cursor: 'pointer',
                        }}
                      />

                      <img
                        src={prod.images[0] || 'https://via.placeholder.com/36'}
                        alt={prod.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          flexShrink: 0,
                          border: '1px solid #e2e8f0',
                        }}
                      />

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#0f172a',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {prod.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {prod.category} • SKU: {prod.sku || 'N/A'} • ${prod.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Right: Dynamic Template Status Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {isAssignedToOther ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: '#fef3c7',
                            color: '#92400e',
                            border: '1px solid #fde68a',
                          }}
                          title={`Product is currently using: ${assignedTemplate?.name || 'Another Template'}`}
                        >
                          <AlertTriangle size={12} color="#b45309" />
                          <span>In use by: {assignedTemplate?.name || 'Other Template'}</span>
                        </div>
                      ) : isAssignedToTarget ? (
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: '#dcfce7',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                          }}
                        >
                          ✓ Currently on this template
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 500,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#475569',
                          }}
                        >
                          Inheriting Default PDP
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab 3: JSON Import / Export ── */}
        {activeTab === 'io' && (
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: '#ffffff',
            }}
          >
            {/* Quick Export Cards */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                Export Templates as JSON
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {templates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                    }}
                  >
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                      {tmpl.name}
                    </span>
                    <button
                      onClick={() => handleExport(tmpl.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 500,
                        color: '#0f172a',
                        cursor: 'pointer',
                      }}
                    >
                      <Download size={12} />
                      <span>Export</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Import Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                Import PDP Template JSON
              </div>
              <textarea
                rows={7}
                placeholder="Paste JSON configuration of a PDP template here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {importStatus && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: importStatus.includes('Error') ? '#fef2f2' : '#f0fdf4',
                    color: importStatus.includes('Error') ? '#dc2626' : '#15803d',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {importStatus.includes('Error') ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
                  <span>{importStatus}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleImportSubmit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#198754',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} />
                  <span>Import Template</span>
                </button>
              </div>
            </div>
          </div>
        )}

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
          <span>Active in Builder: <strong>{templates.find((t) => t.id === activeTemplateId)?.name}</strong></span>
          <span>{products.length} products total in catalogue</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
