# Project overview

## Purpose and stack

Build Computer Science Visualizer, an interactive app for computer science
concepts with TypeScript and React, using Vite. Its features include data structures,
algorithms, and real-system overview lessons. The root menu has Algorithms and
System Components Overview. Algorithms contains Fundamental Data Structures, Data
Structures Algorithms, and Advanced Data Structures, in that order.
The app uses TypeScript and React class components. Linked list, array, binary
search tree, graph, and stack operations have animated actions. Canonical model,
layout, and ordinary-operation folders mirror the Fundamental Data Structures and
Advanced Data Structures menu hierarchy. Their subjects and assignments are defined
in MainMenu/MenuStructureCatalog.ts. Data Structures Algorithms contains Sorting
(Array with forty-eight sorting algorithms) and Graphs Traversal; graph algorithm
examples live in the latter.
System Components Overview is a separate root branch for Hardware and Network, each
with Fundamental and Complex subcategories. Choosing Hardware/Fundamental or
Hardware/Complex closes the menu and opens its workspace action panel with overview
cards and separate information buttons. No intermediate lesson picker is shown;
the diagram waits for an overview selection. Hardware/Fundamental includes its
implemented overviews without CPU, Disks, or Memory subcategories.
The four CPU overviews share a square CPU-core boundary with the same seventeen
component locations. Each supplies its own dataflow; unused units remain idle.
CpuCoreLayout owns this common geometry. The temporary static test overview has
been removed from the catalog and search.
Alongside the four animated CPU overviews, Fundamental implements the latch, conventional
6T SRAM cell, DRAM row access, conventional HDD sector access, SLC NAND, page-mapped
SSD FTL, SSD garbage collection, and SSD wear-leveling lessons from coverage.md.
Each owns its model, layout, animation, and sourced overview in a named folder
under Hardware/Fundamental. ComponentLesson reuses the existing CpuModel/CpuTrace
snapshot and playback adapters with hardware-component scenes. FlashStorage and
FlashLayout share flash media/mapping primitives and geometry; the FTL,
garbage-collection, and wear-leveling models own their distinct policies.
Network/Fundamental contains the seven OSI layers. Complex covers mechanisms
combining components or layers into systems. The hierarchy lives in
MainMenu/AdvancedAlgorithmCatalog.ts. Operating-system disk schedulers have been
removed from the hardware branch. Fundamental lists register renaming,
out-of-order execution with in-order retirement, history-based branch prediction,
and return-address stack prediction. Their source files remain under
Hardware/Fundamental. Each owns
its mechanism model and layout. Diagrams show the CPU core, instruction/data
cache context, registers, and the current operand, result, retirement, or
prediction flow. Cache behavior and exact wiring are not simulated. Shared CPU
helpers handle scene snapshots and playback. CPU lessons share HardwareInteractions
with Complex lessons, showing one transfer or one local update per step, with
receiver values updated on arrival and an arrow-content caption below the legend.
CPU traces are bounded to 256 interactions with fixed scene bounds; memory/storage
component lessons retain their existing trace and playback behavior. The common
core map is conceptual and does not claim that all units exist in every cited CPU.
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
continuation. Complex playback expands logical events into individual interface
transfers or local cell updates, displaying one interaction per step. Receiver
values change on arrival; waits have explicit statuses. A short caption below
the legend identifies the active arrow's data, request, response, or control
message and its contents, preserved across interface hops. Scenario resets use
initial-state frames, and narration-only summaries reuse an existing frame.
These detailed lessons remain bounded to 256 interaction frames with fixed scene
bounds; the stages do not imply processor cycles or atomic-operation internals.
HardwareDiagram and HardwareSceneLayout in src/visualization share
region geometry and flow metadata across Fundamental CPU and Complex lessons; they
do not imply a vendor's exact physical wiring. Other leaves are empty until implemented.
Use npm for dependency management.
