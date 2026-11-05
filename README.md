# Computer Science Visualizer

## Description

Computer Science Visualizer is a free educational project for exploring fundamental
computer science concepts through interactive visualizations and animated operations.

I developed this application for my own learning and decided to share it so others
can learn from it too.

## Supported features

- Nearly 150 interactive data structures and nearly 60 animated algorithms.
- Custom inputs that let you see how operations change the data.
- Animated operations with synchronized explanations, pseudocode, and progress.
- More than 800 detailed descriptions with short summaries and explanations of
  time complexity and memory usage.
- More than 30 examples of real systems, with links to official documentation
  explaining how they use the concepts shown in the application.
- Search by name, area of use, or documented technology and product names.
- Information dialogs that you can open while an animation continues.
- Repeatable operations and a Reset button to restore the starting example.
- Responsive layouts, keyboard navigation, and reduced-motion support.

## Tech stack

- **TypeScript** with strict type checking.
- **React** with class components.
- **Vite** for the development server and production builds.
- **CSS and SVG** for styling, diagrams, and visual states.
- **npm** for dependency management.
- **Node.js built-in test runner** for automated checks.

## Key project components

| Component | Purpose |
| --- | --- |
| `src/components/App/` | Connects navigation, the selected visualization, and dialogs. |
| `src/components/MainMenu/` | Provides browsing, search, and action selection. |
| `src/components/Renderer/` | Draws the shared visualization scene. |
| `src/components/ActionPlayback/` | Runs animations and displays progress and pseudocode. |
| `src/components/ActionInput/` | Collects and validates operation inputs. |
| `src/components/StructureInfo/`, `AlgorithmInfo/`, and `AboutProject/` | Show explanations, complexity information, reference links, and project information. |
| `src/components/FundamentalDataStructures/`, `AdvancedDataStructures/`, and `DataStructuresAlgorithms/` | Contain the models, layouts, and animated operations. |
| `src/visualization/` | Holds shared scene types, catalogs, and animation infrastructure. |
| `tests/` | Checks models, operation sequences, navigation, and animation playback. |

## How to run

You need **Node.js 22.12 or later**, **npm**, and **Git**.

Clone the repository and enter its directory:

```sh
git clone https://github.com/Dmitriy-G/computer_science_visualizer.git
cd computer_science_visualizer
```

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal. Use the menu or search to choose a
visualization, then select an operation to get started.

To create and preview a production build:

```sh
npm run build
npm run preview
```

The production files are generated in `dist/`.

To check types or run the automated tests:

```sh
npm run typecheck
npm test
```

## Contacts

[LinkedIn](https://www.linkedin.com/in/dmytro-g-360398142)
