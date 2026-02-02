# 📱 App Store Screenshot Generator

A free, open-source tool to create stunning, high-converting screenshots for the Apple App Store and Google Play Store in minutes. Design professional app previews with an intuitive drag-and-drop editor.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?logo=tailwindcss)

## ✨ Features

- 🎨 **Visual Editor** - Intuitive drag-and-drop interface for designing screenshots
- 📱 **Device Frames** - Realistic iPhone and Android device mockups
- 🖼️ **Multiple Screenshots** - Create and manage multiple screenshots in one session
- 🎯 **Customizable Elements** - Headlines, subheadlines, overlay images with full positioning control
- 🎨 **Background Options** - Solid colors, gradients, and custom backgrounds
- 📝 **Rich Text Editor** - Format your headlines with style
- 🔤 **Google Fonts** - Access to hundreds of fonts for your text
- 💾 **Export** - Download your screenshots at App Store resolution
- 🌙 **Dark Mode** - Easy on the eyes with a sleek dark interface

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/oyeolamilekan/app-screenshot-generator.git
cd app-screenshot-generator

# Install dependencies
bun install

# Start the development server
bun run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
bun run build
```

The built files will be in the `dist/` directory.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **SEO**: [React Helmet Async](https://github.com/staylor/react-helmet-async)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Runtime**: [Bun](https://bun.sh/)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── CanvasPreview.tsx    # Main canvas with screenshot previews
│   ├── DeviceFrame.tsx      # iPhone device mockup
│   ├── EditorLayout.tsx     # Main editor layout
│   ├── FontPicker.tsx       # Google Fonts selector
│   ├── LeftSidebar.tsx      # Tools and options sidebar
│   ├── RichTextEditor.tsx   # Text formatting editor
│   ├── RightSidebar.tsx     # Properties panel
│   └── Seo.tsx              # SEO meta tags
├── context/             # React context providers
│   └── EditorContext.tsx    # Editor state management
├── lib/                 # Utility functions
│   └── google-fonts.ts      # Google Fonts loader
├── routes/              # TanStack Router pages
│   ├── __root.tsx           # Root layout
│   └── index.tsx            # Home page
├── types/               # TypeScript type definitions
├── main.tsx             # Application entry point
└── styles.css           # Global styles
```

## 🎯 Usage

1. **Add Screenshot** - Click "Add Screenshot" to create a new canvas
2. **Upload Device Screenshot** - Add your app's screenshot to the device frame
3. **Edit Text** - Click on headlines/subheadlines to edit them
4. **Customize** - Use the sidebars to adjust colors, fonts, positioning
5. **Add Overlays** - Upload additional images to enhance your design
6. **Export** - Download your finished screenshots

## 🧪 Testing

```bash
# Run tests
bun run test

# Run tests in watch mode
bun run test --watch
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TanStack](https://tanstack.com/) for the amazing router and devtools
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for beautiful icons
- [Google Fonts](https://fonts.google.com/) for the font library

## 📬 Contact

- Create an [issue](https://github.com/oyeolamilekan/app-screenshot-generator/issues) for bug reports or feature requests
- Star ⭐ this repo if you find it useful!

---

Made with ❤️ for iOS and Android developers
