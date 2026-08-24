import { updateStatus } from "./controller_status.js"
updateStatus();
import { getControllerData } from './get_controller_data.js';
getControllerData();

function logLiveControllers() {
    const data = getControllerData();
    
    // Only log if a controller is connected so it doesn't spam empty arrays
    if (data.length > 0) {
        console.log(data);
    }
    
    requestAnimationFrame(logLiveControllers);
}

logLiveControllers(); // Start the loop