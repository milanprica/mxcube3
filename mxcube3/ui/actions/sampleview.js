import fetch from 'isomorphic-fetch';
import { showErrorPanel } from './general';


export function setCurrentPhase(phase) {
  return {
    type: 'SET_CURRENT_PHASE', phase
  };
}

export function setImageRatio(clientWidth) {
  return {
    type: 'SET_IMAGE_RATIO', clientWidth
  };
}

export function setAperture(size) {
  return {
    type: 'SET_APERTURE', size
  };
}

export function setLight(name, on) {
  return {
    type: 'SET_LIGHT', name, on
  };
}

export function setStepSize(name, value) {
  return {
    type: 'SET_STEP_SIZE', name, value
  };
}

export function showContextMenu(show, shape = { type: 'NONE' }, x = 0, y = 0) {
  return {
    type: 'SHOW_CONTEXT_MENU', show, shape, x, y
  };
}

export function setZoom(level, pixelsPerMm) {
  return {
    type: 'SET_ZOOM', level, pixelsPerMm
  };
}

export function startClickCentring() {
  return {
    type: 'START_CLICK_CENTRING'
  };
}

export function stopClickCentring() {
  return {
    type: 'STOP_CLICK_CENTRING'
  };
}

export function addCentringPoint(x, y) {
  return {
    type: 'ADD_CENTRING_POINT', x, y
  };
}

export function savePoint(point) {
  return {
    type: 'SAVE_POINT', point
  };
}

export function deletePoint(id) {
  return {
    type: 'DELETE_POINT', id
  };
}

export function saveImageSize(width, height, pixelsPerMm) {
  return {
    type: 'SAVE_IMAGE_SIZE', width, height, pixelsPerMm
  };
}

export function saveMotorPositions(data) {
  return {
    type: 'SAVE_MOTOR_POSITIONS', data
  };
}

export function saveMotorPosition(name, value) {
  return {
    type: 'SAVE_MOTOR_POSITION', name, value
  };
}

export function updatePointsPosition(points) {
  return {
    type: 'UPDATE_POINTS_POSITION', points
  };
}

export function sendStartClickCentring() {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/centring/start3click', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to start 3click');
      } else {
        dispatch(startClickCentring());
      }
    });
  };
}

export function sendCentringPoint(x, y) {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/centring/click', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ clickPos: { x, y } })
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to add point');
      }
    }).then(() => {
      dispatch(addCentringPoint(x, y));
    });
  };
}

export function sendStartAutoCentring() {
  return function () {
    fetch('/mxcube/api/v0.1/sampleview/centring/startauto', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to start autocentring');
      }
    });
  };
}

export function sendSavePoint(id) {
  return function (dispatch) {
    fetch(`/mxcube/api/v0.1/sampleview/centring/${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to save point');
      }
      return response.json();
    }).then((json) => {
      dispatch(savePoint(json));
    });
  };
}

export function sendDeletePoint(id) {
  return function (dispatch) {
    fetch(`/mxcube/api/v0.1/sampleview/centring/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to delete point');
      }
      return response.json();
    }).then(() => {
      dispatch(deletePoint(id));
    });
  };
}

export function sendZoomPos(level) {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/zoom', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ level })
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to zoom');
      }
      return response.json();
    }).then((json) => {
      dispatch(setZoom(level, json.pixelsPerMm[0]));
    });
  };
}

export function sendLightOn(name) {
  return function (dispatch) {
    dispatch(setLight(name, true));
    fetch(`/mxcube/api/v0.1/sampleview/${name}lighton`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(setLight(name, false));
        dispatch(showErrorPanel(true, 'Server refused to turn light on'));
      }
    });
  };
}

export function sendLightOff(name) {
  return function (dispatch) {
    dispatch(setLight(name, false));
    fetch(`/mxcube/api/v0.1/sampleview/${name}lightoff`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(setLight(name, true));
        dispatch(showErrorPanel(true, 'Server refused to turn light off'));
      }
    });
  };
}

export function sendStopMotor(motorName) {
  return function () {
    fetch(`/mxcube/api/v0.1/sampleview/${motorName}/stop`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to stop motor');
      }
    });
  };
}

export function sendMotorPosition(motorName, value) {
  return function () {
    fetch(`/mxcube/api/v0.1/sampleview/${motorName}/${value}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to move motors');
      }
    });
  };
}

export function sendAbortCentring() {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/centring/abort', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(showErrorPanel(true, 'Server refused to abort centring'));
      } else {
        dispatch(stopClickCentring());
      }
    });
  };
}

export function sendGoToPoint(id) {
  return function (dispatch) {
    fetch(`/mxcube/api/v0.1/sampleview/centring/${id}/moveto`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(showErrorPanel(true, 'Server refused to move to point'));
      }
    });
  };
}

export function sendChangeAperture(pos) {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/beamline/aperture', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ pos })
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(showErrorPanel(true, 'Server refused to change Aperture'));
        dispatch(setAperture(pos));
      } else {
        dispatch(setAperture(pos));
      }
    });
  };
}

export function getSampleImageSize() {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/camera', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to return image size');
      }
      return response.json();
    }).then((json) => {
      dispatch(saveImageSize(json.imageWidth, json.imageHeight, json.pixelsPerMm[0]));
    });
  };
}

export function getMotorPositions() {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/diffractometer/movables/state', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to get motor position');
      }
      return response.json();
    }).then((json) => {
      dispatch(saveMotorPositions(json));
    });
  };
}

export function getPointsPosition() {
  return function (dispatch) {
    fetch('mxcube/api/v0.1/sampleview/centring', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to return points position');
      }
      return response.json();
    }).then((json) => {
      dispatch(updatePointsPosition(json));
    });
  };
}


export function sendCurrentPhase(phase) {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/diffractometer/phase', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ phase })
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to set phase');
      } else {
        dispatch(setCurrentPhase(phase));
      }
    });
  };
}
