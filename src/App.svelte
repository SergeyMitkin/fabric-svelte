<script>
    import {fabric} from "fabric";
    import {onMount} from 'svelte';

    let mousePressed = false;
    const canvas = initCanvas('canvas');
    setBackground('fon.jpg', canvas);

    canvas.on('mouse:move', (event) => {
        if(mousePressed) {
            canvas.setCursor('grabbing');
            canvas.renderAll();
            const mEvent = event.e;
            const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
            canvas.relativePan(delta);
        }
    })

    canvas.on('mouse:down', (event) => {
        mousePressed = true;
        canvas.setCursor('grabbing');
        canvas.renderAll();
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
            selection: false
        });
    }

    function setBackground(imgData, canvas) {
        fabric.Image.fromURL(imgData, (img) => {
            canvas.backgroundImage = img;
            canvas.renderAll();
        })
    }

</script>

