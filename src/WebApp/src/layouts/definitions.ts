export const defaultLayout = {
  gridTemplateAreas: `
    'prompts params'
    'generate generate'
    'gallery gallery'
  `,
  gridTemplateColumns: '2fr 1fr',
};

export const compactLayout = {
  gridTemplateAreas: `
    'prompts generate'
    'params gallery'
  `,
  gridTemplateColumns: '1fr 1fr',
};
