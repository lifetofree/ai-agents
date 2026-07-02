#!/usr/bin/env node
import { cpSync, existsSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const has = (...flags) => flags.some((f) => args.includes(f));

if (has("--help", "-h")) {
  console.log(`simple-sdlc — install the simple-sdlc skill for Claude Code

Usage:
  npx simple-sdlc [options]

Options:
  -g, --global   Install to ~/.claude/skills (all projects) instead of ./.claude/skills
  -f, --force    Overwrite an existing installation
  -h, --help     Show this help

Examples:
  npx simple-sdlc              # install into the current project
  npx simple-sdlc --global     # install for all your projects
`);
  process.exit(0);
}

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillSource = path.join(packageRoot, "simple-sdlc", "skills", "simple-sdlc");

if (!existsSync(path.join(skillSource, "SKILL.md"))) {
  console.error("✗ Corrupt package: skill source not found at " + skillSource);
  process.exit(1);
}

const isGlobal = has("--global", "-g");
const skillsDir = isGlobal
  ? path.join(homedir(), ".claude", "skills")
  : path.join(process.cwd(), ".claude", "skills");
const destination = path.join(skillsDir, "simple-sdlc");

if (existsSync(destination)) {
  if (has("--force", "-f")) {
    rmSync(destination, { recursive: true });
  } else {
    console.error(`✗ Already installed at ${destination}`);
    console.error("  Re-run with --force to overwrite.");
    process.exit(1);
  }
}

cpSync(skillSource, destination, { recursive: true });

console.log(`✓ simple-sdlc skill installed to ${destination}`);
console.log(
  isGlobal
    ? "  Scope: all your Claude Code projects."
    : "  Scope: this project only (use --global for all projects)."
);
console.log("  Restart your Claude Code session, then invoke it with /simple-sdlc");
console.log("  or just describe feature work — it activates automatically.");
