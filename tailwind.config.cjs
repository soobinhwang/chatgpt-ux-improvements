module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'gpt-bg': '#1f1f1f',
        'gpt-panel': '#171717',
        'gpt-panel-2': '#222222',
        'gpt-border': '#2a2a2a',
        'gpt-muted': '#a3a3a3',
        'gpt-text': '#e5e5e5',
        'gpt-highlight': '#2c3e50'
      },
      boxShadow: {
        'gpt-soft': '0 0 0 1px rgba(255,255,255,0.06), 0 12px 40px rgba(0,0,0,0.45)'
      }
    },
  },
  plugins: [],
}
