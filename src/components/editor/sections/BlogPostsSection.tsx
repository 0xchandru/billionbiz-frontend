import React from 'react';

const BlogPostsSection: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const { device } = props;
  const isMobile = device === 'mobile';

  const heading = props.heading || 'Latest from Our Blog';
  const posts = props.posts || [
    { title: '10 Tips for Styling Your Living Room', excerpt: 'Discover our expert interior design tips to transform your living room into a cozy and stylish retreat.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop', date: 'Dec 15, 2025' },
    { title: 'The Art of Sustainable Living', excerpt: 'Learn how to make eco-friendly choices without compromising on style or quality in your home.', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', date: 'Dec 10, 2025' },
    { title: 'Color Trends for the New Year', excerpt: 'From earthy terracottas to soft sage greens, explore the colors that will define home decor this year.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop', date: 'Dec 5, 2025' },
  ];

  return (
    <section style={{ 
      width: '100%', 
      backgroundColor: 'var(--theme-background)',
      position: 'relative',
      overflow: 'hidden',
      ...(props._marginStyle || {}),
    }}>
      <div style={{
        padding: isMobile ? '40px 24px' : '80px 48px',
        maxWidth: props._layoutWidth || '100%',
        margin: '0 auto',
        ...(props._paddingStyle || {}),
      }}>
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
          View all articles →
        </a>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${isMobile ? 1 : Math.min(posts.length, 3)}, 1fr)`,
        gap: '32px',
      }}>
        {posts.map((post: any, i: number) => (
          <article key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            transition: 'box-shadow 0.2s',
          }}>
            <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
              <img
                src={post.image}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
              />
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--theme-primary)', fontWeight: 600 }}>
                {post.date}
              </span>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--theme-text)',
                lineHeight: 1.3,
              }}>
                {post.title}
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--theme-text)',
                opacity: 0.6,
              }}>
                {post.excerpt}
              </p>
              <a href="#" style={{
                color: 'var(--theme-primary)',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                marginTop: '4px',
              }}>
                Read more →
              </a>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
};

export default BlogPostsSection;
