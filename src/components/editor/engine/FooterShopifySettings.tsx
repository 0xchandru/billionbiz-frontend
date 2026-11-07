import React from 'react';
import { useEditorContextStore } from '../../../store/editorContextStore';
import type { FooterTreeNode } from './footerTreeTypes';
import type { FooterRow } from './types';
import { footerTextForEditor, sanitizeFooterRichText } from './footerRichText';

type Option = { label: string; value: string };
type Sizing = { mode: 'fit' | 'fill' | 'custom'; value?: number; unit?: 'px' | '%' | 'rem' };
type Sides = { top: number; right: number; bottom: number; left: number };

const shopifyIconOptions: Option[] = [
  { label: 'None', value: 'none' },
  ...[
    ['Apple', 'apple'], ['Arrow', 'arrow'], ['Banana', 'banana'], ['Bottle', 'bottle'],
    ['Box', 'box'], ['Carrot', 'carrot'], ['Chat bubble', 'chat-bubble'], ['Check box', 'check-box'],
    ['Clipboard', 'clipboard'], ['Dairy', 'dairy'], ['Dairy free', 'dairy-free'], ['Dryer', 'dryer'],
    ['Eye', 'eye'], ['Fire', 'fire'], ['Gluten free', 'gluten-free'], ['Heart', 'heart'],
    ['Leaf', 'leaf'], ['Leather', 'leather'], ['Lightning bolt', 'lightning-bolt'], ['Lipstick', 'lipstick'],
    ['Lock', 'lock'], ['Map pin', 'map-pin'], ['Nut free', 'nut-free'], ['Pants', 'pants'],
    ['Paw print', 'paw-print'], ['Pepper', 'pepper'], ['Perfume', 'perfume'], ['Plane', 'plane'],
    ['Plant', 'plant'], ['Price tag', 'price-tag'], ['Question mark', 'question-mark'], ['Recycle', 'recycle'],
    ['Return', 'return'], ['Ruler', 'ruler'], ['Serving dish', 'serving-dish'], ['Shirt', 'shirt'],
    ['Shoe', 'shoe'], ['Silhouette', 'silhouette'], ['Snowflake', 'snowflake'], ['Star', 'star'],
    ['Stopwatch', 'stopwatch'], ['Truck', 'truck'], ['Washing', 'washing'],
    ['Social: Bluesky', 'social-bluesky'], ['Social: Facebook', 'social-facebook'],
    ['Social: Instagram', 'social-instagram'], ['Social: LinkedIn', 'social-linkedin'],
    ['Social: Pinterest', 'social-pinterest'], ['Social: Snapchat', 'social-snapchat'],
    ['Social: Spotify', 'social-spotify'], ['Social: Threads', 'social-threads'],
    ['Social: TikTok', 'social-tiktok'], ['Social: Tumblr', 'social-tumblr'],
    ['Social: X (Twitter)', 'social-x'], ['Social: Vimeo', 'social-vimeo'],
    ['Social: YouTube', 'social-youtube'], ['Social: WhatsApp', 'social-whatsapp'],
  ].map(([label, value]) => ({ label, value })),
];

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, color: '#475467', fontSize: 12, fontWeight: 500 };
const inputStyle: React.CSSProperties = { boxSizing: 'border-box', width: '100%', minWidth: 0, padding: '8px 10px', border: '1px solid #cfd4dc', borderRadius: 6, color: '#202223', background: '#fff', fontSize: 13 };
const rowStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };
const contentStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16, padding: '14px 16px 18px' };

