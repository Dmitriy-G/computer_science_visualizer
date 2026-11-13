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
HddLayout owns that reusable schematic and the sector-access lesson's geometry.
It uses a circular platter and central spindle, a fixed-length pivoting arm,
and connected functional blocks for the internal preamp/head driver, distinct
read processing and write encoding, ECC, user-data cache, HDD controller,
firmware address map, servo controller, motor driver, and host/power interfaces.
User data follows host interface / cache / ECC / read-write processing; servo
positioning uses a separate control and feedback path. The PCB appears beside
the mechanism as an underside inset. Directed paths show data and control;
the passive filter has a separate dashed airflow path. Sector-access playback
adds state and channel-code cells below the same diagram, with sector rotation
aligned to the head's actual illustrated position. Firmware resolves LBA 7 to
head 0 / track 1 / sector 3 through an explicit teaching map. Platter rotation
continues during seeking and settling. The lesson separates Hamming (8,4)
SECDED, Manchester recording symbols, NRZI current/magnetization, transition
detection, recording decoding, and ECC correction. A deliberate read-codeword
error is corrected before buffering and returning data; detected double-bit
errors block return. These small codes are teaching choices, not production HDD
recording formats or ECC implementations.
SystemOverviewLayout owns these navigation
scenes; Renderer animates the camera and detail visibility, respecting reduced
motion and cleaning up frames.
SSD zooms into its existing server storage block to reveal SsdLayout's connected
PCB schematic: host connector/interface, controller, NAND channels and packages,
optional DRAM, power management, and optional PLP capacitors. Controller regions
identify internal CPU cores and SRAM, FTL, DMA/data buffers, ECC encoding and
decoding/correction, NAND channel controllers, garbage collection, and wear
leveling. The FTL translates LBAs into physical NAND locations including channel,
target, die, plane, block, and page; host sectors may also need an offset within
a page. Command/status paths reach NAND controllers separately from payloads.
Writes pass through ECC encoding before page programming; reads pass through
ECC decoding/correction before host delivery. These are logical stages, not a
bitwise ECC simulation. Block erase does not traverse the ECC payload path.
NAND packages show separate die, plane, erase-block, and read/program-page regions.
Channel 0 branches to two packages, while channel 1 serves another; shared-channel
bus transfers are serialized, although internal die operations can overlap.
The two channels, three packages, and one depicted die/plane/block/page per
package are illustrative. Power rails are dashed and optional parts are labeled
in text. SSD lesson Reset restores this category preview.
All four SSD lessons reuse this same schematic and component positions through
SsdLessonLayout. Component state cells and highlighted paths identify firmware,
mapping metadata, DMA buffers, ECC stages, and active channel traffic. NAND cell
access uses physical commands without an FTL lookup. Mapping publication and
allocation change controller metadata without implying a NAND program or erase.
Lower detail panels preserve the cell/threshold demonstration, logical mappings,
page states, block erase counters, write amplification, and wear comparison.
Their three conceptual blocks belong to CH0 / target 0 / die 0 / plane 0; other
packages remain idle. Logical association arrows in these panels are distinct
from the common schematic's payload paths. Relocations use both read and write
paths without host traffic. The NAND lesson identifies ECC encoding before each
program and decoding/checking after sensing, without computing an ECC code.
Every lesson retains fixed bounds and independent snapshots throughout playback.
The controller organization is grounded in the
[Marvell Bravera SC5 product brief](https://www.marvell.com/content/dam/marvell/en/public-collateral/storage/marvell-ssd-mv-ss1331-1333-product-brief.pdf),
multi-target channels in the
[Silicon Motion SM2320 product brief](https://www.siliconmotion.com/download/3fu/a/SM2320_PB_EN.pdf),
and NAND hierarchy, operation granularity, and FTL mapping in
[Samsung's SSD data-placement overview](https://semiconductor.samsung.com/news-events/tech-blog/a-brief-history-of-data-placement-technologies/).
Zooming into a component hides the surrounding boundaries and unrelated
connections; zooming out restores its context.
Category previews open in Fit mode and reset scrolling, including after Actual size.
Their layout always reserves the left menu's width, scaling elements to fit beside
it and keeping the diagram in place when the menu opens or closes.
Algorithms browsing preserves the current diagram. Hardware Fundamental and
Complex share the server hardware preview. Returning from CPU to Hardware Fundamental
zooms out to that hardware view; returning to System Components Overview zooms
out to the client/network/server view. HDD returns to the same hardware preview.
RAM zooms into its server memory block to reveal RamLayout's logical component
schematic. A concrete 8 GiB, single-rank, non-ECC DDR4 x8 example provides the
quantity labels: approximately eight chips per module, one monolithic die per
chip, four bank groups per die, and four banks per group (sixteen per die).
One representative block of each type is drawn. Visible counts use "per" and
only the closest containing type: chips per RAM board, dies per chip, groups
per die, banks per bank group, and cells per bank. Higher-level totals remain
in tooltips. An explicit DRAM die boundary contains control, refresh,
read/write I/O, bank groups, banks, decoders, sense amplifiers, and memory cells.
Transistors and Capacitors are enlarged groups inside the cell array; each
actual cell pairs one of each. The example has 536,870,912 addressable data cells
per bank, rounded to approximately 537M in the memory-cell label. Transistors
and Capacitors each show approximately one per cell. The module total is
68,719,476,736 data bits. Cell counts
exclude physical spares; transistor counts exclude control/decoder/I/O logic.
The Cell arrays (subarrays) block groups multiple physical subarrays per bank;
the memory-cell count is aggregated across the bank. Subarray counts depend on
chip design, as described in the [DRAM organization background](https://users.ece.cmu.edu/~saugatag/papers/18micro_cal.pdf).
Subarray, decoder, and peripheral-circuit instance counts are not invented.
The reference module organization follows the
[Kingston 8GB 1Rx8 DDR4 datasheet](https://www.kingston.com/datasheets/KF432C16BWA_8.pdf);
one monolithic die per chip is an explicit modeling choice. Actual configurations
can use different chip, die, and bank counts. Internal placement is logical, not a verified
manufacturer die floorplan. A simple DIMM socket block connects the external
memory controller and SPD host to the module. Visible titles are names with scoped counts,
with details retained in tooltips and accessible labels.
RAM uses green for Chips, Memory cells, Control logic, Refresh circuitry,
Read/write circuitry, and Bank groups. The DIMM socket, SPD, Row decoder, Cell arrays,
Sense amplifiers, and Column decoder use light blue. DRAM dies and Banks use
soft lavender. All other regions use the
SPD host's neutral gray. Each region has an opaque fill, so parent colors do not
tint nested components. These explicit region colors do not change other diagrams.
The physical RAM-stick
illustration, gold contact fingers, package silhouettes, pin-group panel, and
enlargement leaders are removed, and bounds fit the remaining schematic.
No hierarchy banner, access-sequence panel, or power-wiring overlay is shown.
RAM lesson Reset restores this category preview.
Organization and command differences follow [Micron's DDR4/DDR5 comparison](https://www.micron.com/products/memory/dram-components/ddr5-sdram).
Bank-local sensing and row refresh follow the [RAIDR DRAM background](https://users.ece.cmu.edu/~omutlu/pub/raidr-dram-refresh_isca12.pdf).
SPD devices follow Renesas's [DDR4 SPD EEPROM](https://www.renesas.com/en/products/tse2004gb2b0)
and [DDR5 SPD hub](https://www.renesas.com/en/products/spd5118) descriptions.
Network starts with a blank renderer. Selecting a lesson uses its mechanism's playback;
HDD and SSD lessons retain their shared component diagrams. Component workspace
Back and header menu return to the four categories
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
