<script>
    import {fabric} from "fabric";

    let toggleDrug = document.getElementById("toggle-drug");
    let toggleDrawing = document.getElementById("toggle-drawing");
    let clearButton = document.getElementById("clear-canvas");
    let rectButton = document.getElementById("rect-button");
    let textButton = document.getElementById("text-button");
    let groupButton = document.getElementById("group-button");
    let ungroupButton = document.getElementById("ungroup-button");

    let mousePressed = false;
    let currentMode;
    const modes = {
        drug: 'drug',
        drawing: 'drawing'
    };
    const canvas = initCanvas('canvas');
    const canvCenter = canvas.getCenter();
    const group = {};

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

    function groupObjects(event) {
        let shouldGroup = event.target.getAttribute('data-group');
        if(shouldGroup === 'group') {
            const objects = canvas.getObjects();
            group.val = new fabric.Group(objects, {cornerColor: 'white'});
            clearCanvas(canvas);
            canvas.add(group.val);
            canvas.requestRenderAll()
        } else {
            group.val.destroy();
            const oldGroup = group.val.getObjects();
            canvas.remove(group.val);
            canvas.add(...oldGroup);
            group.val = null;
            canvas.requestRenderAll();
        }
    }

    function createRect() {
        let max_id = 0;
        canvas.getObjects('rect').forEach((o)=>{
            if(o.rect_id > max_id) {
                max_id = o.rect_id;
            }
        })
        console.log(max_id);
        const rect = new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'rgba(213,0,0,0.5)',
            left: canvCenter.left,
            top: canvCenter.top,
            originX: 'center',
            originY: 'center',
            rect_id: max_id + 1
        })
        rect.on('selected', () => {
            textButton.removeAttribute('hidden');
            alert(rect.id);
        })
        rect.on('deselected', () => {
            textButton.setAttribute('hidden', '');
        })
        canvas.add(rect);
        canvas.renderAll();
    }

    function createText() {
        const text = new fabric.Textbox('Текст' , {
            fontSize: 20
        })
        canvas.add(text);
        canvas.renderAll();
    }

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

    function toggleMode(event) {
        let mode = event.target.getAttribute('data-toggle');
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
                canvas.freeDrawingBrush.color = 'red'
                currentMode = modes.drawing;
                canvas.isDrawingMode = true;
                canvas.renderAll();
            }
        }
    }

    toggleDrug.addEventListener('click', toggleMode);
    toggleDrawing.addEventListener('click', toggleMode);
    clearButton.addEventListener('click', clearCanvas);
    rectButton.addEventListener('click', createRect);
    textButton.addEventListener('click', createText);
    groupButton.addEventListener('click', groupObjects);
    ungroupButton.addEventListener('click', groupObjects);
</script>

