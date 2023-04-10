<script>
    import {fabric} from "fabric";
    import {onMount} from 'svelte';
    let currentMode;
    const modes = {
        drug: 'drug',
        drawing: 'drawing'
    };

    let toggleDrug = document.getElementById("toggle-drug");
    let toggleDrawing = document.getElementById("toggle-drawing");
    let clearButton = document.getElementById("clear-canvas");

    let mousePressed = false;
    const canvas = initCanvas('canvas');

    canvas.on('mouse:move', (event) => {
        if(mousePressed && currentMode === modes.drug) {
            canvas.setCursor('grabbing');
            canvas.renderAll();
            const mEvent = event.e;
            const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
            canvas.relativePan(delta);
        }
    })

    canvas.on('mouse:down', (event) => {
        mousePressed = true;
        if(currentMode === modes.drug) {
            canvas.setCursor('grabbing');
            canvas.renderAll();
        }
    })

    canvas.on('mouse:up', (event) => {
        mousePressed = false;
        canvas.setCursor('default');
        canvas.renderAll();
    })

    function initCanvas(id) {
        return new fabric.Canvas(id, {
            width: 500,
            height: 500,
            backgroundImage: 'fon.jpg',
            selection: false
        });
    }

    function clearCanvas() {
        canvas.getObjects().forEach((o)=>{
            if(o !== canvas.backgroundImage) {
                canvas.remove(o)
            }
        })
    }

    function toggleMode(mode) {
        mode = mode.target.getAttribute('data-toggle');
        if(mode === modes.drug){
            if(currentMode === modes.drug) {
                currentMode = '';
            } else {
                currentMode = modes.drug;
                canvas.isDrawingMode = false;
                canvas.renderAll();
            }
        } else if (mode === modes.drawing) {
            if(currentMode === modes.drawing) {
                currentMode = '';
                canvas.isDrawingMode = false;
                canvas.renderAll();
            } else {
                canvas.freeDrawingBrush.color = 'rgba(213,0,0,0.5)'
                currentMode = modes.drawing;
                canvas.isDrawingMode = true;
                canvas.renderAll();
            }
        }
    }

    toggleDrug.addEventListener('click', toggleMode);
    toggleDrawing.addEventListener('click', toggleMode);
    clearButton.addEventListener('click', clearCanvas);
</script>

