# Contributing to Nook Link

First off, thank you for considering contributing to Nook Link! 🎉

It's people like you that make Nook Link such a great tool. We welcome contributions from everyone, whether you're fixing a typo, adding a feature, or reporting a bug.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [Code Style](#code-style)
  - [Documentation Style](#documentation-style)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [contact@email.com](mailto:contact@email.com).

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/vchaitanyachowdari/nook-link/issues) to avoid duplicates.

When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 10, macOS 13.0, Ubuntu 22.04]
 - Browser: [e.g. Chrome 120, Firefox 121]
 - Node Version: [e.g. 18.17.0]
 - Nook Link Version: [e.g. 1.2.3]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Would you like to implement this feature?**
- [ ] Yes, I'd like to implement it
- [ ] No, just suggesting
```

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

- **Good First Issues** - Issues labeled `good first issue` are great for beginners
- **Help Wanted** - Issues labeled `help wanted` need attention
- **Documentation** - Improvements to documentation are always welcome

**Steps for Your First Contribution:**

1. **Find an issue** you'd like to work on
2. **Comment** on the issue expressing your interest
3. **Wait for approval** from a maintainer
4. **Fork the repository** and create your branch
5. **Make your changes** following our style guides
6. **Submit a pull request**

### Pull Requests

Follow these steps to submit a pull request:

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes** with clear, descriptive commits
   ```bash
   git commit -m "feat: add amazing feature"
   ```

3. **Write or update tests** as needed

4. **Ensure all tests pass**
   ```bash
   npm test
   ```

5. **Update documentation** if you've changed functionality

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request** with a clear title and description

**Pull Request Checklist:**

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code sections
- [ ] Documentation updated (if applicable)
- [ ] No new warnings generated
- [ ] Tests added/updated and all pass
- [ ] Dependent changes merged and published

---

## 🎨 Style Guides

### Git Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `ci`: CI/CD configuration changes
- `build`: Build system or external dependency changes

**Examples:**
```bash
feat(auth): add OAuth2 authentication

fix(api): resolve null pointer exception in user service

docs(readme): update installation instructions

style: format code with prettier

refactor(database): optimize query performance

test(auth): add unit tests for login flow

chore(deps): update dependencies to latest versions
```

**Rules:**
- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Capitalize first letter of subject
- No period at the end of subject
- Limit subject line to 50 characters
- Wrap body at 72 characters
- Separate subject from body with a blank line
- Use body to explain *what* and *why* vs. *how*

### Code Style

**JavaScript/TypeScript:**

```javascript
// Use const for variables that won't be reassigned
const API_KEY = process.env.API_KEY;

// Use let for variables that will be reassigned
let counter = 0;

// Use meaningful variable names
const userAuthenticated = checkAuth();

// Use arrow functions for callbacks
array.map(item => item.value);

// Use async/await instead of promises
async function fetchData() {
  try {
    const response = await api.getData();
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Add JSDoc comments for functions
/**
 * Calculates the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
}
```

**Formatting:**
- 2 spaces for indentation
- Single quotes for strings
- Semicolons at the end of statements
- Trailing commas in multi-line objects/arrays
- Max line length: 100 characters

**Run the linter:**
```bash
npm run lint
```

**Auto-fix issues:**
```bash
npm run lint:fix
```

### Documentation Style

- Use clear, concise language
- Include code examples where appropriate
- Keep line length under 80 characters
- Use proper markdown formatting
- Include links to related documentation
- Update table of contents when adding sections

---

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup Steps

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nook-link.git
   cd nook-link
   ```

2. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/vchaitanyachowdari/nook-link.git
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

### Keeping Your Fork Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge changes into your local main branch
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test path/to/test-file.test.js
```

### Writing Tests

- Write tests for all new features
- Maintain or improve code coverage
- Follow existing test patterns
- Use descriptive test names

**Example:**

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      const user = await UserService.createUser(userData);
      
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
    });

    it('should throw error for duplicate email', async () => {
      const userData = { email: 'existing@example.com' };
      
      await expect(UserService.createUser(userData))
        .rejects
        .toThrow('Email already exists');
    });
  });
});
```

---

## 👥 Community

### Getting Help

- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bug reports and feature requests
- **Discord**: [Join our server](https://discord.gg/nook-link) for real-time chat
- **Twitter**: [@nooklink](https://twitter.com/nooklink) for updates

### Review Process

1. Maintainers review pull requests regularly
2. Reviews may request changes or improvements
3. Address review comments and push updates
4. Once approved, a maintainer will merge your PR

**Review Timeline:**
- Small fixes: Usually within 1-2 days
- Features: May take 3-7 days depending on complexity
- Major changes: Require discussion before submission

---

## 🏆 Recognition

Contributors are recognized in several ways:

- Listed in the [CONTRIBUTORS.md](CONTRIBUTORS.md) file
- Mentioned in release notes for significant contributions
- Given credit in documentation they improve
- Invited to join the core team for consistent contributions

---

## 📝 License

By contributing to Nook Link, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

## ❓ Questions?

Don't hesitate to ask! You can:

- Open a discussion on GitHub
- Reach out to maintainers
- Join our Discord community

Thank you for contributing to Nook Link! 🚀

---

**Happy Coding!** 💻
