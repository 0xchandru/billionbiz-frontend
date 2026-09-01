import type { SectionConfig } from './types';

export const heroBannerConfig: SectionConfig = {
  type: 'HeroBanner',
  name: 'Hero Banner',
  category: 'hero',
  description: 'A large banner to introduce your site or current promotion.',
  layouts: [
    { id: 'left', label: 'Split Left', description: 'Text on left, image on right' },
    { id: 'right', label: 'Split Right', description: 'Image on left, text on right' },
    { id: 'center', label: 'Centered', description: 'Text centered over image or color' },
  ],
  getTabs: (_selectedLayout = 'left') => {
    return [
      {
        id: 'content',
        label: 'Content',
        groups: [
          {
            id: 'text',
            label: 'Text Content',
            fields: [
              {
                key: 'badge',
                label: 'Badge Text',
                type: 'text',
                defaultValue: 'New Arrival',
              },
              {
                key: 'heading',
                label: 'Heading',
                type: 'textarea',
                defaultValue: 'Elevate Your Creative Workflow',
              },
              {
                key: 'description',
                label: 'Description',
                type: 'textarea',
                defaultValue: 'Discover the tools that empower professionals to build stunning digital experiences with ease.',
              },
            ],
          },
          {
            id: 'buttons',
            label: 'Buttons',
            fields: [
              {
                key: 'primaryBtn',
                label: 'Primary Button Text',
                type: 'text',
                defaultValue: 'Start Building Now',
              },
              {
                key: 'primaryBtnLink',
                label: 'Primary Button Link',
                type: 'url',
              },
              {
                key: 'secondaryBtn',
                label: 'Secondary Button Text',
                type: 'text',
                defaultValue: 'Explore Templates',
              },
              {
                key: 'secondaryBtnLink',
                label: 'Secondary Button Link',
                type: 'url',
              },
            ],
          },
          {
            id: 'media',
            label: 'Media',
            fields: [
              {
                key: 'image',
                label: 'Image',
                type: 'image',
                defaultValue: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=1000&fit=crop',
              },
            ],
          },
        ],
      },
      {
        id: 'design',
        label: 'Design',
        groups: [
          {
            id: 'colors',
            label: 'Colors',
            fields: [
              {
                key: 'bgColor',
                label: 'Background Color',
                type: 'color',
                defaultValue: 'var(--theme-background)',
              },
            ],
          },
        ],
      },
    ];
  },
  defaultProps: {
    selectedLayout: 'left',
    badge: 'New Arrival',
    heading: 'Elevate Your Creative Workflow',
    description: 'Discover the tools that empower professionals to build stunning digital experiences with ease.',
    primaryBtn: 'Start Building Now',
    secondaryBtn: 'Explore Templates',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=1000&fit=crop',
    bgColor: 'var(--theme-background)',
  },
};
