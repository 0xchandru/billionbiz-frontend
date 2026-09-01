import type { SectionConfig } from './types';

export const announcementBarConfig: SectionConfig = {
  type: 'AnnouncementBar',
  name: 'Announcement Bar',
  category: 'header',
  description: 'Display an important message at the top of your site.',
  layouts: [
    { id: 'single', label: 'Single Message', description: 'A single static announcement' },
    { id: 'marquee', label: 'Marquee', description: 'Scrolling text animation' },
    { id: 'carousel', label: 'Carousel', description: 'Multiple messages sliding' },
    { id: 'with-cta', label: 'With Button', description: 'Message alongside a button' },
  ],
  getTabs: (_selectedLayout = 'single') => {
    return [
      {
        id: 'content',
        label: 'Content',
        groups: [
          {
            id: 'messages',
            label: 'Announcements',
            fields: [
              {
                key: 'text',
                label: 'Message',
                type: 'text',
                defaultValue: 'Free shipping on all orders over $50!',
                showWhen: { field: 'selectedLayout', value: ['single', 'marquee', 'with-cta'] },
              },
              {
                key: 'messages',
                label: 'Multiple Messages',
                type: 'list',
                isStringList: true,
                addLabel: 'Add Message',
                defaultValue: ['Free shipping over $50', 'Save 20% with code WINTER20'],
                showWhen: { field: 'selectedLayout', value: 'carousel' },
              },
              {
                key: 'link',
                label: 'Link',
                type: 'url',
                showWhen: { field: 'selectedLayout', value: ['single', 'marquee'] },
              },
              {
                key: 'buttonText',
                label: 'Button Text',
                type: 'text',
                defaultValue: 'Shop Now',
                showWhen: { field: 'selectedLayout', value: 'with-cta' },
              },
              {
                key: 'buttonLink',
                label: 'Button Link',
                type: 'url',
                showWhen: { field: 'selectedLayout', value: 'with-cta' },
              },
            ],
          },
          {
            id: 'settings',
            label: 'Behavior',
            showWhen: { field: 'selectedLayout', value: ['marquee', 'carousel'] },
            fields: [
              {
                key: 'speed',
                label: 'Animation Speed',
                type: 'slider',
                min: 1,
                max: 20,
                step: 1,
                defaultValue: 5,
                unit: 's',
                showWhen: { field: 'selectedLayout', value: 'marquee' },
              },
              {
                key: 'autoPlaySpeed',
                label: 'Autoplay Speed',
                type: 'slider',
                min: 2,
                max: 10,
                step: 1,
                defaultValue: 3,
                unit: 's',
                showWhen: { field: 'selectedLayout', value: 'carousel' },
              },
              {
                key: 'pauseOnHover',
                label: 'Pause on hover',
                type: 'toggle',
                defaultValue: true,
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
                defaultValue: 'var(--theme-secondary)',
              },
              {
                key: 'textColor',
                label: 'Text Color',
                type: 'color',
                defaultValue: '#ffffff',
              },
            ],
          },
          {
            id: 'typography',
            label: 'Typography',
            fields: [
              {
                key: 'fontSize',
                label: 'Font Size',
                type: 'segmented',
                options: [
                  { label: 'Small', value: '12px' },
                  { label: 'Medium', value: '14px' },
                  { label: 'Large', value: '16px' },
                ],
                defaultValue: '14px',
              },
              {
                key: 'textAlign',
                label: 'Alignment',
                type: 'segmented',
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'right' },
                ],
                defaultValue: 'center',
                showWhen: { field: 'selectedLayout', value: ['single', 'with-cta'] },
              },
            ],
          },
        ],
      },
    ];
  },
  defaultProps: {
    selectedLayout: 'single',
    text: 'Free shipping on all orders over $50!',
    bgColor: 'var(--theme-secondary)',
    textColor: '#ffffff',
    fontSize: '14px',
    textAlign: 'center',
  },
};
