import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class BranchPredictionLayout {
  public static create(flow: string, index: number, predicted: boolean | null, actual: boolean | null, correct: number, resolved: number): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 760)
    diagram.region('core', 'CPU / Core 0', 'cpu', 10, 10, 940, 730, 'system')
    diagram.region('pc-region', 'Core / fetch address register', 'cpu', 20, 50, 260, 170)
    diagram.region('icache-region', 'Instruction cache / program', 'cache', 350, 50, 260, 170)
    diagram.region('fetch-region', 'Core / next-fetch selector', 'cpu', 680, 50, 260, 170)
    diagram.region('history-region', 'Core / history register', 'cpu', 20, 250, 260, 170)
    diagram.region('decision-region', 'Core / predicted direction', 'cpu', 350, 250, 260, 170)
    diagram.region('branch-region', 'Core / branch execution unit', 'cpu', 680, 250, 260, 170)
    diagram.region('pht-region', 'Predictor SRAM / counters, not a cache', 'cpu', 20, 450, 590, 285)
    diagram.region('dcache-region', 'Data cache / context', 'cache', 680, 450, 260, 135)
    diagram.region('statistics-region', 'Prediction accounting', 'cpu', 680, 590, 260, 150)
    diagram.place('branch-pc', 150, 150).place('history', 150, 350)
    diagram.fixture('instruction-cache', 'resident program instruction', 'conditional branch', 480, 150, 'cache behavior not simulated')
    const direction = actual ?? predicted
    diagram.fixture('next-fetch', 'selected program path', direction === null ? 'not selected' : direction ? 'taken path' : 'fall-through', 810, 150, actual !== null && actual !== predicted ? 'redirect after misprediction' : 'predicted path until resolve')
    diagram.place('predicted', 480, 350).place('actual', 810, 350)
    for (let counter = 0; counter < 8; counter += 1) diagram.place(`counter-${counter}`, 95 + counter % 4 * 150, 550 + Math.floor(counter / 4) * 130, 110)
    diagram.fixture('data-cache', 'no data-memory access here', 'idle', 810, 530)
    diagram.fixture('statistics', 'correct / resolved', `${correct} / ${resolved}`, 810, 685, `mispredictions: ${resolved - correct}`)
    diagram.connect('fetch', 'branch-pc', 'instruction-cache', 'fetch branch', flow === 'predict')
    diagram.connect('select', 'history', `counter-${index}`, 'index by history', flow === 'predict', -30)
    diagram.connect('predict', `counter-${index}`, 'predicted', 'counter decision', flow === 'predict', 55)
    diagram.connect('steer', 'predicted', 'next-fetch', 'steer next fetch', flow === 'predict', 30)
    diagram.connect('execute', 'instruction-cache', 'actual', 'resolve branch', flow === 'resolve', -40)
    diagram.connect('train', 'actual', `counter-${index}`, 'train selected entry', flow === 'resolve', 55)
    diagram.connect('history-update', 'actual', 'history', 'shift actual outcome', flow === 'resolve', -55)
    diagram.connect('redirect', 'actual', 'next-fetch', actual !== null && actual !== predicted ? 'redirect fetch' : 'confirm prediction', flow === 'resolve', 40)
    return diagram
  }
}
