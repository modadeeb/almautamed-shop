/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // هوية «عيادتي» الطبية المستمدّة من تصميم Stitch (Clinical Precision).
      colors: {
        primary: {
          DEFAULT: '#0056b3', // الأزرق الطبي
          dark: '#003f87',
          light: '#e6eff8',
        },
        secondary: {
          DEFAULT: '#28a745', // الأخضر — حالات النجاح/التأكيد
          light: '#e7f6ec',
        },
        tertiary: {
          DEFAULT: '#17a2b8', // التركواز — المعلومات
          light: '#e3f6f9',
        },
        surface: {
          DEFAULT: '#f6faff',
          card: '#ffffff',
          muted: '#e6eff8',
        },
        ink: {
          DEFAULT: '#141d23',
          muted: '#424752',
        },
        line: '#c2c6d4',
        danger: '#ba1a1a',
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
        heading: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 86, 179, 0.05)',
      },
    },
  },
  plugins: [],
}
