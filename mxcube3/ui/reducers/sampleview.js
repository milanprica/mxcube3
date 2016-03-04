const initialState = {
  clickCentring: false,
  zoom: 0,
  points: [],
  width: 0,
  height: 0,
  ratioWidthHeigth: 1,
  lightOn: false
}

export default (state=initialState, action) => {
    switch (action.type) {
        case 'SET_ZOOM':
            {
             return {...state, zoom: action.level};
            }
        case 'START_CLICK_CENTRING':
            {
             return {...state, clickCentring: true};
            }
        case 'STOP_CLICK_CENTRING':
            {
             return {...state, clickCentring: false};
            }
        case 'SAVE_POINT':
            {
             return {...state, points: [...state.points, action.point]};
            }
        case 'SAVE_IMAGE_SIZE':
            {
             return {...state, width: action.width, height: action.height, ratioWidthHeigth: action.width/action.height };
            }
        case 'SET_LIGHT':
            {
             return {...state, lightOn: action.on };
            }
        default:
            return state;
    }
}