import React from 'react';
import 'bootstrap';
import './app.less';
import cx from 'classnames';
import TaskItem from './TaskItem';
import { Button } from 'react-bootstrap';

export default class CurrentTree extends React.Component {

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.collapse = props.collapse.bind(this, 'current');
    this.runSample = this.runSample.bind(this);
    this.unmount = this.unMountSample.bind(this);
    this.showForm = this.props.showForm.bind(this, 'AddSample');
  }

  moveCard(dragIndex, hoverIndex) {
    this.props.changeOrder(this.props.mounted, dragIndex, hoverIndex);
  }

  deleteTask(taskId) {
    this.props.deleteTask(this.props.mounted, taskId, this.props.lookup[this.props.mounted]);
  }

  runSample() {
    this.props.run(this.props.mounted);
  }

  unMountSample() {
    this.props.unmount(this.props.mounted);
  }

  render() {
    const node = this.props.mounted;
    let sampleData = {};
    let sampleTasks = [];

    if (node) {
      sampleData = this.props.sampleInformation[this.props.lookup[node]];
      sampleTasks = this.props.queue[node];
    }

    const bodyClass = cx('list-body', {
      hidden: (this.props.show || !node)
    });
    return (
      <div className="m-tree">
          <div className="list-head">
              <span className="queue-root" onClick={this.collapse}>{(node ? sampleData.sampleName : 'No Sample Mounted')}</span>
               <div className={this.props.queueStatus === 'QueueStopped' && node ? '' : 'hidden'}>
                <Button bsStyle="primary" bsSize="sm" style={{ width: '40%' }} onClick={this.showForm}>New Sample</Button>
                <Button bsStyle="danger" bsSize="sm" style={{ width: '30%' }} onClick={this.unmount}>Unmount</Button>
                <Button bsStyle="success" bsSize="sm" style={{ width: '30%' }} onClick={this.runSample}>Run</Button>
              </div>
               <div className={this.props.queueStatus === 'QueueStarted' && node ? '' : 'hidden'}>
                <Button bsStyle="danger" bsSize="sm" style={{ width: '50%' }} onClick={this.props.stop}>Stop</Button>
                <Button bsStyle="warning" bsSize="sm" style={{ width: '50%' }} onClick={this.props.pause}>Pause</Button>
              </div>
               <div className={this.props.queueStatus === 'QueuePaused' && node ? '' : 'hidden'}>
                <Button bsStyle="danger" bsSize="sm" style={{ width: '50%' }} onClick={this.props.stop}>Stop</Button>
                <Button bsStyle="warning" bsSize="sm" style={{ width: '50%' }} onClick={this.props.unpause}>Unpause</Button>
              </div>
              <div className={!node ? '' : 'hidden'}>
                <Button bsStyle="primary" bsSize="sm" style={{ width: '100%' }} onClick={this.showForm}>New Sample</Button>
              </div>
              <hr className="queue-divider" />
          </div>
          <div className={bodyClass}>
            {sampleTasks.map((id, i) => {
              let taskData = sampleData.tasks[id];
              return (
                <TaskItem key={id}
                  index={i}
                  id={id}
                  data={taskData}
                  moveCard={this.moveCard}
                  deleteTask={this.deleteTask}
                  showForm={this.props.showForm}
                  sampleId={sampleData.id}
                  checked={this.props.checked}
                  toggleChecked={this.props.toggleCheckBox}
                />
              );
            })}
          </div>
      </div>
    );
  }
}
