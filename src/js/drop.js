export class DragAndDrop {
    constructor(parentWrapper, cardClass) {
        this.parrentWrapper = parentWrapper
        this.cardClass = cardClass
        this.cardInfo()
    }


    drag(e) {
        e.dataTransfer.setData('text', e.currentTarget.id)
    }

    allowDrop(e) {
        e.preventDefault();
    }

    cardInfo() {
        const container = document.querySelector(this.parrentWrapper);
        const visitCard = document.querySelectorAll(this.cardClass)
        for (let i= 0 ; i < visitCard.length; i++) {
            visitCard[i].id = i
        }
        console.log(visitCard)
        visitCard.forEach((el) => {
            el.setAttribute("draggable", "true")
            el.addEventListener('dragstart', this.drag)
        })


        container.addEventListener('dragover', this.allowDrop);
        container.addEventListener('drop', function drop(e) {
            e.preventDefault();
            const data = e.dataTransfer.getData('text');
            const draggableEl = document.getElementById(data);
            visitCard.forEach(el => {
                el.dataset.right = el.getBoundingClientRect().right;
                el.dataset.left = el.getBoundingClientRect().left;
                el.dataset.bottom = el.getBoundingClientRect().bottom;
            });
            let rowFactor = 0;
            for (let i = 0; i < visitCard.length; i++) {
                i !== 0 && i % 3 === 0 ? rowFactor += 3 : "";
                if (visitCard[2 + rowFactor]) {
                    if (e.clientX > +visitCard[2 + rowFactor].dataset.right) {
                        if (e.clientY <= +visitCard[i].dataset.bottom) {
                            visitCard[2 + i].after(draggableEl);
                            rowFactor = 0;
                            break;
                        }
                    }
                }
                if (e.clientY <= +visitCard[i].dataset.bottom && e.clientX <= +visitCard[i].dataset.left) {
                    visitCard[i].before(draggableEl);
                    break;
                } else if (e.clientY <= +visitCard[i].dataset.bottom && e.clientX <= +visitCard[i].dataset.right) {
                    visitCard[i].after(draggableEl);
                    break;
                }
                if (i === visitCard.length - 1) {
                    visitCard[visitCard.length - 1].after(draggableEl);
                }
            }
        })
    }
}