export const FooterShopifySettings: React.FC<{ node: FooterTreeNode | null; rootRow?: FooterRow }> = ({ node, rootRow }) => {
  const {
    updateFooterRow,
    updateFooterTreeNodeProps,
    updateFooterTreeNodeLayout,
    updateFooterTreeNodeStyling,
    updateFooterTreeNodeResponsive,
  } = useEditorContextStore();
  const [rootResponsiveBreakpoint, setRootResponsiveBreakpoint] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [nodeResponsiveBreakpoint, setNodeResponsiveBreakpoint] = React.useState<'desktop' | 'tablet' | 'mobile'>('mobile');

  if (!node) {
    if (!rootRow) return <p style={{ padding: 16, color: '#667085', fontSize: 13 }}>Footer settings are unavailable.</p>;
    const layout = rootRow.layout;
    const styling = rootRow.styling;
    const setLayout = (updates: Record<string, unknown>) => updateFooterRow(rootRow.id, { layout: { ...layout, ...updates } });
    const setStyling = (updates: Record<string, unknown>) => updateFooterRow(rootRow.id, { styling: { ...styling, ...updates } });
    const padding: Sides = {
      top: layout.paddingTop ?? layout.paddingY ?? 30,
      right: layout.paddingRight ?? layout.paddingX ?? 32,
      bottom: layout.paddingBottom ?? layout.paddingY ?? 30,
      left: layout.paddingLeft ?? layout.paddingX ?? 32,
    };
    const responsiveBreakpoint = rootResponsiveBreakpoint;
    const rootResponsive = rootRow.responsive?.[responsiveBreakpoint] || {};
    const responsivePadding: Sides = { ...padding, ...(rootResponsive.padding || {}) };
    const setRootResponsive = (updates: Record<string, unknown>) => updateFooterRow(rootRow.id, {
      responsive: {
        ...rootRow.responsive,
        [responsiveBreakpoint]: { ...rootResponsive, ...updates },
      },
    });
    const backgroundMode = styling.bgType === 'custom' || styling.bgType === 'color'
      ? 'color'
      : styling.bgType === 'gradient' || styling.bgType === 'image'
        ? styling.bgType
        : 'inherit';
    const backgroundOptions: Option[] = [
      ...(backgroundMode === 'inherit' ? [{ label: 'Inherit', value: 'inherit' }] : []),
      { label: 'Color', value: 'color' },
      { label: 'Gradient', value: 'gradient' },
      { label: 'Image', value: 'image' },
    ];
    const setBackgroundMode = (value: string) => {
      if (value === 'inherit') setStyling({ bgType: 'theme' });
      else if (value === 'color') setStyling({ bgType: 'custom', bgColor: styling.bgColor || '#ffffff' });
      else if (value === 'gradient') setStyling({ bgType: 'gradient', bgGradientStart: styling.bgGradientStart || '#1d4ed8', bgGradientEnd: styling.bgGradientEnd || '#7c3aed', bgGradientDirection: styling.bgGradientDirection || '90deg' });
      else setStyling({ bgType: 'image' });
    };
    const gradientStart = styling.bgGradientStart || '#1d4ed8';
    const gradientEnd = styling.bgGradientEnd || '#7c3aed';
    const gradientDirection = styling.bgGradientDirection || '90deg';
    const updateGradient = (updates: Record<string, string>) => {
      const start = updates.bgGradientStart || gradientStart;
      const end = updates.bgGradientEnd || gradientEnd;
      const direction = updates.bgGradientDirection || gradientDirection;
      setStyling({ ...updates, bgGradient: `linear-gradient(${direction}, ${start}, ${end})` });
    };

    return (
      <div style={contentStyle}>
        <SettingsSection title="Layout">
          <Segmented label="Width" value={layout.container === 'full' ? 'full' : 'page'} options={[{ label: 'Page', value: 'page' }, { label: 'Full', value: 'full' }]} onChange={(value) => setLayout({ container: value === 'full' ? 'full' : 'constrained' })} />
          <RangeSetting label="Gap" value={layout.sectionGap ?? layout.gap ?? 20} min={0} max={160} onChange={(value) => setLayout({ sectionGap: value })} />
        </SettingsSection>
        <SettingsSection title="Background">
          <SelectSetting label="Background" value={backgroundMode} options={backgroundOptions} onChange={setBackgroundMode} />
          {backgroundMode === 'color' && <ColorCodeSetting label="Color" value={styling.bgColor || '#ffffff'} onChange={(value) => setStyling({ bgColor: value, bgType: 'custom' })} />}
          {backgroundMode === 'gradient' && <>
            <ColorCodeSetting label="Start color" value={gradientStart} onChange={(value) => updateGradient({ bgGradientStart: value })} />
            <ColorCodeSetting label="End color" value={gradientEnd} onChange={(value) => updateGradient({ bgGradientEnd: value })} />
            <SelectSetting label="Direction" value={gradientDirection} options={[{ label: 'Left to right', value: '90deg' }, { label: 'Top to bottom', value: '180deg' }, { label: 'Bottom-left to top-right', value: '45deg' }, { label: 'Top-left to bottom-right', value: '135deg' }]} onChange={(value) => updateGradient({ bgGradientDirection: value })} />
          </>}
          {backgroundMode === 'image' && <>
            <ImageUploadSetting label="Background image" value={styling.bgImage || ''} onChange={(value) => setStyling({ bgImage: value, bgType: 'image' })} />
            <TextSetting label="Image URL" value={styling.bgImage || ''} onChange={(value) => setStyling({ bgImage: value, bgType: 'image' })} placeholder="https://" />
            <Segmented label="Image position" value={styling.bgPosition || 'center'} options={[{ label: 'Top', value: 'center top' }, { label: 'Center', value: 'center' }, { label: 'Bottom', value: 'center bottom' }]} onChange={(value) => setStyling({ bgPosition: value })} />
            <Segmented label="Image sizing" value={styling.bgSize || 'cover'} options={[{ label: 'Cover', value: 'cover' }, { label: 'Fit', value: 'contain' }]} onChange={(value) => setStyling({ bgSize: value })} />
            {styling.bgImage && <>
              <Segmented label="Image effect" value={styling.bgEffectMode || 'opacity'} options={[{ label: 'Opacity', value: 'opacity' }, { label: 'Blur', value: 'blur' }]} onChange={(value) => setStyling(value === 'opacity' ? { bgEffectMode: 'opacity', bgBlur: 0 } : { bgEffectMode: 'blur', bgOpacity: 100 })} />
              {(styling.bgEffectMode || 'opacity') === 'opacity'
                ? <RangeSetting label="Image opacity" value={Math.max(0, Math.min(100, styling.bgOpacity ?? 100))} min={0} max={100} unit="%" onChange={(value) => setStyling({ bgOpacity: value })} />
                : <RangeSetting label="Image blur" value={Math.max(0, Math.min(100, styling.bgBlur ?? 0))} min={0} max={100} unit="%" onChange={(value) => setStyling({ bgBlur: value })} />}
            </>}
          </>}
        </SettingsSection>
        <SettingsSection title="Padding">
          <PaddingSettings value={padding} onChange={(value) => setLayout({ paddingTop: value.top, paddingRight: value.right, paddingBottom: value.bottom, paddingLeft: value.left })} />
        </SettingsSection>
        <SettingsSection title="Responsive">
          <ToggleSetting label="Show on desktop" checked={rootRow.responsive?.showOnDesktop !== false} onChange={(value) => updateFooterRow(rootRow.id, { responsive: { ...rootRow.responsive, showOnDesktop: value } })} />
          <ToggleSetting label="Show on tablet" checked={rootRow.responsive?.showOnTablet !== false} onChange={(value) => updateFooterRow(rootRow.id, { responsive: { ...rootRow.responsive, showOnTablet: value } })} />
          <ToggleSetting label="Show on mobile" checked={rootRow.responsive?.showOnMobile !== false} onChange={(value) => updateFooterRow(rootRow.id, { responsive: { ...rootRow.responsive, showOnMobile: value } })} />
          <Segmented label="Edit breakpoint" value={responsiveBreakpoint} options={[{ label: 'Desktop', value: 'desktop' }, { label: 'Tablet', value: 'tablet' }, { label: 'Mobile', value: 'mobile' }]} onChange={(value) => setRootResponsiveBreakpoint(value as 'desktop' | 'tablet' | 'mobile')} />
          <PaddingSettings value={responsivePadding} onChange={(value) => setRootResponsive({ padding: value })} />
          <RangeSetting label="Section gap" value={rootResponsive.sectionGap ?? layout.sectionGap ?? layout.gap ?? 20} min={0} max={160} onChange={(value) => setRootResponsive({ sectionGap: value })} />
          {responsiveBreakpoint === 'mobile' && <SelectSetting label="Mobile columns" value={String(rootRow.responsive?.mobileColumnCount ?? 1)} options={[{ label: '1 column', value: '1' }, { label: '2 columns', value: '2' }, { label: '3 columns', value: '3' }]} onChange={(value) => updateFooterRow(rootRow.id, { responsive: { ...rootRow.responsive, mobileColumnCount: Number(value) } })} />}
        </SettingsSection>
      </div>
    );
  }

  const props = node.props || {};
  const setProps = (updates: Record<string, unknown>) => updateFooterTreeNodeProps(node.id, updates);
  const setLayout = (updates: Record<string, unknown>) => updateFooterTreeNodeLayout(node.id, updates);
  const setStyling = (updates: Record<string, unknown>) => updateFooterTreeNodeStyling(node.id, updates);
  const setPadding = (value: Sides) => node.nodeType === 'group'
    ? setLayout({ padding: value })
    : setProps({ padding: value });
  const padding: Sides = node.nodeType === 'group'
    ? { top: node.layout?.padding?.top || 0, right: node.layout?.padding?.right || 0, bottom: node.layout?.padding?.bottom || 0, left: node.layout?.padding?.left || 0 }
    : { top: props.padding?.top || 0, right: props.padding?.right || 0, bottom: props.padding?.bottom || 0, left: props.padding?.left || 0 };

  if (node.nodeType === 'group') {
    const layout = node.layout || { direction: 'vertical', width: { mode: 'fill' }, height: { mode: 'fit' }, mainAxisDistribution: 'start', crossAxisAlignment: 'start', gap: 16, padding };
    const responsiveBreakpoint = nodeResponsiveBreakpoint;
    const breakpointOverride = node.responsive?.[responsiveBreakpoint] || {};
    const responsiveBaseDirection = responsiveBreakpoint === 'mobile' && !breakpointOverride.direction && layout.direction === 'horizontal'
      ? 'vertical'
      : layout.direction || 'vertical';
    const responsivePadding: Sides = { ...padding, ...(breakpointOverride.padding || {}) };
    const setBreakpointSettings = (updates: Record<string, unknown>) => updateFooterTreeNodeResponsive(node.id, {
      [responsiveBreakpoint]: { ...breakpointOverride, ...updates },
    });
    const backgroundMedia = props.backgroundMediaType || (node.styling?.bgType === 'image' ? 'image' : 'none');
    const groupBackgroundImage = props.backgroundImageUrl || node.styling?.bgImage || '';
    return (
      <div style={contentStyle}>
        <SettingsSection title="Layout">
          <Segmented label="Direction" value={layout.direction === 'horizontal' ? 'row' : 'column'} options={[{ label: 'Row', value: 'row' }, { label: 'Column', value: 'column' }]} onChange={(value) => setLayout({ direction: value === 'row' ? 'horizontal' : 'vertical' })} />
          <SelectSetting label="Main axis distribution" value={layout.mainAxisDistribution || 'start'} options={[{ label: 'Start', value: 'start' }, { label: 'Center', value: 'center' }, { label: 'End', value: 'end' }, { label: 'Space between', value: 'space-between' }, { label: 'Space around', value: 'space-around' }, { label: 'Space evenly', value: 'space-evenly' }]} onChange={(value) => setLayout({ mainAxisDistribution: value })} />
          <SelectSetting label="Cross axis alignment" value={layout.crossAxisAlignment || 'start'} options={[{ label: 'Start', value: 'start' }, { label: 'Center', value: 'center' }, { label: 'End', value: 'end' }, { label: 'Stretch', value: 'stretch' }]} onChange={(value) => setLayout({ crossAxisAlignment: value })} />
          <RangeSetting label="Gap" value={layout.gap || 0} min={0} max={64} onChange={(value) => setLayout({ gap: value })} />
        </SettingsSection>
        <SettingsSection title="Size">
          <SizingSetting label="Width" value={layout.width || { mode: 'fill' }} onChange={(value) => setLayout({ width: value })} />
          <SizingSetting label="Height" value={layout.height || { mode: 'fit' }} onChange={(value) => setLayout({ height: value })} />
        </SettingsSection>
        <SettingsSection title="Responsive">
          <Segmented label="Edit breakpoint" value={responsiveBreakpoint} options={[{ label: 'Desktop', value: 'desktop' }, { label: 'Tablet', value: 'tablet' }, { label: 'Mobile', value: 'mobile' }]} onChange={(value) => setNodeResponsiveBreakpoint(value as 'desktop' | 'tablet' | 'mobile')} />
          <ToggleSetting label="Show on this device" checked={breakpointOverride.visible !== false} onChange={(value) => setBreakpointSettings({ visible: value })} />
          <Segmented label="Direction" value={(breakpointOverride.direction || responsiveBaseDirection) === 'horizontal' ? 'row' : 'column'} options={[{ label: 'Row', value: 'row' }, { label: 'Column', value: 'column' }]} onChange={(value) => setBreakpointSettings({ direction: value === 'row' ? 'horizontal' : 'vertical' })} />
          <SelectSetting label="Main axis distribution" value={breakpointOverride.mainAxisDistribution || layout.mainAxisDistribution || 'start'} options={[{ label: 'Start', value: 'start' }, { label: 'Center', value: 'center' }, { label: 'End', value: 'end' }, { label: 'Space between', value: 'space-between' }, { label: 'Space around', value: 'space-around' }, { label: 'Space evenly', value: 'space-evenly' }]} onChange={(value) => setBreakpointSettings({ mainAxisDistribution: value })} />
          <SelectSetting label="Cross axis alignment" value={breakpointOverride.crossAxisAlignment || layout.crossAxisAlignment || 'stretch'} options={[{ label: 'Start', value: 'start' }, { label: 'Center', value: 'center' }, { label: 'End', value: 'end' }, { label: 'Stretch', value: 'stretch' }]} onChange={(value) => setBreakpointSettings({ crossAxisAlignment: value })} />
          <RangeSetting label="Gap" value={breakpointOverride.gap ?? layout.gap ?? 16} min={0} max={96} onChange={(value) => setBreakpointSettings({ gap: value })} />
          <SizingSetting label="Width" value={breakpointOverride.width || layout.width || { mode: 'fill' }} onChange={(value) => setBreakpointSettings({ width: value })} />
          <SizingSetting label="Height" value={breakpointOverride.height || layout.height || { mode: 'fit' }} onChange={(value) => setBreakpointSettings({ height: value })} />
          <ToggleSetting label="Wrap children" checked={breakpointOverride.wrap ?? layout.wrap ?? false} onChange={(value) => setBreakpointSettings({ wrap: value })} />
          <PaddingSettings value={responsivePadding} onChange={(value) => setBreakpointSettings({ padding: value })} />
        </SettingsSection>
        <SettingsSection title="Design">
          <SelectSetting label="Background media" value={backgroundMedia} options={[{ label: 'None', value: 'none' }, { label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }]} onChange={(value) => { setProps({ backgroundMediaType: value }); setStyling({ bgType: value === 'image' ? 'image' : value === 'none' ? 'inherit' : 'color' }); }} />
          {backgroundMedia === 'image' && <ImageUploadSetting label="Background image" value={groupBackgroundImage} onChange={(value) => { setProps({ backgroundImageUrl: value }); setStyling({ bgImage: value, bgType: 'image' }); }} />}
          {backgroundMedia === 'image' && <TextSetting label="Image URL" value={groupBackgroundImage} onChange={(value) => { setProps({ backgroundImageUrl: value }); setStyling({ bgImage: value, bgType: 'image' }); }} placeholder="https://" />}
          {backgroundMedia === 'image' && <Segmented label="Image position" value={node.styling?.bgSize || 'cover'} options={[{ label: 'Cover', value: 'cover' }, { label: 'Fit', value: 'contain' }]} onChange={(value) => setStyling({ bgSize: value })} />}
          {backgroundMedia === 'image' && groupBackgroundImage && <>
            <Segmented label="Image effect" value={node.styling?.bgEffectMode || 'opacity'} options={[{ label: 'Opacity', value: 'opacity' }, { label: 'Blur', value: 'blur' }]} onChange={(value) => setStyling(value === 'opacity' ? { bgEffectMode: 'opacity', bgBlur: 0 } : { bgEffectMode: 'blur', bgOpacity: 100 })} />
            {(node.styling?.bgEffectMode || 'opacity') === 'opacity'
              ? <RangeSetting label="Image opacity" value={Math.max(0, Math.min(100, node.styling?.bgOpacity ?? 100))} min={0} max={100} unit="%" onChange={(value) => setStyling({ bgOpacity: value })} />
              : <RangeSetting label="Image blur" value={Math.max(0, Math.min(100, node.styling?.bgBlur ?? 0))} min={0} max={100} unit="%" onChange={(value) => setStyling({ bgBlur: value })} />}
          </>}
          {backgroundMedia === 'video' && <TextSetting label="Background video URL" value={props.backgroundVideoUrl || ''} onChange={(value) => setProps({ backgroundVideoUrl: value })} placeholder="https://" />}
          <ColorSetting label="Background color" value={node.styling?.bgColor || '#ffffff'} onChange={(value) => setStyling({ bgColor: value, bgType: backgroundMedia === 'image' ? 'image' : 'color' })} />
          <ToggleSetting label="Background overlay" checked={Boolean(props.backgroundOverlay)} onChange={(value) => setProps({ backgroundOverlay: value })} />
        </SettingsSection>
        <SettingsSection title="Borders">
          <Segmented label="Style" value={node.styling?.borderStyle === 'solid' ? 'solid' : 'none'} options={[{ label: 'None', value: 'none' }, { label: 'Solid', value: 'solid' }]} onChange={(value) => setStyling({ borderStyle: value, borderWidth: value === 'none' ? 0 : (node.styling?.borderWidth || 1) })} />
          {node.styling?.borderStyle === 'solid' && <><RangeSetting label="Thickness" value={node.styling?.borderWidth || 1} min={1} max={12} unit="px" onChange={(value) => setStyling({ borderWidth: value })} /><ColorSetting label="Color" value={node.styling?.borderColor || '#d0d5dd'} onChange={(value) => setStyling({ borderColor: value })} /><RangeSetting label="Corner radius" value={node.styling?.borderRadius || 0} min={0} max={64} onChange={(value) => setStyling({ borderRadius: value })} /></>}
        </SettingsSection>
        <SettingsSection title="Block link">
          <TextSetting label="Link" value={props.link || ''} onChange={(value) => setProps({ link: value })} placeholder="Choose a page or paste a URL" />
          <ToggleSetting label="Open link in new tab" checked={Boolean(props.openInNewTab)} onChange={(value) => setProps({ openInNewTab: value })} />
        </SettingsSection>
        <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
      </div>
    );
  }

  switch (node.nodeType) {
    case 'heading':
    case 'text':
      return <TextBlockSettings node={node} props={props} setProps={setProps} padding={padding} setPadding={setPadding} />;
    case 'logo':
      return (
        <div style={contentStyle}>
          <SettingsSection title="Logo">
            <ImageUploadSetting label="Store logo" value={props.imageUrl || props.image || props.src || ''} onChange={(value) => setProps({ imageUrl: value, image: value, src: value, logoType: value ? 'image' : 'both' })} />
            <TextSetting label="Image URL" value={props.imageUrl || props.image || props.src || ''} onChange={(value) => setProps({ imageUrl: value, image: value, src: value, logoType: value ? 'image' : 'both' })} placeholder="Paste an image URL" />
            <SelectSetting label="Font" value={props.fontPreset || 'heading'} options={[{ label: 'Body', value: 'body' }, { label: 'Subheading', value: 'subheading' }, { label: 'Heading', value: 'heading' }, { label: 'Accent', value: 'accent' }]} onChange={(value) => setProps({ fontPreset: value })} />
            <ColorSetting label="Color" value={props.color || props.firstLineColor || '#111827'} onChange={(value) => setProps({ color: value, firstLineColor: value })} />
          </SettingsSection>
          <SettingsSection title="Size">
            <Segmented label="Unit" value={props.sizeUnit || 'px'} options={[{ label: 'Pixels', value: 'px' }, { label: 'Percent', value: '%' }]} onChange={(value) => setProps({ sizeUnit: value })} />
            <RangeSetting label={props.sizeUnit === '%' ? 'Width' : 'Height'} value={props.sizeUnit === '%' ? (props.logoWidth || props.width || 100) : (props.logoHeight || props.height || 48)} min={props.sizeUnit === '%' ? 10 : 16} max={props.sizeUnit === '%' ? 100 : 200} unit={props.sizeUnit === '%' ? '%' : 'px'} onChange={(value) => setProps(props.sizeUnit === '%' ? { logoWidth: value, width: value } : { logoHeight: value, height: value })} />
            <ToggleSetting label="Custom mobile size" checked={Boolean(props.customMobileSize)} onChange={(value) => setProps({ customMobileSize: value })} />
            {props.customMobileSize && <RangeSetting label="Mobile height" value={props.mobileHeight || 40} min={16} max={160} unit="px" onChange={(value) => setProps({ mobileHeight: value })} />}
          </SettingsSection>
          <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
          <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
    case 'button':
      return (
        <div style={contentStyle}>
          <SettingsSection title="Button">
            <TextSetting label="Label" value={props.label || ''} onChange={(value) => setProps({ label: value })} />
            <TextSetting label="Link" value={props.link || ''} onChange={(value) => setProps({ link: value })} placeholder="Choose a page or paste a URL" />
            <ToggleSetting label="Open link in new tab" checked={Boolean(props.openInNewTab)} onChange={(value) => setProps({ openInNewTab: value })} />
            <SelectSetting label="Style" value={props.variant || 'primary'} options={[{ label: 'Primary', value: 'primary' }, { label: 'Secondary', value: 'secondary' }, { label: 'Link', value: 'link' }, { label: 'Custom', value: 'custom' }]} onChange={(value) => setProps({ variant: value })} />
            {props.variant === 'custom' && <><ColorSetting label="Background color" value={props.buttonColor || '#2563eb'} onChange={(value) => setProps({ buttonColor: value })} /><ColorSetting label="Text color" value={props.buttonTextColor || '#ffffff'} onChange={(value) => setProps({ buttonTextColor: value })} /></>}
          </SettingsSection>
          <SettingsSection title="Size">
            <Segmented label="Desktop width" value={props.widthMode === 'custom' ? 'custom' : 'fit'} options={[{ label: 'Fit', value: 'fit' }, { label: 'Custom', value: 'custom' }]} onChange={(value) => setProps({ widthMode: value })} />
            {props.widthMode === 'custom' && <RangeSetting label="Desktop width" value={props.customWidth || 180} min={80} max={480} unit="px" onChange={(value) => setProps({ customWidth: value })} />}
            <Segmented label="Mobile width" value={props.mobileWidthMode || 'fit'} options={[{ label: 'Fit', value: 'fit' }, { label: 'Custom', value: 'custom' }]} onChange={(value) => setProps({ mobileWidthMode: value })} />
            {props.mobileWidthMode === 'custom' && <RangeSetting label="Mobile width" value={props.mobileCustomWidth || 180} min={80} max={480} unit="px" onChange={(value) => setProps({ mobileCustomWidth: value })} />}
          </SettingsSection>
          <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
          <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
    case 'link-list':
      return <MenuBlockSettings node={node} props={props} setProps={setProps} padding={padding} setPadding={setPadding} />;
    case 'policy-links':
      return (
        <div style={contentStyle}>
          <SettingsSection title="Policies">
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#667085' }}>This block displays the policies configured for your storefront. Manage policy content in store settings.</p>
          </SettingsSection>
          <SettingsSection title="Appearance">
            <ColorSetting label="Text color" value={props.color || '#475467'} onChange={(value) => setProps({ color: value })} />
            <SelectSetting label="Size" value={String(props.fontSize || 12)} options={['10', '12', '14', '16', '18'].map((value) => ({ label: `${value}px`, value }))} onChange={(value) => setProps({ fontSize: Number(value) })} />
            <Segmented label="Case" value={props.case || 'default'} options={[{ label: 'Default', value: 'default' }, { label: 'Uppercase', value: 'uppercase' }]} onChange={(value) => setProps({ case: value })} />
          </SettingsSection>
          <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
          <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
    case 'social-links':
      return (
        <div style={contentStyle}>
          <SettingsSection title="Appearance"><ColorSetting label="Color" value={props.color || '#667085'} onChange={(value) => setProps({ color: value })} /></SettingsSection>
          <SettingsSection title="Links"><SocialLinks platforms={props.platforms || []} setPlatforms={(platforms) => setProps({ platforms })} /></SettingsSection>
          <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
          <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
    case 'payment-icons':
      return (
        <div style={contentStyle}>
          <SettingsSection title="Layout">
            <SelectSetting label="Alignment" value={props.alignment || 'right'} options={[{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }, { label: 'Space between', value: 'space-between' }]} onChange={(value) => setProps({ alignment: value })} />
            <RangeSetting label="Gap" value={props.gap ?? 8} min={0} max={40} onChange={(value) => setProps({ gap: value })} />
          </SettingsSection>
          <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
          <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
    case 'copyright':
      return (
        <div style={contentStyle}>
          <SettingsSection title="Copyright">
            <ToggleSetting label="Show powered by BillionBiz" checked={Boolean(props.showPlatformCredit)} onChange={(value) => setProps({ showPlatformCredit: value })} />
          </SettingsSection>
          <SettingsSection title="Appearance">
            <ColorSetting label="Text color" value={props.color || '#667085'} onChange={(value) => setProps({ color: value })} />
            <SelectSetting label="Size" value={String(props.fontSize || 12)} options={['10', '12', '14', '16', '18'].map((value) => ({ label: `${value}px`, value }))} onChange={(value) => setProps({ fontSize: Number(value) })} />
            <Segmented label="Case" value={props.case || 'default'} options={[{ label: 'Default', value: 'default' }, { label: 'Uppercase', value: 'uppercase' }]} onChange={(value) => setProps({ case: value })} />
          </SettingsSection>
          <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
          <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
    case 'newsletter':
      return <EmailSignupSettings node={node} props={props} setProps={setProps} padding={padding} setPadding={setPadding} />;
    case 'image':
      return (
        <div style={contentStyle}>
          <SettingsSection title="Image">
            <ImageUploadSetting label="Upload images" value={props.src || ''} onChange={(value) => setProps({ src: value })} />
            <TextSetting label="Image URL" value={props.src || ''} onChange={(value) => setProps({ src: value })} placeholder="https://" />
            <TextSetting label="Alt text" value={props.alt || ''} onChange={(value) => setProps({ alt: value })} />
            <TextSetting label="Link" value={props.link || ''} onChange={(value) => setProps({ link: value })} placeholder="Choose a page or paste a URL" />
            {props.link && <ToggleSetting label="Open link in new tab" checked={Boolean(props.openInNewTab)} onChange={(value) => setProps({ openInNewTab: value })} />}
          </SettingsSection>
          <SettingsSection title="Size">
            <SelectSetting label="Aspect ratio" value={props.aspectRatio || 'auto'} options={[{ label: 'Auto', value: 'auto' }, { label: 'Portrait', value: 'portrait' }, { label: 'Square', value: 'square' }, { label: 'Landscape', value: 'landscape' }]} onChange={(value) => setProps({ aspectRatio: value })} />
            <SizingSetting label="Desktop width" value={{ mode: props.widthMode || 'fill', value: props.customWidth, unit: 'px' }} onChange={(value) => setProps({ widthMode: value.mode, customWidth: value.value })} />
            <SizingSetting label="Mobile width" value={{ mode: props.mobileWidthMode || props.widthMode || 'fill', value: props.mobileCustomWidth ?? props.customWidth, unit: 'px' }} onChange={(value) => setProps({ mobileWidthMode: value.mode, mobileCustomWidth: value.value })} />
            <Segmented label="Height" value={props.heightMode || 'fit'} options={[{ label: 'Fit', value: 'fit' }, { label: 'Fill', value: 'fill' }]} onChange={(value) => setProps({ heightMode: value })} />
          </SettingsSection>
          <SettingsSection title="Borders">
            <Segmented label="Style" value={props.borderStyle === 'solid' ? 'solid' : 'none'} options={[{ label: 'None', value: 'none' }, { label: 'Solid', value: 'solid' }]} onChange={(value) => setProps({ borderStyle: value, borderWidth: value === 'solid' ? (props.borderWidth || 1) : 0 })} />
            {props.borderStyle === 'solid' && <RangeSetting label="Corner radius" value={props.borderRadius || 0} min={0} max={64} unit="px" onChange={(value) => setProps({ borderRadius: value })} />}
          </SettingsSection>
          <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
          <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
    case 'icon':
      return (
        <div style={contentStyle}>
          <SettingsSection title="Icon">
            <SelectSetting label="Icon" value={String(props.iconName || 'star').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')} options={shopifyIconOptions} onChange={(value) => setProps({ iconName: value })} />
            <ImageUploadSetting label="Image icon" value={props.imageUrl || ''} onChange={(value) => setProps({ imageUrl: value, image: value, iconType: value ? 'image' : 'icon' })} />
            <TextSetting label="Image URL" value={props.imageUrl || ''} onChange={(value) => setProps({ imageUrl: value, image: value, iconType: value ? 'image' : 'icon' })} placeholder="https://" />
            <RangeSetting label="Width" value={props.size || 24} min={12} max={100} unit="px" onChange={(value) => setProps({ size: value })} />
            <TextSetting label="Link" value={props.link || ''} onChange={(value) => setProps({ link: value })} placeholder="Choose a page or paste a URL" />
            {props.link && <ToggleSetting label="Open link in new tab" checked={Boolean(props.openInNewTab)} onChange={(value) => setProps({ openInNewTab: value })} />}
            <ColorSetting label="Color" value={props.color || '#111827'} onChange={(value) => setProps({ color: value })} />
            {props.imageUrl && <TextSetting label="Alt text" value={props.alt || ''} onChange={(value) => setProps({ alt: value })} />}
          </SettingsSection>
          <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
          <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
    case 'divider':
      return (
        <div style={contentStyle}>
          <SettingsSection title="Divider">
            <RangeSetting label="Thickness" value={props.thickness || 1} min={1} max={12} unit="px" onChange={(value) => setProps({ thickness: value })} />
            <ColorSetting label="Color" value={props.color || '#d0d5dd'} onChange={(value) => setProps({ color: value })} />
            <RangeSetting label="Length" value={props.length ?? 100} min={10} max={100} unit="%" onChange={(value) => setProps({ length: value })} />
          </SettingsSection>
          <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
          <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
    default:
      return (
        <div style={contentStyle}>
          <SettingsSection title="Content">
            <TextSetting label="Text" value={props.text || ''} onChange={(value) => setProps({ text: value })} />
            <p style={{ margin: 0, color: '#667085', fontSize: 12 }}>This block type is outside the standard Shopify footer block set.</p>
          </SettingsSection>
        <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
        <BlockResponsiveSettings node={node} props={props} padding={padding} />
        </div>
      );
  }
};

const TextBlockSettings: React.FC<{ node: FooterTreeNode; props: Record<string, any>; setProps: (updates: Record<string, unknown>) => void; padding: Sides; setPadding: (padding: Sides) => void }> = ({ node, props, setProps, padding, setPadding }) => (
  <div style={contentStyle}>
    <SettingsSection title={node.nodeType === 'heading' ? 'Heading' : 'Text'}>
      <RichTextSetting label="Text" value={props.text || ''} onChange={(value) => setProps({ text: value })} />
    </SettingsSection>
    <SettingsSection title="Layout">
      <Segmented label="Width" value={props.widthMode || 'fit'} options={[{ label: 'Fit', value: 'fit' }, { label: 'Fill', value: 'fill' }]} onChange={(value) => setProps({ widthMode: value })} />
      <SelectSetting label="Max width" value={props.maxWidth || 'normal'} options={[{ label: 'Narrow', value: 'narrow' }, { label: 'Normal', value: 'normal' }, { label: 'None', value: 'none' }]} onChange={(value) => setProps({ maxWidth: value })} />
    </SettingsSection>
    <SettingsSection title="Typography">
      <SelectSetting label="Preset" value={props.typographyPreset || 'default'} options={[{ label: 'Default', value: 'default' }, { label: 'Paragraph', value: 'paragraph' }, ...[1, 2, 3, 4, 5, 6].map((level) => ({ label: `Heading ${level}`, value: `h${level}` })), { label: 'Custom', value: 'custom' }]} onChange={(value) => setProps({ typographyPreset: value, ...(node.nodeType === 'heading' && /^h[1-6]$/.test(value) ? { level: value } : {}) })} />
      {props.typographyPreset === 'custom' && <RangeSetting label="Font size" value={props.fontSize || 16} min={10} max={48} unit="px" onChange={(value) => setProps({ fontSize: value })} />}
    </SettingsSection>
    <SettingsSection title="Appearance">
      <ColorSetting label="Text color" value={props.color || '#111827'} onChange={(value) => setProps({ color: value })} />
    </SettingsSection>
    <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
    <BlockResponsiveSettings node={node} props={props} padding={padding} />
  </div>
);

const MenuBlockSettings: React.FC<{ node: FooterTreeNode; props: Record<string, any>; setProps: (updates: Record<string, unknown>) => void; padding: Sides; setPadding: (padding: Sides) => void }> = ({ node, props, setProps, padding, setPadding }) => (
  <div style={contentStyle}>
    <SettingsSection title="Menu">
      <SelectSetting label="Menu" value={props.menuName || 'main'} options={[{ label: 'Main menu', value: 'main' }, { label: 'Footer menu', value: 'footer' }, { label: 'Customer care', value: 'customer-care' }]} onChange={(value) => {
        const menuLinks: Record<string, Array<{ label: string; href: string }>> = {
          main: [{ label: 'Home', href: '/' }, { label: 'Shop all', href: '/collections/all' }, { label: 'Contact', href: '/pages/contact' }],
          footer: [{ label: 'Search', href: '/search' }, { label: 'About us', href: '/pages/about' }, { label: 'Contact', href: '/pages/contact' }],
          'customer-care': [{ label: 'Contact us', href: '/pages/contact' }, { label: 'Shipping & returns', href: '/pages/shipping' }, { label: 'FAQs', href: '/pages/faq' }],
        };
        setProps({ menuName: value, links: menuLinks[value] });
      }} />
      <TextSetting label="Heading" value={props.heading || ''} onChange={(value) => setProps({ heading: value })} />
    </SettingsSection>
    <SettingsSection title="Appearance">
      <RangeSetting label="Vertical gap" value={props.verticalGap ?? props.gap ?? 12} min={0} max={48} onChange={(value) => setProps({ verticalGap: value, gap: value })} />
      <ToggleSetting label="Show as accordion on mobile" checked={props.accordionOnMobileCustomized ? props.accordionOnMobile !== false : true} onChange={(value) => setProps({ accordionOnMobile: value, accordionOnMobileCustomized: true })} />
      <ColorSetting label="Background color" value={props.backgroundColor || '#ffffff'} onChange={(value) => setProps({ backgroundColor: value })} />
      <ColorSetting label="Text color" value={props.color || '#111827'} onChange={(value) => setProps({ color: value })} />
    </SettingsSection>
    <SettingsSection title="Typography">
      <SelectSetting label="Heading preset" value={props.headingPreset || 'h3'} options={typographyOptions} onChange={(value) => setProps({ headingPreset: value })} />
      <SelectSetting label="Link preset" value={props.linkPreset || 'paragraph'} options={typographyOptions} onChange={(value) => setProps({ linkPreset: value })} />
    </SettingsSection>
    <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
    <BlockResponsiveSettings node={node} props={props} padding={padding} />
  </div>
);

const EmailSignupSettings: React.FC<{ node: FooterTreeNode; props: Record<string, any>; setProps: (updates: Record<string, unknown>) => void; padding: Sides; setPadding: (padding: Sides) => void }> = ({ node, props, setProps, padding, setPadding }) => (
  <div style={contentStyle}>
    <p style={{ margin: 0, color: '#667085', fontSize: 12 }}>Email signups are added to your customer profiles.</p>
    <SettingsSection title="Size">
      <Segmented label="Width" value={props.widthMode || 'fill'} options={[{ label: 'Fill', value: 'fill' }, { label: 'Custom', value: 'custom' }]} onChange={(value) => setProps({ widthMode: value })} />
      {props.widthMode === 'custom' && <RangeSetting label="Custom width" value={props.customWidth || 420} min={160} max={900} unit="px" onChange={(value) => setProps({ customWidth: value })} />}
    </SettingsSection>
    <SettingsSection title="Heading">
      <TextSetting label="Text" value={props.heading || ''} onChange={(value) => setProps({ heading: value })} />
      <ColorSetting label="Color" value={props.headingColor || '#111827'} onChange={(value) => setProps({ headingColor: value })} />
      <SelectSetting label="Text preset" value={props.headingPreset || 'h3'} options={typographyOptions} onChange={(value) => setProps({ headingPreset: value })} />
      <TextSetting label="Description" value={props.description || ''} onChange={(value) => setProps({ description: value })} multiline />
    </SettingsSection>
    <SettingsSection title="Input">
      <SelectSetting label="Border" value={props.inputBorder || 'all'} options={[{ label: 'All', value: 'all' }, { label: 'Underline', value: 'underline' }, { label: 'None', value: 'none' }]} onChange={(value) => setProps({ inputBorder: value })} />
      <Segmented label="Style" value={props.inputStyle || 'default'} options={[{ label: 'Default', value: 'default' }, { label: 'Custom', value: 'custom' }]} onChange={(value) => setProps({ inputStyle: value })} />
      {props.inputStyle === 'custom' && (
        <>
          <RangeSetting label="Border thickness" value={props.inputBorderThickness || 1} min={0} max={8} unit="px" onChange={(value) => setProps({ inputBorderThickness: value })} />
          <RangeSetting label="Corner radius" value={props.inputRadius ?? 100} min={0} max={100} unit="px" onChange={(value) => setProps({ inputRadius: value })} />
          <ColorSetting label="Background" value={props.inputBackground || '#ffffff'} onChange={(value) => setProps({ inputBackground: value })} />
          <ColorSetting label="Text" value={props.inputColor || '#111827'} onChange={(value) => setProps({ inputColor: value })} />
          <ColorSetting label="Borders" value={props.inputBorderColor || '#d0d5dd'} onChange={(value) => setProps({ inputBorderColor: value })} />
        </>
      )}
      <SelectSetting label="Text preset" value={props.inputTextPreset || 'paragraph'} options={typographyOptions} onChange={(value) => setProps({ inputTextPreset: value })} />
      <TextSetting label="Placeholder" value={props.placeholder || 'Enter your email...'} onChange={(value) => setProps({ placeholder: value })} />
    </SettingsSection>
    <SettingsSection title="Submit button">
      <SelectSetting label="Style" value={props.buttonStyle || 'link'} options={[{ label: 'Primary', value: 'primary' }, { label: 'Secondary', value: 'secondary' }, { label: 'Link', value: 'link' }, { label: 'Custom', value: 'custom' }]} onChange={(value) => setProps({ buttonStyle: value })} />
      {props.buttonStyle === 'link' && <ColorSetting label="Link text color" value={props.buttonColor || '#111827'} onChange={(value) => setProps({ buttonColor: value })} />}
      {props.buttonStyle === 'custom' && <><ColorSetting label="Background color" value={props.buttonBackground || '#111827'} onChange={(value) => setProps({ buttonBackground: value })} /><ColorSetting label="Text color" value={props.buttonTextColor || '#ffffff'} onChange={(value) => setProps({ buttonTextColor: value })} /></>}
      <Segmented label="Display" value={props.buttonDisplay || 'arrow'} options={[{ label: 'Text', value: 'text' }, { label: 'Arrow', value: 'arrow' }]} onChange={(value) => setProps({ buttonDisplay: value })} />
      {props.buttonDisplay === 'text' && <TextSetting label="Button text" value={props.buttonText || 'Subscribe'} onChange={(value) => setProps({ buttonText: value })} />}
      <ToggleSetting label="Integrated button" checked={props.integratedButton !== false} onChange={(value) => setProps({ integratedButton: value })} />
    </SettingsSection>
    <SettingsSection title="Padding"><PaddingSettings value={padding} onChange={setPadding} /></SettingsSection>
    <BlockResponsiveSettings node={node} props={props} padding={padding} />
  </div>
);

const typographyOptions: Option[] = [
  { label: 'Default', value: 'default' },
  { label: 'Paragraph', value: 'paragraph' },
  ...[1, 2, 3, 4, 5, 6].map((level) => ({ label: `Heading ${level}`, value: `h${level}` })),
];

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 14, borderTop: '1px solid #e4e7ec' }}>
    <h4 style={{ margin: 0, color: '#202223', fontSize: 13, fontWeight: 600 }}>{title}</h4>
    {children}
  </section>
);

const TextSetting: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string; multiline?: boolean }> = ({ label, value, onChange, placeholder, multiline }) => (
  <label style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    {multiline ? <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }} /> : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />}
  </label>
);

const RichTextSetting: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => {
  const editorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor || editor.contains(document.activeElement)) return;
    const nextHtml = footerTextForEditor(value);
    if (editor.innerHTML !== nextHtml) editor.innerHTML = nextHtml;
  }, [value]);

  const runCommand = (command: string, argument?: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, argument);
    onChange(sanitizeFooterRichText(editor.innerHTML));
  };

  const toolbarButton: React.CSSProperties = {
    width: 30, height: 28, border: '1px solid transparent', borderRadius: 4,
    background: '#fff', color: '#344054', fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
  };

  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, padding: 4, border: '1px solid #cfd4dc', borderBottom: 0, borderRadius: '6px 6px 0 0', background: '#f9fafb' }} role="toolbar" aria-label="Text formatting">
        <select aria-label="Text style" defaultValue="p" onChange={(event) => runCommand('formatBlock', event.target.value)} style={{ ...inputStyle, width: 132, padding: '5px 7px', fontSize: 12 }}>
          <option value="p">Paragraph</option>
          {[1, 2, 3, 4, 5, 6].map((level) => <option key={level} value={`h${level}`}>Heading {level}</option>)}
        </select>
        <button type="button" title="Bold" aria-label="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('bold')} style={toolbarButton}><strong>B</strong></button>
        <button type="button" title="Italic" aria-label="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('italic')} style={{ ...toolbarButton, fontStyle: 'italic' }}>I</button>
        <button type="button" title="Insert link" aria-label="Insert link" onMouseDown={(event) => event.preventDefault()} onClick={() => { const url = window.prompt('Enter a link URL'); if (url) runCommand('createLink', url); }} style={toolbarButton}>↗</button>
        <button type="button" title="Bulleted list" aria-label="Bulleted list" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('insertUnorderedList')} style={toolbarButton}>•≡</button>
        <button type="button" title="Numbered list" aria-label="Numbered list" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('insertOrderedList')} style={toolbarButton}>1≡</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        onInput={(event) => onChange(sanitizeFooterRichText(event.currentTarget.innerHTML))}
        style={{ ...inputStyle, minHeight: 88, borderRadius: '0 0 6px 6px', outline: 'none', lineHeight: 1.5, overflowWrap: 'anywhere' }}
      />
    </div>
  );
};

