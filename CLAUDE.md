# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development

- `npm start` - Start MagicMirror with Electron (default X11)
- `npm run start:dev` - Start in development mode
- `npm run server` - Run server-only mode (no UI)
- `npm run start:wayland` - Start with Wayland display server
- `npm run start:windows` - Start on Windows

### Testing

- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:electron` - Run Electron-specific tests
- `npm run test:unit -- tests/unit/functions/updatenotification_spec.js` - Run a single test file

### Code Quality

- `npm run lint:js` - Run ESLint on JavaScript files
- `npm run lint:css` - Run Stylelint on CSS files
- `npm run lint:prettier` - Check code formatting
- `npm run lint:staged` - Lint staged files only
- `npm run config:check` - Validate configuration file

## Architecture Overview

MagicMirror² is an Electron-based modular smart mirror platform with a client-server architecture:

### Core Components

- **Electron Wrapper** (`js/electron.js`) - Desktop application container
- **Express Server** (`js/server.js`) - Serves the application and handles API requests
- **Client Core** (`js/main.js`) - MM object that manages modules on the client side
- **Module System** (`js/module.js`, `js/loader.js`) - Base classes for module creation and loading
- **Node Helper** (`js/node_helper.js`) - Server-side helper for modules requiring Node.js APIs

### Module Architecture

Modules are self-contained units located in `/modules/`:

- Each module inherits from the `Module` class
- Optional `node_helper.js` for server-side operations
- Modules communicate via notifications (sendNotification/notificationReceived)
- Socket.io enables client-server module communication

### Key Patterns

- **Position-based Layout**: Modules are positioned using regions (top_bar, top_left, etc.)
- **Notification System**: Inter-module communication via MM.sendNotification()
- **Translation Support**: i18n via translator.js and /translations/ directory
- **Configuration**: Single config.js file with module-specific configurations

### Testing Approach

- Jest with custom test sequencer
- Unit tests mock the MM object and DOM
- E2E tests use Playwright for full application testing
- Test files follow `*_spec.js` naming convention

## Important Notes

- Node.js >= 22.14.0 required
- Uses CommonJS modules (not ES6 modules)
- Electron is an optional dependency (install with `npm install electron`)
- Custom CSS goes in `css/custom.css` (copy from custom.css.sample)
- Configuration file is `config/config.js` (copy from config.js.sample)
- Environment variables can be used via config.js.template
- Module aliases: `node_helper` and `logger` are available globally in modules
