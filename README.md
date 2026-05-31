![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)
![Tauri](https://img.shields.io/badge/Tauri-2.0-blue)

# 📚 Promptuary

A beautiful desktop application for managing and organizing your AI prompts.

![Promptuary](icon.png)

## ✨ Features

- 🗂️ **Organize by folders** - Keep your prompts structured
- 🏷️ **Tag system** - Filter and find prompts quickly
- 🔄 **Variable support** - Use `{{variables}}` for dynamic prompts
- 💾 **Import/Export** - Backup and share your prompt library
- 🎨 **Modern UI** - Clean, dark-themed interface
- ⚡ **Fast & Native** - Built with Tauri for performance

## 🚀 Download

Download the latest release from the [Releases](https://github.com/sorarx27/promptuary/releases) page.

If you want some starter data to get a feel of what the app can do, download the "promptuary-sample-data.json" file from the Releases page. Install the app and click the gear icon next to "Promptuary" -> click "Import" and select the JSON file.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## 📦 Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Tauri (Rust)
- **Database**: SQLite
- **UI**: Tailwind CSS + Lucide Icons

## 📄 License

MIT License - feel free to use for personal or commercial projects!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.