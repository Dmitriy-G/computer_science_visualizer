import { HardwareDiagram } from '../../../../../../visualization/HardwareDiagram.ts'

export class OutOfOrderLayout {
  public static create(flow: string, id: string, unit: string, registers: string, head: string, loadPending: boolean): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 770)
    diagram.region('core', 'CPU / Core 0', 'cpu', 10, 10, 940, 745, 'system')
    diagram.region('icache-region', 'Instruction cache / program', 'cache', 20, 60, 260, 170)
    diagram.region('alu-region', 'Core / execution units', 'cpu', 350, 60, 260, 170)
    diagram.region('dcache-region', 'Core / data-access path', 'cache', 680, 60, 260, 170)
    diagram.region('rob-region', 'Core / reorder buffer: oldest to youngest', 'cpu', 20, 310, 920, 170)
    diagram.region('register-region', 'Core / committed registers', 'cpu', 20, 575, 260, 170)
    diagram.region('retire-region', 'Core / retirement control', 'cpu', 350, 575, 260, 170)
    diagram.region('fetch-region', 'Core / instruction fetch', 'cpu', 680, 575, 260, 170)
    diagram.fixture('instruction-cache', 'resident instruction stream', 'I1 I2 I3 I4 I5', 150, 160, 'cache behavior not simulated')
    diagram.fixture('execution-unit', 'current execution', unit, 480, 160)
    diagram.fixture('data-cache', 'load [A] / teaching value', 'A = 10', 810, 160, loadPending ? 'load pending' : 'load returned')
    for (let index = 0; index < 5; index += 1) diagram.place(`I${index + 1}`, 105 + index * 185, 410, 125)
    diagram.fixture('committed-registers', 'architectural values', registers, 150, 675, undefined, 230)
    diagram.fixture('retirement-head', 'oldest unretired instruction', head, 480, 675, flow === 'retire-wait' ? 'head not complete / wait' : 'in-order commit')
    diagram.place('pc', 810, 675)
    diagram.connect('dispatch', 'instruction-cache', 'I1', 'dispatch in order', flow === 'dispatch')
    for (let index = 1; index < 5; index += 1) diagram.connect(`order-${index}`, `I${index}`, `I${index + 1}`, flow === 'redirect' && index === 4 ? 'squash' : 'next', flow === 'redirect' && index === 4)
    diagram.connect('issue', id, 'execution-unit', flow === 'wait' ? 'operand not ready' : 'issue ready work', flow === 'execute' || flow === 'redirect', 50)
    diagram.connect('complete', 'execution-unit', id, 'speculative result', flow === 'execute' || flow === 'redirect', 50)
    diagram.connect('load-request', 'I1', 'data-cache', 'load request', flow === 'load-request', -85)
    diagram.connect('load-response', 'data-cache', 'I1', 'load data = 10', flow === 'load-response', -20)
    if (id === 'I3' || id === 'I4') diagram.connect('dependency', id === 'I3' ? 'I1' : 'I3', id, 'true dependency', flow === 'execute', -100)
    diagram.connect('commit', id, 'committed-registers', 'commit result', flow === 'retire', 45)
    diagram.connect('head', id, 'retirement-head', 'advance head', flow === 'retire', -45)
    diagram.connect('redirect', 'I4', 'pc', 'redirect fetch', flow === 'redirect', -35)
    return diagram
  }
}
