# Real-technology coverage review

Reviewed against the supplied technology table and the application catalog on 2026-11-03.

Implementation update, 2026-11-04: 19 bounded teaching structures now have canonical models, scenes, actions, validated inputs, and sourced information within the existing Overview groups. They are Append-only Log, XArray, Sorted Array / Fanout Table, Flat Vector Array, Request Tag Array, Multiqueue, SPSC Ring, GiST, BKD Tree, Ball Tree, Maple Tree, Checksummed Block Pointer Hierarchy, GIN / Inverted Index, LSH Index, Minimizer Index, Blocked Bloom Filter, HNSW Graph, Compacted de Bruijn Graph, and OPC UA AddressSpace Graph. New graph BFS/DFS actions live under Algorithms / Graphs Traversal. [coverage.md](../coverage.md) tracks the remaining work.

The initial review added documentation examples to existing structure dialogs. The implementation update above adds the selected structures and operations. An example explicitly labeled as a variant illustrates a real use of the underlying family; it does not mean the application implements that product's complete representation.

## Examples added to existing dialogs

| Application structure | Added technology and source | Short explanation |
| --- | --- | --- |
| Array | [Git pack indexes](https://git-scm.com/docs/pack-format) | Sorted object-ID arrays and a cumulative fanout table narrow object lookup ranges. |
| Array | [FAISS flat indexes](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes#flat-indexes) | Arrays retain fixed-size vector codes for sequential similarity comparisons; production storage can grow. |
| Array | [PyTorch dense tensors](https://docs.pytorch.org/docs/stable/tensors.html) | Typed storage supports multidimensional strided views; the lesson remains a one-dimensional scalar array. |
| Array | [Nav2 Costmap2D](https://api.nav2.org/nav2-jazzy/html/classnav2__costmap__2d_1_1Costmap2D.html) | Two-dimensional cell coordinates map to indices in a byte cost array. |
| Array | [Linux blk-mq request arrays](https://github.com/torvalds/linux/blob/master/include/linux/blk-mq.h) | Integer tags index request pointers without a linear search. |
| Linked list | [Docker / Moby v28 layer chains](https://github.com/moby/moby/blob/v28.0.0/layer/layer.go) | A Parent link connects each layer to the next layer in its ancestry chain. |
| Doubly linked list | [Linux sk_buff metadata](https://www.kernel.org/doc/html/next/networking/kapi.html#c.sk_buff) | Packet queues use next/prev links; rbnode and other link fields share a union. |
| Skip List | [RocksDB memtables](https://github.com/meta/rocksdb/wiki/RocksDB-Overview#pluggable-memtables) | The default skip-list memtable supports ordered reads and writes before an SST flush. |
| Skip List | [Lucene 9.10 postings](https://lucene.apache.org/core/9_10_0/core/org/apache/lucene/codecs/lucene99/package-summary.html) | Serialized skip levels advance through blocks of document postings. |
| Sparse Array | [Linux XArray](https://docs.kernel.org/core-api/xarray.html) | Integer-indexed pointer storage serves the page cache, with ordered iteration and RCU reads. |
| Bit Array / BitSet | [Redis bitmaps](https://redis.io/docs/latest/develop/data-types/strings/bitmaps/) | String-backed bit vectors track flags and membership through indexed bit operations. |
| Bit Array / BitSet | [Linux blk-mq tag bitmaps](https://github.com/torvalds/linux/blob/master/include/linux/blk-mq.h) | Scalable bitmap queues manage ordinary and reserved request tags. |
| Queue | [DPDK rings](https://doc.dpdk.org/guides/prog_guide/ring_lib.html) | A fixed-capacity ring implements FIFO transfer with concurrent and bulk-operation variants. |
| Queue | [Linux blk-mq](https://docs.kernel.org/block/blk-mq.html) | Software staging and hardware dispatch queues organize I/O requests; scheduling can change order. |
| Circular buffer | [DPDK rte_ring](https://doc.dpdk.org/guides/prog_guide/ring_lib.html) | Wrapping producer/consumer positions coordinate bounded FIFO storage. |
| Circular buffer | [Linux circular-buffer helpers](https://docs.kernel.org/core-api/circular-buffers.html) | Power-of-two ring arithmetic and memory barriers support producer/consumer buffering. |
| Heap (min-heap) | [Linux Min Heap API](https://docs.kernel.org/core-api/min_heap.html) | Array-backed binary min-heaps support configurable comparisons and storage allocation. |
| Red-Black tree | [Linux TCP receive path](https://linux.googlesource.com/linux/kernel/git/torvalds/linux/+/482deed9dfa065cf3f68372dadac857541c7d504/net/ipv4/tcp_input.c) | A sequence-ordered tree stores out-of-order packet buffers at the cited revision. |
| Red-Black tree | [Linux CFS design](https://docs.kernel.org/scheduler/sched-design-CFS.html) | A virtual-runtime tree supplies the leftmost runnable task; the source notes the transition to EEVDF. |
| Red-Black tree | [nftables sets](https://wiki.iptables.org/wiki-nftables/index.php/Sets) | Red-black trees are one supported firewall-set backend, alongside hash tables. |
| B-Tree | [MongoDB indexes](https://www.mongodb.com/docs/manual/indexes/) | Ordered field-value indexes accelerate equality, range, and sorted-result queries. |
| B-Tree | [Linux Maple Tree](https://docs.kernel.org/core-api/maple_tree.html) | A range-oriented B-tree variant tracks virtual memory areas with concurrency support. |
| General Tree (N-ary Tree) | [Git tree objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) | Named directory entries reference blobs or subtrees; stored objects can be shared across snapshots. |
| KD-Tree | [scikit-learn KDTree](https://scikit-learn.org/stable/modules/neighbors.html) | Metric-aware trees support nearest-neighbor and radius queries. |
| KD-Tree | [Point Cloud Library](https://pointclouds.org/documentation/classpcl_1_1_kd_tree.html) | KD-tree implementations locate nearby points in point clouds. |
| KD-Tree | [Lucene 10.3.1 BKD](https://lucene.apache.org/core/10_3_1/core/org/apache/lucene/util/bkd/package-summary.html) | A block KD-tree partitions multidimensional points into bounded leaf blocks. |
| Octree | [OctoMap](https://octomap.github.io/octomap/doc/index) | An occupancy-octree variant models occupied, free, and unknown 3D regions. |
| Bounding Volume Hierarchy (BVH) | [MoveIt / FCL](https://moveit.ai/documentation/concepts/developer_concepts/) | Collision-manager trees and AABBs prune overlap candidates before detailed geometry tests. |
| Hash Table / Hash Map | [Redis dict](https://github.com/redis/redis/blob/unstable/src/dict.c) | Chained buckets and incremental rehashing implement dictionary storage. |
| Hash Table / Hash Map | [minimap2](https://github.com/lh3/minimap2/blob/master/README.md#algorithm-overview) | A hash table indexes reference minimizers to locate candidate sequence alignments. |
| Separate Chaining Hash Table | [Redis dict](https://github.com/redis/redis/blob/unstable/src/dict.c) | Collision chains match this family's storage policy; resizing is incremental in Redis. |
| Linear Hashing | [OpenSSL 1.0.2 LHASH](https://docs.openssl.org/1.0.2/man3/lhash/) | Growth splits individual buckets; the documented implementation also supports contraction. |
| Bloom Filter | [Git commit-graph format](https://git-scm.com/docs/commit-graph-format) | Optional changed-path filters reject commits that need not be inspected for a path-history query. |
| Bloom Filter | [ClickHouse skip indexes](https://clickhouse.com/blog/index-sharding-clickhouse-cloud-petabyte-scale-indexing) | Bloom filters prune data granules before reading their contents. |
| Bloom Filter | [Bifrost](https://github.com/pmelsted/bifrost) | A blocked Bloom filter participates in filtering for compacted de Bruijn graph construction. |
| Compressed Sparse Row (CSR) | [PyTorch sparse CSR tensors](https://docs.pytorch.org/docs/stable/generated/torch.sparse_csr_tensor.html) | Row offsets, column indices, and explicit numeric values implement CSR storage. |
| Aho-Corasick Automaton | [Suricata tuning guidance](https://github.com/OISF/suricata/blob/main/doc/userguide/performance/tuning-considerations.rst) | The ac and ac-ks matchers support multiple-pattern signature inspection. |
| Directed Graph | [OPC UA AddressSpace model](https://reference.opcfoundation.org/specs/OPC-10000-3/4) | Typed source-to-target References connect information Nodes for browsing and queries. |

Redis appears in both Hash Map and Separate Chaining because those application entries share the same canonical storage. DPDK appears in Queue and Circular buffer because its ring provides both the FIFO interface and the circular representation. Linux request tags appear in Array and BitSet because they use both request-pointer arrays and allocation bitmaps.

## Supplied examples already present

These were retained rather than duplicated. Selected links were refreshed to the supplied documentation.

| Supplied technology / structure | Existing application entry | Evidence and implementation note |
| --- | --- | --- |
| PostgreSQL B-Tree | B+ Tree | [The implementation](https://www.postgresql.org/docs/current/btree.html) keeps row references in leaf pages and routing links in internal pages. Preserve its existing placement rather than adding a duplicate to B-Tree. |
| PostgreSQL Hash Index | Linear Hashing | [Hash-index documentation](https://www.postgresql.org/docs/current/hash-index.html) describes bucket splits and overflow pages. Database hash indexes are already represented as a real example. |
| MySQL InnoDB B+ Tree-style index | B+ Tree | [Index records reside in leaf pages](https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html); the manual calls the family B-tree. |
| MySQL InnoDB R-Tree | R-Tree | [Spatial indexes use R-trees](https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html). |
| SQLite B-Tree | B-Tree | [SQLite distinguishes table and index B-trees](https://www.sqlite.org/fileformat2.html); the existing example identifies index B-trees. |
| PostGIS R-Tree over GiST | R-Tree | [Spatial-index documentation](https://postgis.net/docs/manual-dev/en/using_postgis_dbmanagement.html) supports the existing GiST-backed R-tree example. |
| Redis Skip List | Skip List | [Sorted sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/) are already listed, with their richer score/member representation identified. |
| RocksDB LSM Tree | LSM Tree | [Memtables, SST files, and compaction](https://github.com/meta/rocksdb/wiki/RocksDB-Overview) already describe the production use. |
| RocksDB Bloom Filter | Bloom Filter | [SST Bloom filters](https://github.com/meta/rocksdb/wiki/RocksDB-Bloom-Filter) avoid unnecessary data reads; cache-local variants differ from the lesson. |
| Cassandra LSM Tree | LSM Tree | [The storage engine](https://cassandra.apache.org/doc/stable/cassandra/architecture/storage-engine.html) writes immutable SSTables and compacts versions. |
| Cassandra Bloom Filter | Bloom Filter | [Per-SSTable partition-key filters](https://cassandra.apache.org/doc/stable/cassandra/architecture/storage-engine.html) rule out files during reads. |
| Git DAG / Commit Graph | DAG | [The commit-graph cache](https://git-scm.com/docs/commit-graph) accelerates ancestry queries; the existing description now explains that cache. |
| Linux Kernel Doubly Linked List | Doubly linked list | [Circular intrusive lists](https://docs.kernel.org/core-api/list.html) were already included. |

The supplied Linux packet-metadata row is covered by the new TCP red-black-tree and sk_buff doubly-linked-list examples. The two MoveIt rows are covered together by BVH's collision-tree/AABB example. The supplied PyTorch CSR row and CSR portion of the combined COO/CSR/CSC row share the new CSR example.

## Initial missing structure families and dedicated representations

This table records the gaps identified on 2026-11-03. The 19 additions described below have since been implemented; the current deferred list is in [coverage.md](../coverage.md). A related generic structure alone does not provide the listed indexing, storage, or query behavior.

| Missing structure | Supplied technology and source | What is missing |
| --- | --- | --- |
| GiST (Generalized Search Tree framework) | [PostgreSQL](https://www.postgresql.org/docs/current/gist.html) | Extensible balanced access-method framework and operator classes; the R-Tree example covers only one scheme. |
| GIN / Inverted Index | [PostgreSQL GIN](https://www.postgresql.org/docs/current/gin.html), [Elasticsearch / Lucene](https://lucene.apache.org/core/9_10_0/core/org/apache/lucene/codecs/lucene99/package-summary.html) | Key/term-to-posting-list storage and document/row retrieval. |
| BRIN / Block Range Index | [PostgreSQL](https://www.postgresql.org/docs/current/brin.html) | Block-range summaries and lossy page-range pruning. |
| SSTable | [RocksDB](https://github.com/meta/rocksdb/wiki/RocksDB-Overview) | A dedicated persistent sorted-table representation. LSM Tree has in-memory immutable runs, without the SST file format. |
| Sparse database index / index summary | [Cassandra](https://cassandra.apache.org/doc/stable/cassandra/architecture/storage-engine.html), [ClickHouse](https://clickhouse.com/blog/index-based-pruning) | Sampled partition/index entries or per-granule primary keys pointing into sorted data. Sparse Array and Sparse Table do not implement this. |
| Layered / overlay filesystem | [Docker OverlayFS](https://docs.docker.com/engine/storage/drivers/overlayfs-driver/) | Read-only layers, a writable upper layer, copy-up, and whiteouts. The parent-linked chain is an example under Linked list only. |
| Content-addressed layer references / hash chain | [Moby v28 layer interface](https://github.com/moby/moby/blob/v28.0.0/layer/layer.go) | DiffID and ChainID identity, parent-chain hashing, and content-addressed layer management. The existing Merkle Tree is a different representation. |
| HNSW Graph | [FAISS](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes#indexhnsw-variants), [Lucene 9.10](https://lucene.apache.org/core/9_10_0/core/org/apache/lucene/codecs/lucene99/package-summary.html) | Hierarchical neighbor links and approximate vector-neighbor navigation. Generic graph traversal does not implement HNSW. |
| Append-only Log | [Kafka](https://kafka.apache.org/26/implementation/log/) | Offset-addressed retained records, log segments, and append/read behavior. A FIFO queue is not a Kafka log. |
| Sparse Offset Index | [Kafka LogSegment](https://github.com/apache/kafka/blob/trunk/storage/src/main/java/org/apache/kafka/storage/internals/log/LogSegment.java) | Sparse offset-to-log-position lookup. |
| Time Index | [Kafka LogSegment](https://github.com/apache/kafka/blob/trunk/storage/src/main/java/org/apache/kafka/storage/internals/log/LogSegment.java) | Timestamp-to-offset lookup associated with log segments. |
| Checksummed Block Pointer Hierarchy | [OpenZFS](https://openzfs.github.io/openzfs-docs/Basic%20Concepts/Data%20Storage/Checksums.html) | Filesystem block pointers containing checksums and storage metadata. The source verifies block-pointer checksums, not equivalence to this app's binary SHA-256 Merkle Tree. |
| Sparse COO matrix / tensor | [PyTorch sparse layouts](https://docs.pytorch.org/docs/stable/sparse.html) | Coordinate/value tensor storage and its numeric semantics; Edge List is a graph representation. |
| Sparse CSC matrix / tensor | [PyTorch sparse layouts](https://docs.pytorch.org/docs/stable/sparse.html) | Compressed column offsets, row indices, and values. CSR compresses rows instead. |
| Ball Tree | [scikit-learn](https://scikit-learn.org/stable/modules/neighbors.html) | Metric-ball partitioning and neighbor queries; KD-Tree partitions by coordinate axes. |
| Inverted File Index (IVF) | [FAISS](https://faiss.ai/cpp_api/file/IndexIVF_8h.html) | Coarse vector partitions, inverted lists, and selective probing for similarity search. |
| Locality-Sensitive Hashing (LSH) index | [FAISS](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes) | Similarity-preserving binary codes and Hamming comparisons. FAISS IndexLSH is a flat binary-code index, not ordinary exact-key hashing. |
| Compacted de Bruijn Graph | [Bifrost](https://github.com/pmelsted/bifrost) | Compacted sequence paths, graph colors, and genome-specific indexing. |
| Structured records / communication messages | [ROS-Industrial SimpleMessage](https://github.com/ros-industrial/industrial_core/blob/kinetic-devel/simple_message/include/simple_message/simple_message.h) | Typed protocol headers, payload records, and serialization; these are message schemas rather than a demonstrated container family. |

## Specialized variants with a related application structure

This is the original specialization audit. Most now have dedicated bounded teaching models; dense tensors, numerical matrix layouts, and costmaps remain deferred in [coverage.md](../coverage.md). Production concurrency and protocol features remain outside the teaching variants.

| Specialized representation absent | Related application structure | Remaining distinction |
| --- | --- | --- |
| Git sorted object-ID array plus fanout table | Array | No fanout-table lookup visualization. |
| Lucene BKD Tree | KD-Tree | No bulk-built block leaves or multidimensional point index. |
| Linux XArray | Sparse Array | No XArray node representation, pointer tags, or RCU. |
| Linux blk-mq multiqueue/request queues | Queue | No per-CPU/hardware queue topology, merging, or scheduling. |
| Linux request-tag maps / indexed request arrays | Array and BitSet | No combined concurrent allocation, request lifetime, or completion model. |
| Linux Maple Tree | B-Tree | No range-node format, gap search, or RCU. |
| PyTorch dense tensor / multidimensional array | Array | No tensor shape, strides, views, or device model. |
| FAISS flat vector index | Array | No vector records, distance functions, or similarity-query operation. |
| minimap2 minimizer index | Hash Table / Hash Map | No minimizer extraction, genome-position lists, or alignment operations. |
| Bifrost blocked Bloom filter | Bloom Filter | No blocked layout or k-mer filtering pipeline. |
| DPDK lockless ring | Circular buffer and Queue | No multi-producer/multi-consumer synchronization or bulk operations. |
| Nav2 2D grid / costmap | Array | No grid-specific view, layered costs, or world-coordinate transforms. |
| OPC UA hierarchical AddressSpace / typed node graph | Directed Graph | No typed references, attributes, namespaces, or industrial information model. |

MoveIt's hierarchical collision tree and AABB principle are already represented by the existing 2D BVH. Its full 3D FCL collision environment is a richer variant, not another absent base structure. Likewise, Octree, fixed-capacity FIFO behavior, min-heap, hash tables, and hierarchical trees already exist in the app.

## Source handling and review limits

- Some supplied pages redirected: RocksDB moved from facebook/rocksdb to meta/rocksdb; MongoDB's index overview moved; Redis bitmaps moved under strings. New entries use the current readable targets.
- The supplied Moby master/layer path was unavailable. The v28.0.0 source verifies Parent, DiffID, and ChainID, so its example is version-labeled.
- The Kafka googlesource URL was unavailable; Apache's GitHub LogSegment source supplied the offset/time-index evidence.
- The Linux Foundation sk_buff page was blocked. The supplied kernel networking API directly shows next/prev and the rbnode/list union.
- The nftables page failed to open directly; its indexed first-party text identifies hash tables and red-black trees. The description makes no claim about every backend.
- The Elasticsearch link redirects to general index settings. Lucene's first-party index-format documentation directly establishes the inverted-index representation instead.
- OPC UA's repository overview is supplemented by the OPC Foundation AddressSpace specification. Nav2's configuration overview is supplemented by its Costmap2D API. ROS-Industrial's repository is supplemented by its message-header source.
- Historical/version-specific evidence remains labeled, including OpenSSL 1.0.2, Lucene 9.10/10.3.1, Moby v28, and the CFS design.
- Changes were reviewed as documentation data and with git diff whitespace checks. Builds, type checks, tests, and browser verification remain for the user under project instructions.
