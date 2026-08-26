import React from 'react';

const FeaturedCollectionSection: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const { device } = props;
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';

  const heading = props.heading || 'Featured Collection';
  const linkText = props.linkText || 'View all';
  const columns = props.columns || 4;
  
  const displayColumns = isMobile ? 1 : (isTablet ? Math.min(2, columns) : columns);

  const products = props.products || [
    { name: 'Artisan Ceramic Vase', price: '$89.00', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop' },
    { name: 'Handwoven Throw', price: '$129.00', image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&h=400&fit=crop' },
    { name: 'Oak Side Table', price: '$249.00', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
    { name: 'Linen Cushion Set', price: '$67.00', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop' },
  ];

  return (
    <section style={{ padding: isMobile ? '40px 24px' : '80px 48px', backgroundColor: 'var(--theme-background)' }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: '40px', gap: isMobile ? '16px' : '0' }}>
        <h2 style={{
          fontSize: isMobile ? '32px' : '40px',
          fontWeight: 700,
          letterSpacing: '-1px',
          color: 'var(--theme-text)',
          fontFamily: 'var(--theme-font-heading), sans-serif',
        }}>
          {heading}
        </h2>
        <a href="#" style={{ color: 'var(--theme-primary)', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
          {linkText} →
        </a>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${displayColumns}, 1fr)`,
        gap: isMobile ? '32px' : '24px',
      }}>
        {products.map((product: any, i: number) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            cursor: 'pointer',
          }}>
            <div style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#f1f5f9',
              position: 'relative',
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
              />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--theme-text)', marginBottom: '4px' }}>
                {product.name}
              </h4>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--theme-primary)' }}>
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollectionSection;
