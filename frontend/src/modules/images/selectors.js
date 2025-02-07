const getModuleState = state => state.images;

export const getLastImageUploaded = state =>
    getModuleState(state).lastImageUploaded;