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
System Components Overview opens Hardware Fundamental, Complex, and Network in
that order. Hardware Fundamental directly contains CPU, HDD, SSD, and RAM in
that order. Choosing one opens a workspace whose overview cards are filtered by
component and storage device tags, with separate info buttons. CPU contains four
lessons, HDD one, SSD four, and RAM three. NAND belongs to SSD alongside FTL,
garbage collection, and wear leveling. Complex opens its flat workspace directly
from the overview root; Network retains Fundamental and Complex subcategories.
System Components Overview displays a client, abstract network, and server.
Hardware Fundamental moves the SVG camera into that
server, revealing CPU, RAM, bus, HDD, SSD, GPU, and network adapter. CPU moves
closer into the same nested CPU block, progressively revealing the shared core
map. HDD zooms into its storage block to reveal a common component map, grouping
platters, the spindle motor, heads, actuator arms, the voice-coil actuator, and
filters inside the enclosure, alongside the controller board, cache, and connectors.
HddLayout owns that reusable map. SystemOverviewLayout owns these navigation
scenes; Renderer animates the camera and detail visibility, respecting reduced
motion and cleaning up frames.
Zooming into a component hides the surrounding boundaries and unrelated
connections; zooming out restores its context.
Category previews open in Fit mode and reset scrolling, including after Actual size.
Their layout always reserves the left menu's width, scaling elements to fit beside
it and keeping the diagram in place when the menu opens or closes.
Algorithms browsing preserves the current diagram. Hardware Fundamental and
Complex share the server hardware preview. Returning from CPU to Hardware Fundamental
zooms out to that hardware view; returning to System Components Overview zooms
out to the client/network/server view. HDD returns to the same hardware preview.
Network, SSD, and RAM
start with a blank renderer. Selecting a lesson uses its existing diagram and
playback. Component workspace Back and header menu return to the four categories
in Hardware Fundamental and restore the hardware preview, ending the current lesson.
Complex returns directly to System Components Overview and its system preview.
Search selections open the matching component workspace and lesson.
The four CPU overviews share a square CPU-core boundary with the same twenty-three
component locations. Each supplies its own dataflow; unused units remain idle.
CpuCoreLayout owns this common geometry and the category preview's logical
pipeline arrows. ITLB and DTLB are separate, with shared MMU/page-walk context.
The RAT, rename/physical allocation, dispatch/queue allocation, PRF, committed
architectural state, and L2 cache have distinct regions. L2 may be private or shared.
The renaming and out-of-order lessons keep speculative and committed values in
the PRF; committed mappings identify architectural values. The ROB tracks
completion and retirement. Wrong-path recovery restores surviving rename mappings
and releases discarded physical destinations. The temporary static test overview has
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
Operating-system CPU scheduler lessons have been removed. Root Complex
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
