import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primaria: 'rgb(var(--cor-primaria-rgb) / <alpha-value>)',
        sucesso: 'rgb(var(--cor-sucesso-rgb) / <alpha-value>)',
        otimo: 'rgb(var(--cor-otimo-rgb) / <alpha-value>)',
        atencao: 'rgb(var(--cor-atencao-rgb) / <alpha-value>)',
        perigo: 'rgb(var(--cor-perigo-rgb) / <alpha-value>)',
        info: 'rgb(var(--cor-info-rgb) / <alpha-value>)',
        texto: 'rgb(var(--cor-texto-rgb) / <alpha-value>)',
        fundo: 'rgb(var(--cor-fundo-rgb) / <alpha-value>)',
        fundoClaro: 'rgb(var(--cor-fundo-claro-rgb) / <alpha-value>)',
        superficie: 'rgb(var(--cor-superficie-rgb) / <alpha-value>)',
        borda: 'rgb(var(--cor-borda-rgb) / <alpha-value>)',
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
        card: '0 2px 16px rgba(43,127,255,0.08)',
        hover: '0 8px 32px rgba(43,127,255,0.16)',
        modal: '0 24px 64px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
