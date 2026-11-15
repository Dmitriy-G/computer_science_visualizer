export class SsdNandExample {
  // S34ML02G2 x8 array organization; the SSD topology is a modeling choice.
  public static readonly sourceUrl = 'https://www.skyhighmemory.com/download/ONFI_S34ML01G2_02_04_Page_2KB_002_00499.pdf'
  public static readonly channelsPerSsd = 2
  public static readonly packagesPerChannel = 2
  public static readonly diesPerPackage = 1
  public static readonly planesPerDie = 2
  public static readonly blocksPerPlane = 1024
  public static readonly pagesPerBlock = 64
  public static readonly dataBytesPerPage = 2048
  public static readonly spareBytesPerPage = 128
  public static readonly bitsPerCell = 1
  public static readonly dataCellsPerPage = this.dataBytesPerPage * 8 / this.bitsPerCell
  public static readonly dataCellsPerBlock = this.dataCellsPerPage * this.pagesPerBlock
  public static readonly dataBytesPerDie = this.planesPerDie * this.blocksPerPlane * this.pagesPerBlock * this.dataBytesPerPage
  public static readonly rawCapacityGiB = this.channelsPerSsd * this.packagesPerChannel * this.diesPerPackage * this.dataBytesPerDie / 2 ** 30
}
