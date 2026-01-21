export interface FontConfig {
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace' | 'handwriting';
  weights: string[];
}

export const googleFonts: FontConfig[] = [
  {
    family: 'Inter',
    category: 'sans-serif',
    weights: ['400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'Roboto',
    category: 'sans-serif',
    weights: ['400', '500', '700', '900'],
  },
  {
    family: 'Open Sans',
    category: 'sans-serif',
    weights: ['400', '600', '700', '800'],
  },
  {
    family: 'Montserrat',
    category: 'sans-serif',
    weights: ['400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'Poppins',
    category: 'sans-serif',
    weights: ['400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'Lato',
    category: 'sans-serif',
    weights: ['400', '700', '900'],
  },
  {
    family: 'Oswald',
    category: 'sans-serif',
    weights: ['400', '500', '600', '700'],
  },
  {
    family: 'Raleway',
    category: 'sans-serif',
    weights: ['400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'Nunito',
    category: 'sans-serif',
    weights: ['400', '600', '700', '800', '900'],
  },
  {
    family: 'Playfair Display',
    category: 'serif',
    weights: ['400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'Merriweather',
    category: 'serif',
    weights: ['300', '400', '700', '900'],
  },
  {
    family: 'Rubik',
    category: 'sans-serif',
    weights: ['400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'Ubuntu',
    category: 'sans-serif',
    weights: ['400', '500', '700'],
  },
  {
    family: 'Roboto Mono',
    category: 'monospace',
    weights: ['400', '500', '600', '700'],
  },
  {
    family: 'Source Code Pro',
    category: 'monospace',
    weights: ['400', '500', '600', '700', '900'],
  },
  {
    family: 'Lora',
    category: 'serif',
    weights: ['400', '500', '600', '700'],
  },
  {
    family: 'Work Sans',
    category: 'sans-serif',
    weights: ['400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'DM Sans',
    category: 'sans-serif',
    weights: ['400', '500', '700'],
  },
  {
    family: 'Quicksand',
    category: 'sans-serif',
    weights: ['400', '500', '600', '700'],
  },
  {
    family: 'Bebas Neue',
    category: 'display',
    weights: ['400'],
  },
];

export const generateGoogleFontsUrl = (fonts: FontConfig[] = googleFonts) => {
  const baseUrl = 'https://fonts.googleapis.com/css2';
  const families = fonts
    .map((font) => {
      const weights = font.weights.join(';');
      return `family=${font.family.replace(/ /g, '+')}:wght@${weights}`;
    })
    .join('&');

  return `${baseUrl}?${families}&display=swap`;
};
