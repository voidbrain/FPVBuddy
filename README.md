# FPVBuddy

This project uses [Angular CLI](https://github.com/angular/angular-cli) version 22.3.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## FPV core package (`@fpvbuddy/fpv-core`)

`src/fpv-core/` hosts the framework-free FPV battery-manager core (charge-state cycles, per-cell internal-resistance logs, due checks, and health evaluation):

```bash
npm run core:build
npm run core:test
```

See the [FPV core public API reference](docs/architecture/fpv-core.md) for exported types, `BatteryRegistry` methods, storage adapter invariants, and usage examples.

## Working on it

- Agent instructions and workflows: [AGENTS.md](AGENTS.md)
- Roadmap and milestones: [docs/ROADMAP.md](docs/ROADMAP.md)
- Backlog and open issues: [docs/BACKLOG.md](docs/BACKLOG.md)
- Visual tokens and typography: [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md)
- Build VLM worker bundle: `npm run build:worker`
- Harness checks: `npm run check:freshness`, `npm run check:backlog`, `npm run check:tooling`
