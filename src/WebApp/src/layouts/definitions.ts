export interface Layout {
  id: string;
  name: string;
  gridTemplateAreas: string;
  gridTemplateColumns: string;
  gridTemplateRows?: string;
}

export const defaultLayout: Layout = {
  id: 'default',
  name: 'Default Layout',
  gridTemplateAreas: `
    'prompts params'
    'generate generate'
    'gallery gallery'
  `,
  gridTemplateColumns: '2fr 1fr',
  gridTemplateRows: 'auto auto 1fr',
};

export const compactLayout: Layout = {
  id: 'compact',
  name: 'Compact Layout',
  gridTemplateAreas: `
    'prompts generate'
    'params gallery'
  `,
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr 1fr',
};

export const verticalLayout: Layout = {
  id: 'vertical',
  name: 'Vertical Layout',
  gridTemplateAreas: `
    'prompts'
    'params'
    'generate'
    'gallery'
  `,
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto auto auto 1fr',
};

export const wideLayout: Layout = {
  id: 'wide',
  name: 'Wide Layout',
  gridTemplateAreas: `
    'prompts prompts params'
    'generate gallery gallery'
  `,
  gridTemplateColumns: '1fr 1fr 1fr',
  gridTemplateRows: 'auto 1fr',
};

export const layouts: Layout[] = [
  defaultLayout,
  compactLayout,
  verticalLayout,
  wideLayout,
];
