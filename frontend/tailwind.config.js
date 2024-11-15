/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	prefix: "tw-",
	theme: {
		fontFamily: {
			'nunito': ['"Nunito"', 'sans-serif'],
		},
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			boxShadow: {
				'custom-bold': '0 0.46875rem 2.1875rem rgba(90,97,105,.1), 0 0.9375rem 1.40625rem rgba(90,97,105,.1), 0 0.25rem 0.53125rem rgba(90,97,105,.12), 0 0.125rem 0.1875rem rgba(90,97,105,.1)',
				'custom': '0 0.375rem 1.75rem rgba(90,97,105,.03),0 0.75rem 1.125rem rgba(90,97,105,.03),0 0.1875rem 0.40625rem rgba(90,97,105,.1),0 0.0625rem 0.15625rem rgba(90,97,105,.03)',
				'custom-medium': '0 0.375rem 1.75rem rgba(90,97,105,.03),0 0.75rem 1.125rem rgba(90,97,105,.03),0 0.1875rem 0.40625rem rgba(90,97,105,.1),0 0.0625rem 0.15625rem rgba(90,97,105,.03)',
				'custom-blue': '0 2px 6px #82d3f8',
				'custom-green': '0 2px 6px #8edc9c',
				'custom-red': '0 2px 6px #fd9b96',
				'custom-bark': '0 2px 6px #728394',
				'custom-war': '0 2px 6px #ffc473',
				'custom-pri': '0 2px 6px #acb5f6',
				'custom-purpul': '0 2px 8px -3px #7b5295',
				'custom-gray': '0 2px 6px #E9ECEF'
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}