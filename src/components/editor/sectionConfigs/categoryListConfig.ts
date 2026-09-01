import type { SectionConfig } from './types';

export const categoryListConfig: SectionConfig = {
  type: 'CategoryList',
  name: 'Category List',
  category: 'commerce',
  description: 'Display a list of product categories.',
  layouts: [
    { id: 'grid', label: 'Grid', description: 'Categories in a grid' },
    { id: 'carousel', label: 'Carousel', description: 'Scrollable list of categories' },
  ],
  getTabs: (_selectedLayout = 'grid') => {
    return [
      {
        id: 'content',
        label: 'Content',
        groups: [
          {
            id: 'heading',
            label: 'Heading',
            fields: [
              {
                key: 'heading',
                label: 'Heading Text',
                type: 'text',
                defaultValue: 'Shop by Category',
              },
            ],
          },
          {
            id: 'categories',
            label: 'Categories',
            fields: [
              {
                key: 'categories',
                label: 'Categories',
                type: 'list',
                addLabel: 'Add Category',
                itemLabel: (item: any) => item.name || 'Category',
                defaultItem: {
                  name: 'New Category',
                  image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'
                },
                fields: [
                  {
                    key: 'name',
                    label: 'Category Name',
                    type: 'text',
                  },
                  {
                    key: 'image',
                    label: 'Image',
                    type: 'image',
                  },
                ],
                defaultValue: [
                  { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
                  { name: 'Decor', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop' },
                  { name: 'Lighting', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop' },
                ],
              },
            ],
          },
        ],
      },
    ];
  },
  defaultProps: {
    selectedLayout: 'grid',
    heading: 'Shop by Category',
    categories: [
      { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
      { name: 'Decor', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop' },
      { name: 'Lighting', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop' },
    ],
  },
};
