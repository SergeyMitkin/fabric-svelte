<script>
    import {fabric} from "fabric";
    import {maxRectId} from "./utils/utils";
    // import {clearCanvas} from "./utils/utils";
    import {initCanvas} from "./utils/utils";

    let toggleDrug = document.getElementById("toggle-drug");
    let toggleDrawing = document.getElementById("toggle-drawing");
    // let clearButton = document.getElementById("clear-canvas");
    let rectButton = document.getElementById("rect-button");
    let textButton = document.getElementById("text-button");
    let editTextButton = document.getElementById("edit-text-button");
    // let groupButton = document.getElementById("group-button");
    // let ungroupButton = document.getElementById("ungroup-button");

    let mousePressed = false;
    let currentMode;
    const modes = {
        drug: 'drug',
        drawing: 'drawing'
    };
    const canvas = initCanvas('canvas');
    const canvCenter = canvas.getCenter();

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

    function createRect() {
        let max_id = maxRectId(canvas);
        let width = 100;
        let height = 100;
        const rect = new fabric.Rect({
            width: width,
            height: height,
            fill: 'rgba(213,0,0,0.5)',
            left: canvCenter.left - width/2,
            top: canvCenter.top - height/2,
            rect_id: max_id + 1
        })
        rect.on('selected', () => {
            textButton.removeAttribute('hidden');
        })
        rect.on('deselected', () => {
            textButton.setAttribute('hidden', '');
        })
        canvas.add(rect);
        canvas.renderAll();
    }

    function createText() {
        let activeRect = canvas.getActiveObject();
        const text = new fabric.Textbox('Текст' , {
            fontSize: 20,
            left: activeRect.left,
            top: activeRect.top,
            rect_id: activeRect.rect_id
        })
        text.on('deselected', () => {
            groupObjects(activeRect.rect_id);
        })
        canvas.setActiveObject(text);
        canvas.add(text);
        canvas.renderAll();
    }

    function editText() {
        let activeGroup = canvas.getActiveObject();
        activeGroup.destroy();
        let objects = activeGroup.getObjects();
        canvas.remove(activeGroup);
        canvas.add(...objects);
        activeGroup = null;
        canvas.requestRenderAll();
        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            if (obj instanceof fabric.Textbox) {
                canvas.setActiveObject(obj);
            }
        }
    }

    function groupObjects1(event) {
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

    function groupObjects(rect_id) {
        let objects = canvas.getObjects();
        let group_objects = [];
        let group_index = 0;
        for (let i = 0; i < objects.length; i++) {
            let obj = objects[i];
            if ((obj instanceof fabric.Rect || obj instanceof fabric.Textbox) && obj.rect_id === rect_id){
                group_objects[group_index] = objects[i];
                group_index++;
            }
        }
        let group = new fabric.Group(group_objects, {
            cornerColor: 'white',
            rect_id: rect_id
        });
        group.on('deselected', () => {
            editTextButton.setAttribute('hidden', '');
        })
        group.on('selected', () => {
            editTextButton.removeAttribute('hidden');
        })
        canvas.add(group);
        clearCanvas(group_objects);
        canvas.requestRenderAll();
    }

    function clearCanvas(group_objects) {
        group_objects.forEach((o) => {
            canvas.remove(o);
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
    // clearButton.addEventListener('click', clearCanvas);
    rectButton.addEventListener('click', createRect);
    textButton.addEventListener('click', createText);
    editTextButton.addEventListener('click', editText);
    // groupButton.addEventListener('click', groupObjects);
    // ungroupButton.addEventListener('click', groupObjects);
</script>

