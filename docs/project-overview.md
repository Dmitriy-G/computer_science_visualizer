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
System Components Overview opens Hardware Fundamental and Network, in that order,
with an empty renderer. Hardware Fundamental opens the server hardware map and
one flat list of all twelve component overviews, with separate info buttons.
There are no component subcategories in the sidebar. CPU, HDD, SSD, RAM, GPU,
and Network Adapter each supply two lessons; Motherboard has no lesson.
Diagram elements navigate between component maps without filtering the list.
Selecting an overview moves the camera to its component diagram and starts its
lesson. HardwareFundamentalWorkspace retains one Renderer across these changes.
HDD opens its common map with Write one sector (512 B) and Read one sector (512 B).
Its former combined sector-access
lesson is excluded from menu/search, public kinds, and dispatch. Existing
mechanism and animation code remains for legacy regression coverage.
SSD opens its component map with Write one page (2 KiB) and Read one page (2 KiB).
The former combined NAND, FTL, garbage collection, and wear leveling lessons
are excluded from overview cards, search, public kinds, and dispatch. Their
existing primitives remain for legacy regression coverage. Hardware Complex and
all its lessons are removed from navigation, search, and application dispatch;
its implementation remains for legacy regression coverage. Network retains
Fundamental and Complex subcategories. Motherboard opens its static diagram
while keeping the same flat overview list. The former
Network byte to SSD lesson is excluded from menu, search, public overview kinds,
and playback dispatch. Its model/trace primitives remain for legacy regression
coverage; selecting an overview from Motherboard opens that overview's component map.
BusLayout in Hardware/Fundamental/Bus owns the detailed Motherboard map.
Use a compact 2840 by 1680 landscape scene, with a 2240 by 1600 motherboard.
Keep socket and connector rows close together, use short routing corridors,
and size PCH, firmware, and power blocks to their contents. External component
references remain outside the board. Every connection retains named anchors.
Motherboard contains physical chips, sockets, connectors, power circuits, and
PCB traces. The central region is PCB traces / signal routing, a drawing area
for separate physical links rather than a chip, switch, or protocol controller.
Do not render routing/packet/buffer/flow/error logic or blue logical-association
arrows here. Protocol processing remains inside CPU, PCH, and connected devices.
Show independent PCIe traces from separate CPU socket contact groups to GPU,
NVMe M.2, and NIC connectors. Separate physical routes identify distinct links;
crossings on separate PCB layers are not electrical junctions.
DDR connects CPU socket memory contacts directly to the DIMM socket. DMI/chipset
uplink connects CPU socket chipset contacts to the physical PCH chip.
Separate SATA and USB traces connect PCH to the SATA connector and USB headers.
The firmware SPI flash chip connects to the PCH SPI interface in this platform.
Clock generator/buffer and reset circuitry are physical board support blocks.
Separate reference-clock and reset traces reach CPU socket control contacts,
PCH, GPU slot, M.2 contacts, and NIC slot. Clock frequencies, reset sourcing,
and sequencing are platform-dependent; do not add CPU internals to explain them.
PSU DC input, VRMs, and physical power distribution feed CPU socket, DIMM,
PCH, expansion slots, M.2, clock generator, and reset circuitry. AC stays at PSU.
Every data/support/power arrow ends on a named physical component boundary.
Motherboard data, clock, reset, RTC, and power lines are solid; electrical
power feeds retain their amber color. Keep support routes separate and avoid long
power detours around the bottom of the board. Small gaps distinguish unconnected
traces at crossings without changing their endpoints. DC rails, reset circuitry,
PCH, firmware flash, USB, and RTC blocks share the USB block's 340 by 100 size.
The DMI / chipset uplink, three PCIe device links, and PSU DC input keep their
accessible descriptions without visible wire captions. The RTC outline is solid.
HardwareWireCrossings applies the same crossing gaps to CPU, HDD, SSD, RAM, GPU,
and Network Adapter wiring in the shared renderer, including nested and translated
paths. Highlighted transfers stay continuous; curved mechanisms and filled state
indicators are excluded from wire-crossing calculations.
Retain compact external device references and an empty motherboard overview list.
The physical chipset/clock examples follow [Intel's C600 chipset datasheet](https://www.intel.com/content/dam/www/public/us/en/documents/datasheets/c600-series-chipset-datasheet.pdf).
The Motherboard preview zooms from the shared server motherboard footprint
and uses the existing bus-components layer, shared renderer, opaque palettes,
schematic titles, Fit/Actual size, reduced-motion support, and focused layers.
The header menu returns to Hardware Fundamental.
System Components Overview starts with an empty renderer.
Hardware Fundamental moves the SVG camera into that server. ServerHardwareLayout
owns the shared chassis map and the component slots used for subsequent zooms.
The chassis shows CPU, discrete GPU, and PSU in a left column, and RAM, one NVMe
SSD, HDD, and host Network Adapter in a right column, all outside the Motherboard.
CPU aligns with RAM, GPU with HDD, and PSU with Network Adapter. Leave the left
row opposite SSD empty so both columns follow the same row spacing.
Every outside device uses the HDD's 300 by 100 size. All seven motherboard
connectors use the SATA ports' 180 by 70 size. Connector rows align with their
devices for short straight attachments. USB sits opposite the NVMe connector with a
straight cable to the left margin. The board is compact, at 620 by 700 units.
This is a system connection map rather than a literal installed floorplan.
The main map's Motherboard shows only CPU/DIMM sockets, expansion slots,
NVMe/SATA/USB connectors and their connections. Omit the dedicated Management LAN
port and its cable; the host Network Adapter retains its LAN / Ethernet cable.
Omit Chipset/PCH, BMC, SPI firmware flash, and all links to those hidden components.
Keep the separate Motherboard diagram's existing internal detail unchanged.
The main map has no shared PCIe / I/O Interconnect hub.
Keep external device attachments to the sockets, slots, and connectors. Omit
internal DDR and PCIe socket-to-socket/slot paths from the main map. These traces
and the DMI / chipset uplink remain in the detailed Motherboard view, whose
external CPU, GPU, RAM, HDD, SSD, and Network Adapter references open their
component diagrams with blue hover/focus borders. Its PSU reference stays static.
The HDD uses native PCH SATA, while the single M.2 SSD uses direct CPU PCIe/NVMe
and motherboard power through its socket. The main map labels this device SSD.
Omit the second SATA SSD, optional RAID/HBA, its slot, and their links from the
main map. Each remaining drive has one controller path. Use pale blue for both
PCIe/NVMe and SATA lines, without visible cable captions; retain protocol
descriptions in tooltips and accessibility labels. SAS drives require a compatible
SAS controller, which is not part of this example. Power lines use separate
outer corridors. The GPU display cable and PSU AC input run straight to the left.
Host USB and host Ethernet remain visible as port connections.
Omit controller, firmware, sideband, and standby-power wiring from this main
map. Data links are solid; solid amber paths show PSU delivery to the motherboard,
GPU auxiliary input, and HDD. Separate short amber lines below the data attachments
show motherboard DC through CPU, DIMM, M.2, and PCIe power contacts to CPU, RAM,
SSD, GPU, and Network Adapter. The M.2 SSD has no separate PSU cable. Keep these
power paths separate from data lines and anchored to connector/device boundaries.
All hardware diagrams share two arrow colors: pale blue (#a6b7c9) for data,
control, and signals; amber (#b58a45) for AC/DC power. Arrowheads match their
lines, including during playback. Active arrows become thicker without changing
color. Filled state indicators and mechanism drawings retain their own palettes.
Named component-boundary anchors keep internal arrows attached. Short component names
appear in the renderer, with topology details in tooltips/accessibility text.
Four labeled cables extend beyond the chassis: GPU HDMI/DisplayPort, USB, and
AC power use the left margin; host LAN/Ethernet uses the right. Network and USB
links are bidirectional, display is output-only, and solid amber AC points toward
the PSU. The 1400 by 930 chassis starts after a 400-unit left margin within the
2240 by 930 scene. Camera bounds and component zoom positions include that offset.
The hardware camera fits the external labels and fully reveals the map; system
camera bounds also include the extra margin. Only concise port labels appear on
the cables, with explanations retained in tooltips/accessibility descriptions.
CPU, RAM, SSD, GPU, and Network Adapter maps use the same labeled external-line style.
HardwareDiagramFrame adds side margins while preserving internal coordinates via
ScenePath.translateX and matching region/state offsets. CPU exposes DDR channels,
separate PCIe lanes and chipset uplink, reference-clock/reset inputs, and motherboard
DC power. The socket's memory, PCIe, chipset, clock/reset, and power groups are
electrical contacts; memory and I/O controllers remain inside the CPU die.
RAM exposes CPU/SoC request context,
SPD platform context, and DIMM DC power; its existing controller-to-socket DDR
paths remain distinct. GPU exposes host PCIe, HDMI/DisplayPort, and slot/auxiliary
DC input. Network Adapter exposes host PCIe, external Ethernet LAN, and slot DC.
GPU and NIC PCIe connectors and external lines explicitly say PCIe / DMA. The
CPU PCIe caption reads "PCIe lanes (device DMA traffic)" on two lines; its separate
chipset caption identifies Intel DMI or a platform-specific equivalent. DMA uses
an existing supported interconnect and is not another physical channel. Reference
clock (such as BCLK) and reset inputs reach on-die management logic via distinct
socket/package control paths; exact signals and platform availability vary.
RAM adds a separate PCIe / DMA ingress
through an external CPU/SoC root-complex context block into the memory controller;
the DIMM socket remains DDR and has no PCIe connector. DMA shares PCIe with control
traffic, while software prepares buffers and address mappings. This distinction
follows the [Linux DMA mapping guide](https://docs.kernel.org/core-api/dma-api-howto.html).
RAM/VRAM state pills and charge indicators follow the same offsets during playback.
SSD adds a motherboard host line labeled PCIe (NVMe protocol) or SATA (alternative
attachments) and solid amber motherboard/PSU DC input. Host RAM transfers use
the platform I/O/memory system; there is no direct DIMM or GPU connection.
HDD adds SATA/SAS host tails (motherboard or compatible HBA, according to drive
type) and PSU DC input in a 650-unit left margin, with the shared clickable
Back / Motherboard block. Its framed map is 4050 by 1400: Back, PCB, mechanical
assembly, then the recording-media enlargement in the 1400-unit right margin.
Keep all component names and internal group geometry unchanged. Translate whole
groups, reroute their connecting paths, and apply the same offsets to playback
state and moving mechanism paths. Bus retains its existing interfaces.
The example follows the motherboard organization in
[Supermicro's X12DPG-U6 manual](https://www.supermicro.com/manuals/motherboard/X12/MNL-2365.pdf)
and the chassis/management-port arrangement in
[Dell's PowerEdge T620 manual](https://www.dell.com/support/manuals/en-in/poweredge-t620/t620ownersmanual-v3/back-panel-features-and-indicators?guid=guid-85b7434c-b809-49aa-be48-64863c20a5e2&lang=en-us).
NVMe attachment follows [NVM Express's PCIe transport description](https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/);
dedicated/shared management arrangements follow
[Supermicro's management interface guidance](https://www.supermicro.com/en/support/faqs/faq.php?faq=21188).
Existing component categories and detail diagrams remain available. CPU moves
closer into the independent CPU block, revealing CpuLayout's static package map.
Its illustrative single-die, four-core example expands one representative core
using CpuDiagramCoreLayout's compact arrangement of the existing core components,
titled "Cores (~4 per die)". The package preview and both CPU lessons share this
3700 by 1760 map, with 200 by 130 core-function blocks, wrapped labels, and no
Motherboard back block. Only the external DC power line is drawn; internal power
wiring is omitted. The core-to-interconnect wire renders above the nested core
background so its route remains visible. Legacy core-mechanism layouts retain
their geometry. It shows no empty
peer-core blocks. Surrounding components include shared L3 cache, on-die
interconnect, integrated memory and I/O controllers, clock/power/thermal control,
package contacts, and a separate electrical CPU socket with DDR memory, PCIe,
chipset-link, reference-clock/reset, and power connections.
The socket is drawn beside the package for clarity; physically it sits underneath.
Core count, cache organization, packaging, and interfaces vary between processors;
the map is logical rather than a manufacturer floorplan. Cache and controller
context follows [Intel's processor datasheet](https://cdrdv2-public.intel.com/634648/634648-004.pdf).
GPU and Network Adapter each contribute two cards to the shared overview list;
their diagram elements open the corresponding common maps.
GpuLayout shows a discrete-card example with host connectivity, scheduling,
compute/shader cores, texture units, rasterization, render output, cache, memory
controllers, VRAM, display engine and ports, optional ray tracing and AI units,
and power/cooling support. NetworkAdapterLayout shows a PCIe Ethernet example
with controller management, firmware/configuration memory, host interface, DMA,
TX/RX buffers, MAC, PHY, connection hardware, and optional packet offloads.
Both use HardwareDiagram, the existing opaque hardware palette and schematic
titles, nested camera navigation, and Fit/Actual size controls. Unit placement
is logical; accessible descriptions identify integrated-GPU and USB/Wi-Fi variants.
GpuVramLayout expands the VRAM area as a representative GDDR chip, DRAM die,
bank, cell array, and enlarged 1T1C cell. GDDR chip and bank containers use light
blue. It shows separate access-transistor and
storage-capacitor blocks, wordline/bitline connections, row and column decoders,
sense amplifiers / row buffer, command/address logic, refresh, and data I/O /
prefetch buffers. The storage cell is DRAM; row-buffer latches are separate.
Scoped quantity labels use a 16 GiB GDDR6 example: eight 16-Gbit chips per VRAM,
one modeled monolithic die per chip, 32 banks per die (two channels of sixteen),
approximately 537M data cells per bank, and one access transistor and capacitor
per cell. GpuVramExample supplies shared quantities for labels and info dialogs.
Micron's 16-Gbit GDDR6 addressing table supplies the channel/bank organization;
the board capacity and single-die packaging are explicit modeling choices.
Spare cells and peripheral logic are excluded; physical subarray and decoder
counts remain unspecified. Memory-controller commands
and payload paths enter separate VRAM functions; display output stays separate.
The GPU canvas is widened for readable details, and its reveal threshold keeps
the complete map visible. Static preview and both lessons share these bounds.
The references are [Micron's 16-Gbit GDDR6 datasheet, Table 3](https://www.mouser.com/datasheet/2/671/Micron_08232024_gddr6_sgram_16gb_brief_1578719_348-3554756.pdf),
[Micron GDDR6](https://www.micron.com/products/memory/graphics-memory/gddr6)
and [Samsung's DRAM cell explanation](https://semiconductor.samsung.com/dram/).
GPU offers Render one frame and Hashcat: one candidate iteration. The first
transforms three vertices, rasterizes one triangle into a 2 × 2 frame, shades its
covered pixel, stores the result in VRAM, and presents it through the Display
Engine. The display-output route is separate from the memory-controller/VRAM
route. The second computes and compares the complete SHA-256 digest of fixed
candidate abc, then reports its match to the host; it does not execute Hashcat.
Both GPU cards and search results show GPU and VRAM tags. Their memory transfers
use GpuVramModel and GpuVramTrace to animate ACTIVATE, row selection, wordline
opening, sensing and restoration, column read/write, GDDR I/O, and PRECHARGE.
One enlarged capacitor follows bit 0 of the first payload byte; wider buffers
transfer as grouped data. Named teaching buffers select representative rows,
not a vendor GPU address map. Access restoration is distinct from scheduled
refresh, which remains idle. Frame rendering reads actual geometry and texture
bytes from the memory model, writes RGBA frame bytes, and reads them for scanout.
Hashcat uploads candidate/target bytes, reads them for hashing/comparison, writes
the match record, and reads its flag for host reporting. Writes commit before
row closure; reads preserve bytes and other buffers remain unchanged. These
lessons retain the 96-event bound and independent fixed-geometry scenes.
RAM and GPU VRAM reuse DramCellVisual for the same blue capacitor charge bar,
0 / low, shared charge, and 1 / high labels, and bitline voltage labels. GPU
activation shows symbolic charge sharing before sensing and restoration; writes
change capacitor fill only after bitline drive and storage. Transistor pills
show ON/OFF. Approximate VRAM count suffixes appear in the static preview and
are removed in playback to leave space for cell state, matching RAM. Reset
restores the static labels. GpuVramTrace decorates independent snapshot diagrams
through ComponentFlowTrace without adding events or changing canvas geometry.
Network Adapter offers Server to network and Network to server. Each follows
one payload byte in a minimum 64-byte Ethernet frame, with real CRC-32 FCS,
separate TX/RX paths, DMA, and completion after data delivery. Invalid FCS or an
unaccepted destination prevents receive DMA. Optional packet offloads stay idle.
These four lessons retain the category geometry, camera, renderer, and scrolling;
Reset restores the static map. ComponentFlowTrace shares bounded snapshots,
state placement, one highlighted transfer per event, and directional routing.
ComponentFlowWorkspace replaces only the selected detail layer. Narration stays
in info dialogs and accessible playback/scene descriptions, outside the visible
renderer. Component names, values, and concise wiring labels remain visible.
Overview references include the Vulkan specification, Linux DRM/KMS and network
driver documentation, and Hashcat's SHA2-256 kernel source.
Focused component previews exclude the other components' detailed layers, preventing
neighboring RAM or disk diagrams from appearing in the surrounding viewport.
The static CPU preview uses opaque light orange (#faf6ec) for the socket's inner
signal/power blocks, shared L3/interconnect/controllers, and the selected front-end,
rename/dispatch/issue, execution/retirement, memory-access, and cache-interface
blocks. Group boundaries and existing CPU lesson palettes retain their colors.
HDD zooms into its storage block to reveal a common component map, grouping
platters, the spindle motor, heads, actuator arms, the voice-coil actuator, and
filters inside the enclosure, alongside the controller board, cache, and connectors.
HddLayout owns that reusable schematic and the legacy sector-access geometry.
HddStorageLayout adds an enlargement of the same recording surface and head,
with one representative surface, track, sector, and magnetic bit area rather than
duplicated instances. HddMediaExample owns a deliberately modeled 1 TiB 512n
geometry: 1 platter, 2 surfaces per platter, 262,144 tracks per surface, 4,096
sectors per track, and 512 payload bytes per sector (2,147,483,648 sectors total).
Scoped approximate titles show the closest parent; tooltips give exact model
arithmetic. Uniform sectors per track are a teaching choice: real zone bit
recording varies that count. Payload capacity excludes format, ECC, servo, and
spare-sector overhead. Separate payload and overhead blocks avoid equating user
bits with physical magnetic bit areas.
The enlargement distinguishes a write pole, MR read sensor, and nonvolatile
magnetic film. A recorded area contains many magnetic grains; remanent
magnetization retains information without power. Grain counts are technology
dependent and are not invented. Solid field paths touch the pole/grain/sensor
boundaries and differ from conductive data paths. A plus/minus strip shows the
first 16 consecutive encoded intervals, with plus/up and minus/down magnetization
rather than electric charge or direct user bits. Static preview uses the leading
codeword of the old 0x11 sector. Playback highlights the current interval, changes
the real modeled magnetization in order during write, and scans the existing
pattern without rewriting during read. The remaining 16,368 teaching intervals
are grouped. Substeps stay within one aligned sector pass, not whole platter
revolutions. Payload, ECC, write-field, reader, and retention states update inside
the same enlargement, with independent snapshots and no canvas resize. Media physics and format overhead follow
[Western Digital's recording-technologies brief](https://documents.westerndigital.com/content/dam/doc-library/en_us/assets/public/western-digital/collateral/tech-brief/tech-brief-recording-technologies.pdf).
It uses a circular platter and central spindle, a fixed-length pivoting arm,
and connected functional blocks for the internal preamp/head driver, distinct
read processing and write encoding, ECC, user-data cache, HDD controller,
LBA / Physical Location Mapping, servo controller, motor drivers, and host/power interfaces.
The controller connects directly to servo, cache, read processing, and write
encoding. Mapping is a side lookup for logical-to-physical translation and defect
remapping, not a mandatory intermediate controller stage. Motor drivers contain
separate Spindle Motor Driver and VCM Driver functions, connected respectively
to platter rotation and head positioning. A solid amber DC feed connects Power
to the Motor drivers container; other internal supply distribution is abstracted. User data follows
separate directed routes: Write = Cache → ECC → Write Encoder → Preamp → Head;
Read = Head → Preamp → Read Processing → ECC → Cache. Write and Read wiring
retain their text labels. Servo positioning uses a separate control
and feedback path. Block roles follow the
[Seagate HDD manual](https://www.seagate.com/www-content/support-content/samsung/internal-products/spinpoint-m-series/en-us/docs/100772113c.pdf);
spare-sector remapping follows [Seagate's bad-sector guidance](https://www.seagate.com/support/kb/what-do-i-do-if-my-drive-reports-bad-sectors-196351en/).
The PCB appears beside
the mechanism as an underside inset. Directed paths show data and control;
the passive filter has a separate solid airflow path. All HDD group outlines
and paths are solid; descriptions distinguish field coupling from conductive wires.
HddAccessModel, HddAccessTrace, and HddAccessAnimation provide separate full-sector
write/read lessons through WriteOneSector / ReadOneSector action folders. They
use a 512n example: one 512-byte host logical sector is also one physical sector.
512e and 4Kn differences are explained in the sourced info dialogs. Every byte
passes through the existing teaching Hamming (8,4), Manchester, and NRZI pipeline;
these codes do not represent a production HDD format. Writes require encoding,
seek, settling, and rotational alignment before recording; reads recover the
sector from magnetic transitions, validate ECC, and only then deliver data.
Neighbors are preserved and uncorrectable codewords block host delivery.
Spindle rotation advances during seek/settle, alignment wait, and after the
grouped sector pass. HddAccessTrace refreshes moving head/arm/sector geometry in
independent snapshots while keeping component bounds and canvas unchanged.
HddWorkspace replaces only hdd-components through ComponentFlowWorkspace,
preserving camera, renderer, and scrolling; Reset restores the static map.
Data/status remains inside the common diagram, without a lower detail panel;
each frame highlights at most one transfer and lessons remain within 96 events.
Legacy sector-access playback
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
leveling. SRAM holds volatile runtime firmware, working state, and temporary
metadata. Persistent firmware belongs in nonvolatile ROM/flash; a separate logical
backing source shows loading into SRAM without implying another NAND package.
The FTL translates LBAs into physical NAND locations including channel,
target, die, plane, block, and page; host sectors may also need an offset within
a page. Command/status paths reach NAND controllers separately from payloads.
Writes pass through ECC encoding before page programming; reads pass through
ECC decoding/correction before host delivery. These are logical stages, not a
bitwise ECC simulation. Block erase does not traverse the ECC payload path.
NAND shows one representative channel, package, die, plane, block, string, cell,
and page, with scoped approximate counts using "per" and the closest counted
parent, matching RAM/VRAM. SsdNandExample uses S34ML02G2 x8 SLC geometry:
two planes per die, 1,024 blocks per plane, 64 pages per block, and 2 KiB data
plus 128 spare bytes per page. Two channels, two packages per channel, and one
die per package are explicit modeling choices (1 GiB raw data capacity), not a
typical modern SSD configuration. Shared-channel transfers are serialized;
internal die operations can overlap. SsdNandLayout expands command/status logic,
voltage generation, row decoding, column/data I/O, sense amplifiers/page buffers,
wordlines, bitlines, and an enlarged cell with control and insulated floating gates.
Pages and strings are crossing views of the same array. A dashed projection
joins the enlarged cell's selected wordline to a neutral page view labeled
"Cells on same wordline / Across ~16K strings". It identifies the same cells;
it is not a payload path to independent storage. Visible titles distinguish
page read/program from block erase. TLC/QLC can encode multiple logical pages
in cells sharing a wordline. The planar SLC example
has approximately 16K data strings per block and 64 data cells per string;
spare strings and select/peripheral transistors are excluded. Persistent flash
charge is distinct from volatile page-buffer latches and DRAM capacitors.
SsdNandCellLayout expands one SLC 1T memory cell into a wordline-driven control
gate, gate insulator, floating-gate bit storage, tunnel oxide, and source-drain
channel. Visible charge and read-current state mappings distinguish erased 1
from programmed 0; concise wiring labels identify program/erase charge transfer.
Electrostatic coupling is distinct from conductive current and electron tunneling.
The map uses 4310 by 2100 bounds including a 650-unit external margin, with
HardwareDiagramFrame shifting regions, wires, captions, and state together.
Cell operation follows [KIOXIA's NAND explanation](https://www.kioxia.com/en-jp/rd/technology/nand-flash.html).
The NAND heading explicitly identifies the expanded planar floating-gate SLC
example and common modern 3D charge-trap TLC/QLC alternatives. SLC describes
bits per cell, independently of the charge-storage construction. Context follows
the [NAND array paper](https://www.mdpi.com/2073-431X/6/2/16) and
[Kingston Flash Memory Guide](https://media.kingston.com/pdfs/MKF-283.3-Flash-Memory-Guide_EN.pdf).
The host line distinguishes the PCIe interconnect from the NVMe storage protocol,
following the [NVMe over PCIe transport specification](https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/).
Counts follow the [SkyHigh SLC datasheet](https://www.skyhighmemory.com/download/ONFI_S34ML01G2_02_04_Page_2KB_002_00499.pdf).
Power rails are solid amber and optional parts are labeled in text. All hardware
power lines retain their original colors with solid strokes. NAND command, bias,
wordline, and data paths use separate routing lanes; the sequencer bypass runs
on the opposite side of the functional blocks.
SSD offers two independent page overviews through SsdPageModel, SsdPageTrace,
SsdPageAnimation, and action folders WriteOnePage / ReadOnePage. Each transfers
one actual 2 KiB byte array, tracking the first byte's low bit in the enlarged
cell. One full data page is the normal NAND access unit shown, not a universal
host minimum; the request groups four aligned 512-byte logical sectors and
conceptual spare/ECC bytes. Writes require erased space, load program latches,
program charge, verify, and publish runtime mapping only after success. Reads
sense stored bytes, traverse a conceptual ECC stage, and return the same data
without changing either modeled page. No block erase occurs. ECC redundancy,
analog timing, and crash-safe mapping durability are not simulated.
SsdWorkspace reuses ComponentFlowWorkspace to replace only ssd-components,
preserving the camera, bounds, renderer, and scrolling. Playback hides approximate
count suffixes and replaces static cell-state comparisons with current charge
and conduction values inside the same geometry; Reset restores the static map.
Every frame highlights at most one transfer and snapshots remain independent.
The source-return wire ends on the named source-line terminal, not in empty space.
The four legacy SSD animations reuse this same schematic and component positions through
SsdLessonLayout. Component state cells and highlighted paths identify firmware,
mapping metadata, DMA buffers, ECC stages, and active channel traffic. NAND cell
access uses physical commands without an FTL lookup. Mapping publication and
allocation change controller metadata without implying a NAND program or erase.
Lower detail panels preserve the cell/threshold demonstration, logical mappings,
page states, block erase counters, write amplification, and wear comparison.
Their three conceptual blocks belong to CH0 / target 0 / die 0 / plane 0;
counted peer packages are omitted. The lower panels use reduced symbolic arrays,
separate from the realistic static count example. Logical association arrows in these panels are distinct
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
Algorithms browsing preserves the current diagram. Hardware Fundamental opens
the server hardware preview. Component navigation uses diagram clicks; the
overview list stays at Hardware Fundamental. Returning to System Components
Overview ends the lesson and clears the renderer.
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
Bank-local iensing and row refresh follow the [RAIDR DRAM background](https://users.ece.cmu.edu/~omutlu/pub/raidr-dram-refresh_isca12.pdf).
SPD devices follow Renesas's [DDR4 SPD EEPROM](https://www.renesas.com/en/products/tse2004gb2b0)
and [DDR5 SPD hub](https://www.renesas.com/en/products/spd5118) descriptions.
Network starts with a blank renderer. Selecting a lesson uses its mechanism's playback;
HDD and SSD lessons retain their shared component diagrams. Workspace Back and
the header menu return to System Components Overview with an empty renderer,
ending the current lesson. Search selections open Hardware Fundamental and move
to the matching component diagram and lesson without adding a sidebar subcategory.
CPU offers Non-atomic operation: i = i + 1 and Atomic operation: i = j. Both
reuse CpuLayout's full package and expanded representative core, preserving its
geometry and light-orange colors. The non-atomic trace uses separate LOAD, ADD,
and STORE instructions and a peer update to demonstrate a lost increment (8
instead of 9). Retirement into the store buffer is separate from publication.
The atomic trace captures one complete aligned 32-bit normal-cacheable x86 word
from shared j into private local i; a later peer store changes j without changing
i. It does not present a shared-to-shared assignment as atomic. C++ analogies use
atomic objects; ordinary unsynchronized objects are subject to data-race rules.
CpuOperationModel owns the operation state, CpuOperationTrace records one transfer
or local update per step, and CpuOperationLayout adds state inside the existing
blocks. Fixed bounds, independent snapshots, hidden approximate count suffixes,
and the retained camera/renderer prevent shifts when playback starts or resets.
Current-transfer explanations remain in accessible playback descriptions and info
dialogs, without a visible renderer caption. The old four cards are removed from menu/search;
their mechanism primitives remain available to legacy unit tests.
Alongside the two CPU operation overviews, Fundamental implements Write one bit,
Read one bit and SSD full-page write/read. Conventional HDD sector access, SLC NAND, page-mapped
SSD FTL, garbage collection, and wear-leveling primitives remain as legacy code
without selectable overviews.
Each owns its model, layout, animation, and sourced overview in a named folder
under Hardware/Fundamental. CPU, RAM, HDD, SSD, GPU, and Network Adapter own separate catalogs and
workspaces in Cpu, Ram, Hdd, Ssd, Gpu, and NetworkAdapter. HardwareOverviewCatalog delegates to these
catalogs for menu/search routing. ComponentWorkspace supplies shared workspace UI;
HardwareSnapshot, HardwareTrace, and HardwareOverviewLesson supply neutral snapshot
and playback contracts. ComponentLesson uses hardware-component scenes, while
Cpu/CpuLesson retains legacy CPU interaction tracing. The two RAM overviews reuse
RamLayout's common geometry and colors, with cell state inside the existing blocks.
Approximate quantity suffixes appear only in the static preview. Playback replaces
the existing RAM scene layer, preserving the outer canvas, camera, layer transform,
component sizes, and component positions. The workspace renderer stays mounted
between lessons, retaining Fit/Actual size and scrolling. No lower detail panel
or extra canvas height is introduced; Reset restores static quantity labels.
They show ACTIVATE, charge sharing, sensing and restoration, column read/write,
write recovery, and PRECHARGE. Each follows one selected bit within a wider DDR
burst, not a physical single-bit bus command. Bounds stay fixed and snapshots
remain independent; Reset restores the common category preview. The former
latch, SRAM, and DRAM-row cards are removed from menu/search; their underlying
models remain available as tested primitives. FlashStorage and
FlashLayout share flash media/mapping primitives and geometry; the FTL,
garbage-collection, and wear-leveling models own their distinct policies.
Network/Fundamental contains the seven OSI layers. Complex covers mechanisms
combining components or layers into systems. The hierarchy lives in
MainMenu/AdvancedAlgorithmCatalog.ts. Operating-system disk schedulers have been
removed from the hardware branch. CPU operation playback follows the selected
instruction and data paths with receiver updates on arrival, bounded to 96 frames.
The shared core map is conceptual and does not claim that all units exist in every
processor. Cache hit, mapping, permissions, and ready operands are assumptions;
coherence is abstracted and exact hardware timing is not simulated.
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
values change on arrival; waits have explicit statuses. Accessible descriptions
identify the active arrow's data, request, response, or control message and its
contents, preserved across interface hops. No renderer narration is shown. Scenario resets use
initial-state frames, and narration-only summaries reuse an existing frame.
These detailed lessons remain bounded to 256 interaction frames with fixed scene
bounds; the stages do not imply processor cycles or atomic-operation internals.
HardwareDiagram and HardwareSceneLayout in src/visualization share
region geometry and flow metadata across Fundamental CPU and Complex lessons; they
do not imply a vendor's exact physical wiring. Other leaves are empty until implemented.
Use npm for dependency management.
