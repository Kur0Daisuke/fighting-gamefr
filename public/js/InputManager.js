const InputManager = {
    keys: [],
    map: {
        "up":   "w",
        "down": "s",
        "left": "a",
        "right":"d",
    },
    AxisX: 0,
    AxisY: 0,
    load: () => {
        window.addEventListener("keydown", (e) => {
            InputManager.keys[e.key] = true;
        })
        window.addEventListener("keyup", (e) => {
            InputManager.keys[e.key] = false;
        })
    },
    GetKey: (key) => {
        return InputManager.keys[key]
    },
    update: () => {

        if(InputManager.keys[InputManager.map["up"]]) {
            InputManager.AxisY = -1;
        }else if(InputManager.keys[InputManager.map["down"]]) {
            InputManager.AxisY = 1;
        }else {
            InputManager.AxisY = 0;
        }
        if(InputManager.keys[InputManager.map["left"]]) {
            InputManager.AxisX = -1;
        }else if(InputManager.keys[InputManager.map["right"]]) {
            InputManager.AxisX = 1;
        }else {
            InputManager.AxisX = 0;
        }
    }
}

InputManager.load()

export default InputManager