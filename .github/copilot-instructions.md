# GitHub Copilot Instructions

## Project Overview

Content Creator OS is an AI-powered platform that transforms existing knowledge into high-quality, multi-platform content.

The platform is developed incrementally using capability-based vertical slices.

Development lifecycle:

Capability → Build → Deploy → Use → Learn → Iterate

---

# Engineering Principles

- Prefer simplicity over complexity.
- Build only what is required today.
- Avoid premature optimization.
- Keep modules loosely coupled.
- Favor composition over duplication.
- Write clean, readable, and maintainable code.
- Follow SOLID principles where appropriate.
- Every change should be independently deployable.

---

# Architecture

The application follows a modular architecture.

Major capabilities include:

- Knowledge Management
- Prompt Engine
- AI Content Generation
- Content Review
- Publishing
- Analytics

Each capability should remain independently evolvable.

---

# Technology Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- App Router
- Jest
- Playwright
- GitHub Actions
- Vercel

---

# Coding Guidelines

- Use TypeScript for all application code.
- Prefer functional React components.
- Prefer Server Components unless client-side interactivity is required.
- Use Client Components only when necessary.
- Keep components small and focused.
- Avoid unnecessary abstractions.
- Extract reusable utilities when duplication appears.
- Use descriptive naming.

---

# Folder Organization

Create folders only when required.

Avoid placeholder files and empty directories.

Organize code by capability rather than by technical layer whenever practical.

---

# Testing

Write unit tests for business logic.

Write Playwright tests for important user journeys.

Do not introduce untested complex logic.

---

# Documentation

Update documentation whenever architecture or behavior changes.

Keep documentation concise and current.

Documentation should explain why, not simply what.

---

# AI Usage

Generate production-quality code.

Avoid placeholder implementations.

Avoid TODO comments unless explicitly requested.

Prefer complete, working solutions.

Explain important architectural decisions when generating complex code.

---

# Performance

Avoid unnecessary client-side rendering.

Prefer server-side rendering where appropriate.

Lazy-load heavy components.

Optimize for maintainability before micro-optimizations.

---

# Security

Never expose secrets.

Use environment variables for configuration.

Validate all external input.

Follow secure coding practices by default.

---

# Git Commit Messages

Follow Conventional Commits.

Examples:

- feat: add LinkedIn publishing capability
- fix: resolve authentication redirect issue
- docs: update architecture overview
- refactor: simplify prompt builder
- test: add unit tests for content generator
- ci: update GitHub Actions workflow

---

# Pull Requests

Changes should be:

- Small
- Focused
- Independently deployable
- Backward compatible whenever possible

---

# Development Philosophy

Every capability should provide usable value.

Do not wait for large feature sets before deployment.

Prefer continuous delivery through small, deployable vertical slices.

Every capability should follow:

Build → Deploy → Use → Learn → Iterate
