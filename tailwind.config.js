module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      typography: {
        lg: {
          css: {
            fontSize: '18px',
            lineHeight: '1.7',
            h1: {
              fontSize: '2.5rem',
              fontWeight: '800',
              lineHeight: '1.2',
              marginBottom: '1rem',
            },
            h2: {
              fontSize: '2rem',
              fontWeight: '700',
              lineHeight: '1.3',
              marginTop: '2rem',
              marginBottom: '1rem',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.5rem',
            },
            h3: {
              fontSize: '1.5rem',
              fontWeight: '600',
              lineHeight: '1.4',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            p: {
              marginBottom: '1.25rem',
            },
            ul: {
              marginBottom: '1.25rem',
            },
            li: {
              marginBottom: '0.5rem',
            },
            a: {
              color: '#3b82f6',
              textDecoration: 'underline',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
