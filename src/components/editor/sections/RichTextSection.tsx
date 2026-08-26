import React from 'react';

const RichTextSection: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const { device } = props;
  const isMobile = device === 'mobile';

  const heading = props.heading || 'Our Mission';
  const body = props.body || 'We believe in creating products that are both beautiful and functional. Our team of designers and engineers work together to push the boundaries of what\'s possible, crafting experiences that delight and inspire.';
  const alignment = props.alignment || 'center';
  const bgColor = props.bgColor || 'var(--theme-bg)';

  return (
    <section style={{
      padding: isMobile ? '40px 24px' : '80px 48px',
      backgroundColor: bgColor,
      textAlign: alignment as any,
    }}>
      <div style={{ maxWidth: '800px', margin: alignment === 'center' ? '0 auto' : '0' }}>
        <h2 style={{
          fontSize: isMobile ? '32px' : '40px',
          fontWeight: 700,
          letterSpacing: '-1px',
          color: 'var(--theme-text)',
          marginBottom: '24px',
          lineHeight: 1.2,
          fontFamily: 'var(--theme-font, "Outfit"), sans-serif',
        }}>
          {heading}
        </h2>
        <p style={{
          fontSize: isMobile ? '16px' : '18px',
          lineHeight: 1.8,
          color: 'var(--theme-text)',
          opacity: 0.7,
        }}>
          {body}
        </p>
      </div>
    </section>
  );
};

export default RichTextSection;
