# Linter Setup Guide

## Overview
This project now includes a comprehensive linting and formatting setup using ESLint and Prettier to maintain code quality and consistency.

## Tools Installed

### ESLint
- **Purpose**: Code quality and error detection
- **Config**: `.eslintrc.cjs`
- **Features**:
  - React-specific rules
  - Hooks validation
  - Best practices enforcement
  - Unused variable detection

### Prettier
- **Purpose**: Code formatting
- **Config**: `.prettierrc.json`
- **Features**:
  - Consistent formatting
  - Single quotes preference
  - 2-space indentation
  - 100 character line width

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run lint` | Basic linting | Check for errors and warnings |
| `npm run lint:fix` | ESLint auto-fix | Fix auto-fixable ESLint issues |
| `npm run format` | Format code | Apply Prettier formatting |
| `npm run format:check` | Check formatting | Verify code is properly formatted |
| `npm run check` | Full check | Run both linting and format checks |
| `npm run fix` | Full fix | Auto-fix both linting and formatting |

## Quick Start

1. **Check your code:**
   ```bash
   npm run check
   ```

2. **Auto-fix issues:**
   ```bash
   npm run fix
   ```

3. **Format specific files:**
   ```bash
   npx prettier --write "src/components/*.jsx"
   ```

## ESLint Rules Highlights

- **React Rules**: Optimized for React 18+ with JSX transform
- **No unused variables**: Helps keep code clean (use `_` prefix for intentionally unused)
- **Console warnings**: `console.log` statements are flagged as warnings
- **Hooks validation**: Ensures proper React hooks usage
- **Best practices**: Enforces `===` equality, curly braces, etc.

## Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100
}
```

## Integration with VS Code

Add to your VS Code settings:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact"]
}
```

## Common Issues & Solutions

### Unused Variables
- **Problem**: `'variable' is defined but never used`
- **Solution**: Prefix with underscore: `_variable` or remove if truly unused

### React Import
- **Problem**: `'React' is defined but never used`
- **Solution**: Remove React import (not needed with new JSX transform)

### Console Statements
- **Problem**: `Unexpected console statement`
- **Solution**: Use `console.warn` or `console.error` for intentional logs, or remove debug logs

### Prettier Conflicts
- **Problem**: ESLint and Prettier formatting conflicts
- **Solution**: Already resolved with `eslint-config-prettier`

## Current Status

- ✅ ESLint configured with React rules
- ✅ Prettier integrated with ESLint
- ✅ Auto-fix scripts available
- ✅ 272 → 23 issues resolved (91% improvement)
- ⚠️ Remaining issues are mostly console statements and some unused parameters

## Pre-Commit Hooks

### Setup Complete ✅
This project now includes automatic pre-commit hooks that will:
- Run ESLint with auto-fix on all staged JavaScript/JSX files
- Run Prettier formatting on all staged files
- Prevent commits if linting errors are found

### How It Works
1. **Husky**: Manages Git hooks
2. **lint-staged**: Runs linters only on staged files (faster than full project)
3. **Pre-commit hook**: Automatically triggered before each commit

### Configuration
```json
"lint-staged": {
  "src/**/*.{js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "src/**/*.{json,css,md}": [
    "prettier --write"
  ]
}
```

### What Happens During Commit
1. You run `git commit`
2. Pre-commit hook runs automatically
3. Linting and formatting applied to staged files
4. If no errors: commit proceeds
5. If errors found: commit is blocked, you fix issues and try again

### Bypassing Pre-Commit (Emergency Only)
```bash
git commit --no-verify -m "emergency commit"
```

## Next Steps

1. **Clean up remaining issues**: Run `npm run lint` to see specific remaining issues
2. ✅ **Pre-commit hooks**: Already configured and working!
3. **CI Integration**: Add linting checks to your deployment pipeline

## Files Added

- `.eslintrc.cjs` - ESLint configuration
- `.prettierrc.json` - Prettier configuration  
- `.prettierignore` - Files to ignore for formatting
- `.husky/pre-commit` - Pre-commit hook script
- `LINTER_SETUP.md` - This documentation
- Updated `package.json` with new scripts and lint-staged config

## Support

If you encounter linting issues:
1. Try `npm run fix` first
2. Check this documentation for common solutions
3. Review ESLint error messages - they're usually quite helpful
4. For complex issues, you can disable specific rules with `// eslint-disable-next-line rule-name`