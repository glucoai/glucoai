import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primaria: '#2F80ED',
        sucesso: '#27AE60',
        atencao: '#F2994A',
        perigo: '#EB5757',
        texto: '#4F4F4F',
        fundo: '#FFFFFF',
        superficie: '#F5F7FA',
        borda: '#E0E6ED',
      },
      fontFamily: {
        principal: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '28px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(47,128,237,0.08)',
        hover: '0 8px 32px rgba(47,128,237,0.16)',
        modal: '0 24px 64px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