const SelectSetting: React.FC<{ label: string; value: string; options: Option[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle}>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
);

const ImageUploadSetting: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Choose an image file.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 58, padding: 8, border: '1px solid #d0d5dd', borderRadius: 6, background: '#fff' }}>
        <div style={{ width: 46, height: 42, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #eaecf0', borderRadius: 4, background: '#f9fafb', color: '#98a2b3', fontSize: 10 }}>
          {value ? <img src={value} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : 'No image'}
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minWidth: 0 }}>
          <button type="button" onClick={() => inputRef.current?.click()} style={{ padding: '7px 10px', border: '1px solid #cfd4dc', borderRadius: 5, background: '#fff', color: '#202223', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Upload image</button>
          {value && <button type="button" onClick={() => onChange('')} style={{ padding: '5px 3px', border: 0, background: 'transparent', color: '#b42318', fontSize: 12, cursor: 'pointer' }}>Remove</button>}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} aria-label={`Upload ${label.toLowerCase()}`} />
      </div>
    </div>
  );
};

const Segmented: React.FC<{ label: string; value: string; options: Option[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <div style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`, gap: 4, padding: 3, border: '1px solid #d0d5dd', borderRadius: 8, background: '#f9fafb' }}>
      {options.map((option) => (
        <button key={option.value} type="button" onClick={() => onChange(option.value)} style={{ minWidth: 0, padding: '7px 5px', border: value === option.value ? '1px solid #aab4c0' : '1px solid transparent', borderRadius: 6, background: value === option.value ? '#fff' : 'transparent', color: value === option.value ? '#202223' : '#667085', fontSize: 12, fontWeight: value === option.value ? 600 : 500, cursor: 'pointer' }}>
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const RangeSetting: React.FC<{ label: string; value: number; min: number; max: number; unit?: string; onChange: (value: number) => void }> = ({ label, value, min, max, unit = 'px', onChange }) => (
  <label style={rowStyle}>
    <span style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between', marginBottom: 0 }}><span>{label}</span><span style={{ color: '#344054', fontWeight: 600 }}>{value}{unit}</span></span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <input type="range" min={min} max={max} value={Math.max(min, Math.min(max, Number(value) || 0))} onChange={(event) => onChange(Number(event.target.value))} style={{ flex: 1, minWidth: 0, accentColor: '#2563eb' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 82, flexShrink: 0 }}>
        <input type="number" min={min} max={max} step={1} value={value} onChange={(event) => onChange(Math.max(min, Math.min(max, Number(event.target.value) || 0)))} style={{ ...inputStyle, padding: '6px 7px' }} aria-label={`${label} value`} />
        <span style={{ color: '#667085', fontSize: 11 }}>{unit}</span>
      </div>
    </div>
  </label>
);

const ColorSetting: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <label style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', border: '1px solid #cfd4dc', borderRadius: 6 }}>
      <input type="color" value={value || '#ffffff'} onChange={(event) => onChange(event.target.value)} aria-label={label} style={{ width: 20, height: 20, padding: 0, border: 0, background: 'none', cursor: 'pointer' }} />
      <span style={{ color: '#344054', fontSize: 12, flex: 1 }}>{value || 'Theme color'}</span>
      {value && <button type="button" onClick={() => onChange('')} style={{ padding: 0, border: 0, color: '#667085', background: 'none', fontSize: 11, cursor: 'pointer' }}>Reset</button>}
    </span>
  </label>
);

const ColorCodeSetting: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <label style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', border: '1px solid #cfd4dc', borderRadius: 6 }}>
      <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#ffffff'} onChange={(event) => onChange(event.target.value)} aria-label={`${label} picker`} style={{ width: 22, height: 22, padding: 0, border: 0, background: 'none', cursor: 'pointer' }} />
      <input value={value} onChange={(event) => onChange(event.target.value)} aria-label={`${label} code`} placeholder="#ffffff" style={{ ...inputStyle, border: 0, padding: '3px 0', fontFamily: 'monospace' }} />
    </span>
  </label>
);

const ToggleSetting: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, color: '#344054', fontSize: 12 }}>
    <span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ width: 16, height: 16, accentColor: '#2563eb' }} />
  </label>
);

const SizingSetting: React.FC<{ label: string; value: Sizing; onChange: (value: Sizing) => void }> = ({ label, value, onChange }) => (
  <div style={rowStyle}>
    <span style={labelStyle}>{label}</span>
    <Segmented label="" value={value.mode} options={[{ label: 'Fit', value: 'fit' }, { label: 'Fill', value: 'fill' }, { label: 'Custom', value: 'custom' }]} onChange={(mode) => onChange({ ...value, mode: mode as Sizing['mode'] })} />
    {value.mode === 'custom' && <div style={{ display: 'flex', gap: 6 }}><input type="number" min={0} value={value.value || 100} onChange={(event) => onChange({ ...value, value: Number(event.target.value) })} style={inputStyle} /><select value={value.unit || '%'} onChange={(event) => onChange({ ...value, unit: event.target.value as Sizing['unit'] })} style={{ ...inputStyle, width: 82 }}><option value="%">%</option><option value="px">px</option></select></div>}
  </div>
);

const PaddingSettings: React.FC<{ value: Sides; onChange: (value: Sides) => void }> = ({ value, onChange }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
    {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
      <label key={side} style={rowStyle}>
        <span style={{ ...labelStyle, textTransform: 'capitalize' }}>{side}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="number" min={0} value={value[side]} onChange={(event) => onChange({ ...value, [side]: Math.max(0, Number(event.target.value)) })} style={inputStyle} />
          <span style={{ color: '#667085', fontSize: 11 }}>px</span>
        </div>
      </label>
    ))}
  </div>
);

const BlockResponsiveSettings: React.FC<{ node: FooterTreeNode; props: Record<string, any>; padding: Sides }> = ({ node, props, padding }) => {
  const updateFooterTreeNodeResponsive = useEditorContextStore((state) => state.updateFooterTreeNodeResponsive);
  const [breakpoint, setBreakpoint] = React.useState<'desktop' | 'tablet' | 'mobile'>('mobile');
  const current = node.responsive?.[breakpoint] || {};
  const update = (updates: Record<string, unknown>) => updateFooterTreeNodeResponsive(node.id, {
    [breakpoint]: { ...current, ...updates },
  });
  const responsivePadding: Sides = { ...padding, ...(current.padding || {}) };
  const naturalFit = ['heading', 'text', 'copyright', 'payment-icons', 'button', 'social-links', 'logo', 'icon', 'trust-badge', 'app-download', 'localization'].includes(node.nodeType);
  const baseWidthMode = breakpoint === 'mobile'
    ? props.mobileWidthMode || props.widthMode || (naturalFit ? 'fit' : 'fill')
    : props.widthMode || (naturalFit ? 'fit' : 'fill');
  const baseWidth: Sizing = current.width || {
    mode: baseWidthMode,
    value: breakpoint === 'mobile' ? props.mobileCustomWidth ?? props.customWidth : props.customWidth,
    unit: 'px',
  };
  const baseHeight: Sizing = current.height || { mode: props.heightMode || 'fit', value: props.mobileHeight || props.height, unit: 'px' };

  return (
    <SettingsSection title="Responsive">
      <Segmented label="Edit breakpoint" value={breakpoint} options={[{ label: 'Desktop', value: 'desktop' }, { label: 'Tablet', value: 'tablet' }, { label: 'Mobile', value: 'mobile' }]} onChange={(value) => setBreakpoint(value as 'desktop' | 'tablet' | 'mobile')} />
      <ToggleSetting label="Show on this device" checked={current.visible !== false} onChange={(value) => update({ visible: value })} />
      <SizingSetting label="Width" value={baseWidth} onChange={(value) => update({ width: value })} />
      <SizingSetting label="Height" value={baseHeight} onChange={(value) => update({ height: value })} />
      <PaddingSettings value={responsivePadding} onChange={(value) => update({ padding: value })} />
    </SettingsSection>
  );
};

const SocialLinks: React.FC<{ platforms: Array<{ platform: string; url?: string; enabled?: boolean }>; setPlatforms: (platforms: Array<{ platform: string; url?: string; enabled?: boolean }>) => void }> = ({ platforms, setPlatforms }) => {
  const supported = ['facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'threads', 'linkedin', 'bluesky', 'snapchat', 'pinterest', 'tumblr', 'vimeo', 'spotify', 'whatsapp', 'custom'];
  const labels: Record<string, string> = { twitter: 'X (Twitter)', custom: 'Custom link' };
  const current = supported.map((platform) => platforms.find((item) => item.platform.toLowerCase() === platform) || { platform, url: '', enabled: false });
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
    {current.map((item) => (
      <div key={item.platform} style={{ display: 'grid', gridTemplateColumns: '82px 1fr', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#475467', fontSize: 12 }}>{labels[item.platform] || item.platform[0].toUpperCase() + item.platform.slice(1)}</span>
        <input value={item.url || ''} onChange={(event) => setPlatforms(current.map((entry) => entry.platform === item.platform ? { ...entry, url: event.target.value, enabled: Boolean(event.target.value) } : entry))} placeholder="https://" style={inputStyle} />
      </div>
    ))}
  </div>;
};

