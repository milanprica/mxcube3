import io from 'socket.io-client';
import { addLogRecord } from './actions/logger';
import { updatePointsPosition, saveMotorPositions, setCurrentPhase } from './actions/sampleview';
import { setBeamlineAttrAction } from './actions/beamline';
import { addTaskResultAction } from './actions/SamplesGrid';
import { setStatus } from './actions/queue';


export default class ServerIO {

  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  listen() {
    this.hwrSocket = io.connect(`http://${document.domain}:${location.port}/hwr`);

    this.loggingSocket = io.connect(`http://${document.domain}:${location.port}/logging`);

    this.loggingSocket.on('log_record', (record) => {
      this.dispatch(addLogRecord(record));
    });

    this.hwrSocket.on('Motors', (record) => {
      this.dispatch(updatePointsPosition(record.CentredPositions));
      this.dispatch(saveMotorPositions(record.Motors));
      switch (record.Signal) {
        case 'minidiffPhaseChanged':
          this.dispatch(setCurrentPhase(record.Data));
          break;
        default:
      }
    });

    this.hwrSocket.on('beamline_value_change', (data) => {
      this.dispatch(setBeamlineAttrAction(data));
    });

    this.hwrSocket.on('Task', (record) => {
      this.dispatch(addTaskResultAction(record.Sample, record.QueueId, record.State));
    });

    this.hwrSocket.on('Queue', (record) => {
      this.dispatch(setStatus(record.Signal));
    });
  }
}
