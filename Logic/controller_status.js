
export function updateStatus() {
    let el = document.getElementById("status")

    window.addEventListener("gamepadconnected", () => {
        el.innerText = "Connected"
        el.classList.remove("disconnected");
        el.classList.add("connected");
    });
    window.addEventListener("gamepaddisconnected", () => {
        el.innerText = "Disconnected"
        el.classList.remove("connected");
        el.classList.add("disconnected");
    })

    // Check if a gamepad is already connected when the page loads
    if (navigator.getGamepads()[0]) {
        el.innerText = "Connected"
        el.classList.remove("disconnected");
        el.classList.add("connected");
    } else {
        el.innerText = "Disconnected"
        el.classList.remove("connected");
        el.classList.add("disconnected");
    }   

}




