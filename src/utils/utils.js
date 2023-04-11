export function maxRectId(canvas) {
    let max_id = 0;
    canvas.getObjects('rect').forEach((o)=>{
        if (typeof o.rect_id !== 'undefined' && o.rect_id > max_id){
            max_id = o.rect_id;
        }
    })
    return max_id;
}