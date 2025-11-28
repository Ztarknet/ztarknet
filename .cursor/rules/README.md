# Cursor Rules Documentation

This directory contains project-specific rules for AI-assisted development with Cursor.

## Available Rules

### `typescript.rule`
**Comprehensive TypeScript Standards for Ztarknet Monorepo**

Created from the successful TypeScript migration (Nov 2025) that took the codebase from 186 errors to 0 errors.

**What's Inside:**
- ✅ React 19 patterns (no React import for JSX)
- ✅ Component props interface patterns
- ✅ useState typing standards
- ✅ Error handling with type guards
- ✅ Array callback typing patterns
- ✅ Available types in the codebase
- ✅ Vite environment variable handling
- ✅ Common errors and solutions
- ✅ Migration checklist
- ✅ Real examples from the actual codebase

**When to Use:**
- Adding new TypeScript files
- Converting JS to TS
- Fixing TypeScript errors
- Code review
- Learning project patterns

**Key Highlights:**
- Based on actual production code
- All patterns are battle-tested
- Includes examples from real migration
- Covers edge cases (import.meta.env, blockheight vs height, etc.)

## Using These Rules

Cursor AI will automatically consider these rules when:
- Writing new code
- Refactoring existing code
- Fixing errors
- Providing suggestions

You can also explicitly reference them:
```
"Follow the patterns in .cursor/rules/typescript.rule"
```

## Related Documentation

- **`.cursorrules`** (repo root) - General code quality standards
- **`TYPESCRIPT_MIGRATION_COMPLETE.md`** - Full migration report
- **`HANDOFF.md`** - Migration guide and patterns

## Contributing

When adding new rules:
1. Create a `.rule` file in this directory
2. Use clear examples from the actual codebase
3. Include both ❌ BAD and ✅ GOOD patterns
4. Update this README
5. Test the rule with actual code

## Quality Standards

All rules in this directory should:
- Be based on real production code
- Include practical examples
- Cover common pitfalls
- Provide clear before/after patterns
- Reference actual file locations when helpful
- Be maintained as the codebase evolves


