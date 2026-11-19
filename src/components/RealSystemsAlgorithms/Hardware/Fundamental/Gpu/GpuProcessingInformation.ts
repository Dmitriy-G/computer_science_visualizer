import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'

export class GpuProcessingInformation {
  private static readonly architectureDocumentation = {
    title: 'NVIDIA / Ada architecture: an example GPU implementation',
    url: 'https://images.nvidia.com/aem-dam/Solutions/Data-Center/l4/nvidia-ada-gpu-architecture-whitepaper-V2.02.pdf',
  }
  private static readonly dmaDocumentation = {
    title: 'Linux / DMA transfers, host bridges, and address mappings',
    url: 'https://docs.kernel.org/core-api/dma-api-howto.html',
  }
  private static readonly scope = 'The diagram groups logical functions. Their organization, counts, and physical placement depend on the GPU implementation.'

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'gpu-connector': {
      photos: [],
      overview: 'The PCIe card-edge connector attaches a discrete GPU to the host platform.',
      problem: 'It provides the physical host connection for device control and transfers between host memory and the GPU.',
      characteristicNote: 'This is the host attachment of the discrete-card example. Lane count, PCIe generation, and slot power limits depend on the actual card and platform.',
      characteristics: [
        { name: 'Traffic', value: 'Commands, configuration, memory transactions, and DMA transfers share PCIe.' },
        { name: 'DMA', value: 'Software prepares memory mappings; device engines perform the supported transfers.' },
        { name: 'Physical connections', value: 'The card edge includes signal, power, and ground contacts. Auxiliary power and display connectors are separate attachments.' },
      ],
      documentation: [this.dmaDocumentation, {
        title: 'Linux / PCI device configuration and resources',
        url: 'https://docs.kernel.org/PCI/pci.html',
      }],
    },
    'gpu-host-interface': {
      photos: [],
      overview: 'The host interface is the GPU circuitry that exchanges requests and responses with the computer over its host link.',
      problem: 'It connects host submissions and memory transactions to the internal GPU processing and memory systems.',
      characteristicNote: this.scope,
      characteristics: [
        { name: 'Control path', value: 'Host requests reach configuration and command-processing functions.' },
        { name: 'Memory path', value: 'Transfers can move payloads between mapped host buffers and GPU memory.' },
        { name: 'Connection', value: 'The schematic separates the on-chip interface from the physical PCIe connector.' },
      ],
      documentation: [this.dmaDocumentation],
    },
    'gpu-scheduler': {
      photos: [],
      overview: 'Command processing and scheduling organize submitted graphics and compute work for execution.',
      problem: 'They distribute ready work across available GPU resources while respecting required dependencies.',
      characteristicNote: 'Command processors and execution schedulers are grouped here. Their queues, scheduling policies, and division of responsibilities vary.',
      characteristics: [
        { name: 'Input', value: 'Receives work submitted through the host interface.' },
        { name: 'Dispatch', value: 'Directs work toward graphics stages or programmable compute resources.' },
        { name: 'Readiness', value: 'Execution depends on available resources, operand readiness, and synchronization.' },
      ],
      documentation: [this.architectureDocumentation],
    },
    'gpu-raster': {
      photos: [],
      overview: 'Geometry processing and rasterization prepare primitives and determine their coverage in the image.',
      problem: 'They turn geometric inputs into fragments that can be shaded and combined into framebuffer results.',
      characteristicNote: 'This block groups multiple graphics functions. API pipeline stages describe behavior; a device may implement them with several hardware units.',
      characteristics: [
        { name: 'Input', value: 'Uses processed vertices and primitive information.' },
        { name: 'Coverage', value: 'Rasterization determines which image samples are covered by a primitive.' },
        { name: 'Output', value: 'Generated fragments provide inputs for fragment shading and subsequent framebuffer operations.' },
      ],
      documentation: [{
        title: 'Khronos / Vulkan rasterization',
        url: 'https://docs.vulkan.org/spec/latest/chapters/primsrast.html',
      }],
    },
    'gpu-render-output': {
      photos: [],
      overview: 'Render output circuitry applies configured framebuffer operations to fragment results.',
      problem: 'It determines which results update the image and how new values combine with existing framebuffer contents.',
      characteristicNote: 'Depth/stencil testing, blending, and writes are grouped logically. Their hardware placement and ordering depend on the implementation and enabled state.',
      characteristics: [
        { name: 'Visibility', value: 'Configured depth and stencil tests can reject covered samples.' },
        { name: 'Combination', value: 'Blending can combine a fragment color with the existing attachment value.' },
        { name: 'Storage', value: 'Accepted results reach framebuffer memory through the GPU memory system.' },
      ],
      documentation: [{
        title: 'Khronos / Vulkan fragment operations and framebuffer updates',
        url: 'https://docs.vulkan.org/spec/latest/chapters/fragops.html',
      }],
    },
    'gpu-cache': {
      photos: [],
      overview: 'GPU caches keep recently used instructions or data near processing resources.',
      problem: 'They reduce repeated traffic to external memory and can shorten access time when requests reuse cached information.',
      characteristicNote: 'The shared block abstracts a cache hierarchy. Cache levels, capacities, line sizes, and sharing domains vary between GPUs.',
      characteristics: [
        { name: 'Hits', value: 'A request can use a cached copy when it is present and valid.' },
        { name: 'Misses', value: 'Missing data is fetched through the memory system, with the relevant cache updated according to its policy.' },
        { name: 'Sharing', value: 'The diagram groups traffic from shader, texture, and render functions; it does not specify a physical cache floorplan.' },
      ],
      documentation: [this.architectureDocumentation],
    },
    'gpu-memory-controllers': {
      photos: [],
      overview: 'GPU memory controllers manage requests to dedicated graphics memory.',
      problem: 'They turn internal memory requests into the commands, addresses, and data transfers required by the memory devices.',
      characteristicNote: 'The example uses GDDR6 VRAM. Channel organization, supported memory types, and request policies depend on the GPU and board.',
      characteristics: [
        { name: 'Commands', value: 'Coordinate bank, row, and column operations with the required memory timing.' },
        { name: 'Payload', value: 'Exchange read and write data with graphics-memory I/O circuitry.' },
        { name: 'Maintenance', value: 'Coordinate memory operation with required refresh and other device constraints.' },
      ],
      documentation: [{
        title: 'Micron / GDDR6 graphics memory',
        url: 'https://www.micron.com/products/memory/graphics-memory/gddr6',
      }, this.architectureDocumentation],
    },
    'gpu-display-engine': {
      photos: [],
      overview: 'The display engine reads a selected framebuffer and produces the display output stream and timing.',
      problem: 'It presents completed image data to a monitor at the configured display mode.',
      characteristicNote: 'Scanout is shown as a separate function from rendering and VRAM control. The drawn cache route is a teaching abstraction; actual scanout paths vary.',
      characteristics: [
        { name: 'Input', value: 'Uses framebuffer contents selected for presentation.' },
        { name: 'Timing', value: 'Coordinates display scanout according to the configured mode.' },
        { name: 'Output', value: 'Feeds the supported display interface and connector, such as HDMI or DisplayPort.' },
      ],
      documentation: [{
        title: 'Linux / DRM display controllers, framebuffers, encoders, and connectors',
        url: 'https://docs.kernel.org/gpu/drm-kms.html',
      }],
    },
    'gpu-compute-clusters': {
      photos: [],
      overview: 'Compute clusters group repeated programmable execution resources and nearby support circuitry.',
      problem: 'They let a GPU execute many pieces of graphics or compute work concurrently.',
      characteristicNote: 'One representative group is expanded. Vendor names, unit counts, resource sharing, and placement of specialized units vary.',
      characteristics: [
        { name: 'Execution', value: 'Groups contain programmable arithmetic resources and execution support.' },
        { name: 'Local resources', value: 'Scheduling, registers, caches, and other resources can be shared within execution groups.' },
        { name: 'Scale', value: 'The single expanded group represents repeated hardware; it does not specify the photographed GPU count.' },
      ],
      documentation: [this.architectureDocumentation],
    },
    'gpu-compute-cores': {
      photos: [],
      overview: 'Programmable GPU execution units perform arithmetic and logic for shaders and compute programs.',
      problem: 'They process many data items using the operations required by a graphics or general compute workload.',
      characteristicNote: 'Execution lanes, instruction grouping, supported types, and the meaning of a vendor core count depend on the architecture.',
      characteristics: [
        { name: 'Graphics', value: 'Run programmable work such as vertex and fragment shading.' },
        { name: 'Compute', value: 'Execute arithmetic, logical operations, and supported memory accesses for parallel programs.' },
        { name: 'Data supply', value: 'Use the GPU memory hierarchy for inputs and results.' },
      ],
      documentation: [this.architectureDocumentation],
    },
    'gpu-texture-units': {
      photos: [],
      overview: 'Texture units supply sampled texture values requested by shaders.',
      problem: 'They accelerate texture addressing and supported filtering operations used during image shading.',
      characteristicNote: this.scope,
      characteristics: [
        { name: 'Requests', value: 'Shaders supply sampling coordinates and sampling state.' },
        { name: 'Memory', value: 'Texture data is obtained through the GPU memory hierarchy.' },
        { name: 'Results', value: 'Supported filtering combines texel values into samples returned to the shader.' },
      ],
      documentation: [this.architectureDocumentation],
    },
    'gpu-ray-tracing': {
      photos: [],
      overview: 'Optional ray tracing hardware accelerates supported ray traversal and intersection operations.',
      problem: 'It reduces the processing cost of determining which scene geometry a ray encounters.',
      characteristicNote: 'Dedicated acceleration is optional. Supported traversal structures, intersection operations, and hardware organization vary by architecture.',
      characteristics: [
        { name: 'Traversal', value: 'Supported acceleration structures reduce the geometry that must be considered for a ray.' },
        { name: 'Intersection', value: 'Dedicated resources can accelerate supported geometric intersection tests.' },
        { name: 'Shader cooperation', value: 'Programmable shaders still perform the surrounding application and shading work.' },
      ],
      documentation: [this.architectureDocumentation],
    },
    'gpu-ai': {
      photos: [],
      overview: 'Optional matrix execution units accelerate supported matrix arithmetic.',
      problem: 'They improve throughput for workloads with suitable matrix operations, including many machine-learning computations.',
      characteristicNote: 'Availability, supported precisions, operation shapes, and programming interfaces depend on the GPU.',
      characteristics: [
        { name: 'Operation', value: 'Specialized hardware performs supported matrix multiply and accumulation operations.' },
        { name: 'Inputs', value: 'Programs must supply operands in a supported representation and arrangement.' },
        { name: 'Use', value: 'These units assist suitable kernels; ordinary programmable units handle other operations.' },
      ],
      documentation: [this.architectureDocumentation],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    return this.entries[regionId] ?? null
  }
}
