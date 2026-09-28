# Next Studio

A multi-page visual control center for the Next.js repository.

## Run locally

From the repository root:

```bash
pnpm studio
```

The first run builds the local `next` workspace package before starting the dashboard so Next Studio always runs against the checked-out framework source.

Build the static dashboard:

```bash
pnpm studio:build
```

Serve the exported build:

```bash
pnpm studio:serve
```

Run the responsive browser smoke suite after a build:

```bash
pnpm studio:smoke
```

The dashboard scans the repository at build time and surfaces framework modules, packages, agent skills, evals, GitHub automation, scripts, tests, benchmarks, documentation, examples, framework errors, Rust crates, and repository architecture.
