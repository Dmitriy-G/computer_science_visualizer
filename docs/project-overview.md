# Project overview

## Purpose and stack

Build Computer Science Visualizer, an interactive app for computer science
concepts with TypeScript and React, using Vite. Its features include data structures
and real-system algorithm lessons.
The app uses TypeScript and React class components. Linked list, array, binary
search tree, graph, and stack operations have animated actions. Canonical model,
layout, and ordinary-operation folders mirror the Fundamental Data Structures and
Advanced Data Structures menu hierarchy. Their subjects and assignments are defined
in MainMenu/MenuStructureCatalog.ts. Data Structures Algorithms contains Sorting
(Array with forty-eight sorting algorithms) and Graphs Traversal; graph algorithm
examples live in the latter.
Real Systems Algorithms is a separate root branch for Hardware and Network, each
with Fundamental and Complex subcategories. Fundamental contains individual
hardware components (Disks, Memory, CPU) or the seven OSI layers. Complex covers
algorithms combining components or layers into systems. The hierarchy lives in
MainMenu/AdvancedAlgorithmCatalog.ts. Hardware/Fundamental/Disks implements
mq-deadline, BFQ, and Kyber lessons under src/components/RealSystemsAlgorithms/,
reusing Renderer and ActionPlayback. Hardware/Fundamental/CPU implements hardware
lessons for register renaming, out-of-order execution with in-order retirement,
history-based branch prediction, and return-address stack prediction. Each owns
its mechanism model; shared CPU helpers handle scene snapshots and playback.
Operating-system CPU scheduler lessons have been removed. Cross-component CPU,
cache, and memory topics in coverage.md remain planned for Hardware/Complex.
Other leaves are empty until implemented.
Use npm for dependency management.
