# Contributing to Potato Chat

Thank you for your interest in contributing to Potato Chat! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug Reports**: Help us identify and fix issues
- ✨ **Feature Requests**: Suggest new features or improvements
- 📝 **Documentation**: Improve or add documentation
- 🔧 **Code Contributions**: Fix bugs or implement features
- 🎨 **Design**: UI/UX improvements and design assets
- 🌍 **Translations**: Help translate the app to other languages
- 🧪 **Testing**: Write tests or test new features

### Getting Started

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/potato-chat.git
   cd potato-chat
   ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm run install:all
   
   # Set up environment variables
   cp PotatoChatAdmin/backend/.env.example PotatoChatAdmin/backend/.env
   # Edit .env with your configuration
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## 📋 Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix

# Format code
npm run format
```

### Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(chat): add message encryption
fix(auth): resolve login timeout issue
docs(readme): update installation instructions
```

### Code Quality

- **TypeScript**: Use TypeScript for type safety
- **Testing**: Write tests for new features
- **Documentation**: Document your code and APIs
- **Performance**: Consider performance implications
- **Accessibility**: Ensure accessibility compliance

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests for specific platform
npm run test:desktop
npm run test:web
npm run test:admin

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for components
- Write E2E tests for critical user flows
- Aim for good test coverage (>80%)

### Test Structure

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Try the latest version
3. Reproduce the bug
4. Gather system information

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g., Windows 10, macOS 12.0]
- Platform: [e.g., Desktop, Web, Android]
- Version: [e.g., 1.0.0]
- Browser: [if applicable]

**Screenshots**
Add screenshots if applicable.

**Additional Context**
Any other context about the problem.
```

## ✨ Feature Requests

### Before Requesting

1. Check existing feature requests
2. Consider if it fits the project scope
3. Think about implementation complexity
4. Consider alternative solutions

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update Documentation**: Update relevant documentation
2. **Add Tests**: Include tests for new functionality
3. **Check Code Style**: Run linting and formatting
4. **Test Thoroughly**: Test your changes
5. **Update Changelog**: Add entry to CHANGELOG.md

### Pull Request Template

```markdown
**Description**
Brief description of changes.

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

**Checklist**
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs
2. **Code Review**: Team members review code
3. **Testing**: QA testing if needed
4. **Approval**: Maintainer approval required
5. **Merge**: Squash and merge to main

## 🏗️ Project Structure

### Monorepo Structure

```
potato-chat/
├── PotatoChatDesktop/     # Electron desktop app
├── PotatoChatMobile/      # Android app
├── PotatoChatIOS/         # iOS app
├── potato-chat-web/       # Web app
├── PotatoChatAdmin/       # Admin dashboard
├── build-scripts/         # Build automation
├── tests/                 # Shared tests
└── docs/                  # Documentation
```

### Platform-Specific Guidelines

#### Desktop (Electron)
- Use React with TypeScript
- Follow Electron security best practices
- Test on Windows, macOS, and Linux

#### Mobile (React Native)
- Use React Native with TypeScript
- Follow platform-specific design guidelines
- Test on real devices when possible

#### Web (React)
- Use React with TypeScript
- Ensure responsive design
- Test across different browsers

#### Backend (Node.js)
- Use Express with TypeScript
- Follow REST API conventions
- Implement proper error handling

## 🌍 Internationalization

### Adding Translations

1. **Add Language File**
   ```bash
   # Create new language file
   cp src/locales/en.json src/locales/[language-code].json
   ```

2. **Translate Strings**
   ```json
   {
     "welcome": "Welcome to Potato Chat",
     "login": "Login",
     "logout": "Logout"
   }
   ```

3. **Update Language List**
   ```javascript
   // Add to supported languages
   export const supportedLanguages = {
     en: 'English',
     es: 'Español',
     fr: 'Français',
     // Add your language
   }
   ```

## 📚 Documentation

### Types of Documentation

- **API Documentation**: Document all APIs
- **User Guides**: How-to guides for users
- **Developer Docs**: Technical documentation
- **Architecture Docs**: System design documents

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up-to-date

## 🎨 Design Guidelines

### UI/UX Principles

- **Consistency**: Maintain design consistency
- **Accessibility**: Follow WCAG guidelines
- **Performance**: Optimize for performance
- **Mobile-First**: Design for mobile first

### Design Assets

- Use Figma for design files
- Export assets in multiple formats
- Follow naming conventions
- Optimize images for web

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Build all platforms
- [ ] Create release notes
- [ ] Tag release
- [ ] Deploy to production

## 🏆 Recognition

### Contributors

We recognize contributors in:

- README.md contributors section
- Release notes
- Annual contributor report
- Special recognition for major contributions

### Becoming a Maintainer

Regular contributors may be invited to become maintainers based on:

- Quality of contributions
- Community involvement
- Technical expertise
- Commitment to the project

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General discussions
- **Discord**: Real-time chat (coming soon)
- **Email**: security@potatochat.com (security issues)

### Development Help

- **Documentation**: Check project documentation
- **Code Examples**: Look at existing code
- **Ask Questions**: Use GitHub Discussions
- **Pair Programming**: Available for complex features

## 📄 License

By contributing to Potato Chat, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to Potato Chat! Your contributions help make this project better for everyone.

---

**Questions?** Feel free to ask in [GitHub Discussions](https://github.com/guangteng888/potato-chat/discussions)!

