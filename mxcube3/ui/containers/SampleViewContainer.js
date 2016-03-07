import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SampleImage from '../components/SampleView/SampleImage'
import MotorControl from '../components/SampleView/MotorControl'
import ShapeList from '../components/SampleView/ShapeList'
import ContextMenu from '../components/SampleView/ContextMenu'
import SampleControls from '../components/SampleView/SampleControls'
import * as QueueActions from '../actions/queue'
import * as SampleActions from '../actions/samples_grid'
import * as SampleViewActions from '../actions/sampleview'
import { showForm } from '../actions/methodForm'

class SampleViewContainer extends Component {

  render() {

    const {show, shape, x, y} = this.props.sampleViewState.contextMenu;
     const {width, height, points, clickCentring } = this.props.sampleViewState


    return (
      <div className="row">
        <ContextMenu show={show} shape={shape} x={x} y={y} sampleActions={this.props.sampleViewActions} showForm={this.props.showForm} sampleId={this.props.current.node}/>
        <div className="col-xs-8">
            <SampleImage 
                sampleActions={this.props.sampleViewActions} 
                imageHeight={height} 
                imageWidth={width} 
                shapeList={points} 
                clickCentring={clickCentring} 
                mounted={this.props.current.node}
                contextMenuShow={show} 
            />
            <SampleControls sampleActions={this.props.sampleViewActions} sampleViewState={this.props.sampleViewState} />
        </div>
        <div className="col-xs-4">
            <MotorControl sampleActions={this.props.sampleViewActions} motors={this.props.sampleViewState.motors}/>
            <ShapeList sampleViewState={this.props.sampleViewState} />
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return { 
          current : state.queue.current,
          sampleInformation: state.samples_grid.samples_list,
          sampleViewState: state.sampleview,
          lookup: state.queue.lookup
    }
}

function mapDispatchToProps(dispatch) {
 return  {
    queueActions: bindActionCreators(QueueActions, dispatch),
    sampleActions : bindActionCreators(SampleActions, dispatch),
    sampleViewActions : bindActionCreators(SampleViewActions, dispatch),
    showForm : bindActionCreators(showForm, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SampleViewContainer)