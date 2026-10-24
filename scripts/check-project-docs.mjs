#!/usr/bin/env node
// Cheap structural check for the four core project docs and optional debugging skill. No dependencies.
// It checks existence, unfilled TODO: lines, size, and dates in CURRENT.md.
// It does not read meaning: duplicated, contradictory, or stale content is not detected.
// Run from the repository root: node scripts/check-project-docs.mjs
// Only a missing core file fails. Warnings mean "look at this", nothing more.
// In the template repository itself the TODO warnings are expected.

import fs from 'node:fs';

const FILES = ['AGENTS.md', 'PRODUCT.md', 'CURRENT.md', 'ARCHITECTURE.md'];
const MAX_LINES = { 'AGENTS.md': 150, 'CURRENT.md': 60 }; // always-loaded rules; resume point
const MAX_DATES_IN_CURRENT = 2;
const DEBUG_SKILLS = ['skills/debugging/SKILL.md', '.claude/skills/debugging/SKILL.md']; // as shipped; Claude Code install path
const MAX_DEBUG_SKILL_LINES = 240; // task-specific, but still a control plane rather than a knowledge dump

const errors = [];
const warnings = [];

for (const file of FILES) {
  if (!fs.existsSync(file)) {
    errors.push(`${file} is missing.`);
    continue;
  }
  const lines = fs.readFileSync(file, 'utf8').trimEnd().split(/\r?\n/);

  const todo = lines.filter((line) => line.includes('TODO:')).length;
  if (todo) warnings.push(`${file} has ${todo} unfilled "TODO:" line(s). Fill them in or delete them.`);

  if (lines.length > MAX_LINES[file]) {
    warnings.push(`${file} is ${lines.length} lines (limit ${MAX_LINES[file]}). Delete or merge before adding more.`);
  }

  if (file === 'CURRENT.md') {
    const dated = lines.filter((line) => /\b20\d\d[-/.]\d{1,2}[-/.]\d{1,2}\b/.test(line)).length;
    if (dated > MAX_DATES_IN_CURRENT) {
      warnings.push(`CURRENT.md has ${dated} dated lines and looks like a work log. Overwrite it; history belongs in Git.`);
    }
  }
}

const checkedSkills = new Set();
for (const skill of DEBUG_SKILLS) {
  if (!fs.existsSync(skill)) continue;
  const real = fs.realpathSync(skill);
  if (checkedSkills.has(real)) continue; // one path links to the other: check the file once
  checkedSkills.add(real);
  const lines = fs.readFileSync(skill, 'utf8').trimEnd().split(/\r?\n/);
  if (lines.length > MAX_DEBUG_SKILL_LINES) {
    warnings.push(`${skill} is ${lines.length} lines (limit ${MAX_DEBUG_SKILL_LINES}). Move conditional detail out or delete rules that do not earn their context.`);
  }
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length) process.exitCode = 1;
else if (warnings.length) console.log(`WARN (${warnings.length} issue${warnings.length === 1 ? '' : 's'} to review).`);
else console.log('PASS (0 warnings).');
