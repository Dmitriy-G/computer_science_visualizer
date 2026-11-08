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
MainMenu/AdvancedAlgorithmCatalog.ts. Hardware/Fundamental/Disks is empty;
operating-system disk schedulers have been removed from the hardware branch.
Hardware/Fundamental/CPU implements hardware
lessons for register renaming, out-of-order execution with in-order retirement,
history-based branch prediction, and return-address stack prediction. Each owns
its mechanism model and layout. Diagrams show the CPU core, instruction/data
cache context, registers, and the current operand, result, retirement, or
prediction flow. Cache behavior and exact wiring are not simulated. Shared CPU
helpers handle scene snapshots and playback.
Operating-system CPU scheduler lessons have been removed. Hardware/Complex
implements the twelve cross-component lessons from coverage.md directly in one
flat list: store buffering, x86 fences, DMB, DSB, acquire/release, exclusive loops,
LSE and locked atomics, MOESI, MESIF, TLB/table walks, and instruction-cache
synchronization. Each lesson owns its mechanism model and animation; shared
HardwareModel, HardwareLayout, and HardwareLesson provide visual snapshots and
playback contracts. Each Complex lesson diagrams its CPU cores, caches or MMU,
and shared memory roles with directional transaction paths. Complex diagrams use
large CPU, Bus/Interconnect, and Memory-system boundaries. Each has internal
interfaces and component flows, with routed transfers between the large blocks. DSB distinguishes
CPU-to-cache requests, cache-to-PoU data transfer, completion responses, and CPU
continuation. HardwareDiagram and HardwareSceneLayout in src/visualization share
region geometry and flow metadata across Fundamental CPU and Complex lessons; they
do not imply a vendor's exact physical wiring. Other leaves are empty until implemented.
Use npm for dependency management.
