const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d")

document.body.style.margin = 0

document.body.appendChild(canvas)

const axisImg = document.createElement("img")
axisImg.src = "axis.png"

ctx.translate(0.5, 0.55);

const initialtilesX = 230;
const initialtilesY = 107;
const initialtileSize = 20;

let tilesX = initialtilesX;
let tilesY = initialtilesY;
let tileSize = initialtileSize;
let tilesOffX = window.innerWidth / 2;
let tilesOffY = window.innerHeight / 2;

let zoom = 1;

let mouseDown = false

var mx = -1;
var my = -1;

document.body.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.onmousedown = (e) => {
    e.preventDefault()
    if (!isMoving) {
        if (e.button == 0) {
            points.push([coordX, coordY]);
        }

    } else {
        reflectionType = 2;
        isMoving = false;
        if (selected == 2) {
            if (coordY == 0) {
                selected = 2;
            } else {
                symY = coordY;
                symX = 0;
            }
        } else {
            if (coordX == 0) {
                selected = 1;
            } else {
                symX = coordX;
                symY = 0;
            }
        }
    }
    if (e.button == 2) {
        mouseDown = true;
    }
    return 0;
}
document.onmouseup = () => {
    mouseDown = false;
}
document.onmousemove = (e) => {
    mx = e.pageX;
    my = e.pageY;
    if (mouseDown) {
        tilesOffX += e.movementX;
        tilesOffY += e.movementY;

        tilesOffX = tilesOffX > (initialtilesX * tileSize) / 2 ? (initialtilesX * tileSize) / 2 : tilesOffX;
        tilesOffX = tilesOffX < (window.innerWidth - (tilesX / 2) * tileSize) ? (window.innerWidth - (tilesX / 2) * tileSize) : tilesOffX
        tilesOffY = tilesOffY > (initialtilesY * tileSize) / 2 ? (initialtilesY * tileSize) / 2 : tilesOffY;
        tilesOffY = tilesOffY < (window.innerHeight - (tilesY / 2) * tileSize) ? (window.innerHeight - (tilesY / 2) * tileSize) : tilesOffY

        // tilesOffY = tilesOffY > (initialtilesY*tileSize)/2 ? (initialtilesY*tileSize)/2 : tilesOffY;
    }
}

ctx.imageSmoothingEnabled = false;
canvas.width = window.innerWidth - 5
canvas.height = window.innerHeight - 5

window.onresize = () => {
    canvas.width = window.innerWidth - 5
    canvas.height = window.innerHeight - 5
}

document.addEventListener("wheel", (e) => {
    zoom += Math.sign(e.deltaY) * .5;
    zoom = zoom <= 0.5 ? .5 : zoom > 3 ? 3 : zoom;
    // tilesOffX = (canvas.width/2)/zoom;
    // tilesOffY = (initialtilesY/2)*zoom;
    // tilesX = initialtilesX*zoom;
    // tilesY = initialtilesY*zoom;
    tileSize = initialtileSize / zoom;
    // the following two lines took me 2 hours to figure out :DDDDDDDD
    tilesOffX = tilesOffX > (initialtilesX * tileSize) / 2 ? (initialtilesX * tileSize) / 2 : tilesOffX;
    tilesOffX = tilesOffX < (window.innerWidth - (tilesX / 2) * tileSize) ? (window.innerWidth - (tilesX / 2) * tileSize) : tilesOffX
    tilesOffY = tilesOffY > (initialtilesY * tileSize) / 2 ? (initialtilesY * tileSize) / 2 : tilesOffY;
    tilesOffY = tilesOffY < (window.innerHeight - (tilesY / 2) * tileSize) ? (window.innerHeight - (tilesY / 2) * tileSize) : tilesOffY
})

let points = [];
let remnantPoints = [];

let selected = 1;
let reflectionType = 1;

let isMoving = false;
let moveType = 1;

document.onkeydown = (e) => {
    if (e.key == "f") {
        if (reflectionType == 1) {
            for (let i = 0; i < points.length; i++) {
                if (selected == 1) {
                    points[i] = [-points[i][0], points[i][1]]
                } else if (selected == 2) {
                    points[i] = [points[i][0], -points[i][1]]
                }
            }
        } else if (reflectionType == 2) {
            //2y - x
            for (let i = 0; i < points.length; i++) {
                if (Math.abs(symX) > 0) {
                    points[i] = [(symX * 2) - points[i][0], points[i][1]]
                } else if (Math.abs(symY) > 0) {
                    points[i] = [points[i][0], (symY * 2) - points[i][1]]
                }
            }
        }
    }
    if (e.key == "1") {
        reflectionType = 1;
        selected = 1
    }
    if (e.key == "2") {
        reflectionType = 1;
        selected = 2
    }
    if (e.key == "m") {
        isMoving = !isMoving;
        reflectionType = 1;
    }
    if (e.key == "c") {
        points = []
    }
    if (e.key == "h") {
        isHelpOpen = !isHelpOpen;
    }
}

// console.log(window.innerWidth)

let coordX = 0
let coordY = 0

let symX = 0;
let symY = 0;

let help = []
help.push("Help Guide")
help.push("Left Click - Place point / set line of sym.")
help.push("Scroll to zoom in/out")
help.push("Right Click - Move around")
help.push("F - Reflect all points")
help.push("1 - Select X axis")
help.push("2 - Select Y axis")
help.push("M - Set new Line of sym.")
help.push("C - Clear all points")
help.push("H - Close menu")

help.reverse()

let isHelpOpen = false;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#21252b"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "rgba(255, 255, 255, .2)"


    // const dpi = window.devicePixelRatio;
    // ctx.scale(dpi, dpi);

    coordX = Math.ceil((Math.floor(mx / tileSize) * tileSize - tilesOffX) / tileSize)
    coordY = -Math.floor((Math.floor(my / tileSize) * tileSize - tilesOffY) / tileSize)

    for (let x = -tilesX / 2; x < tilesX / 2; x++) {
        if (x == 0) {
            if (selected == 1 && reflectionType != 2 && !isMoving) {
                ctx.strokeStyle = "rgba(100, 149, 237, 1)"
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = "rgba(255, 255, 255, 1)"
                ctx.lineWidth = 2;
            }
        } else {
            ctx.strokeStyle = "rgba(255, 255, 255, .2)"
            ctx.lineWidth = .5;
        }
        ctx.beginPath();
        ctx.moveTo(x * tileSize + tilesOffX, 0);
        ctx.lineTo(x * tileSize + tilesOffX, canvas.height);
        ctx.stroke();
    }

    let jaws = 2;

    if (zoom < 1) {
        jaws = 1
    }
    if (zoom > 1) {
        jaws = 5
    }

    for (let x = -tilesX / 2; x < tilesX / 2; x += jaws) {
        if (zoom <= 1) {
            ctx.font = parseInt(22 - (12 * zoom)) + "px Roboto";
        }
        if (zoom > 2) {
            ctx.font = parseInt(12) + "px Roboto";
        }
        let why = tilesOffY + 10
        if (why < 10) {
            why = 10
        }
        if (why > canvas.height) {
            why = canvas.height
        }
        ctx.fillText(x, (x * tileSize + tilesOffX) + 2, why);
    }

    for (let y = -tilesY / 2; y < tilesY / 2; y++) {
        if (y == 0.5) {
            if (selected == 2 && reflectionType != 2 && !isMoving) {
                ctx.strokeStyle = "rgba(100, 149, 237, 1)"
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = "rgba(255, 255, 255, 1)"
                ctx.lineWidth = 2;
            }
        } else {
            ctx.strokeStyle = "rgba(255, 255, 255, .2)"
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo(0, y * tileSize + tilesOffY);
        ctx.lineTo(canvas.width, y * tileSize + tilesOffY);
        ctx.stroke();
    }

    for (let y = -tilesY / 2; y < tilesY / 2; y += jaws) {
        if (Math.floor(y) == 0) {
            continue;
        }
        if (zoom <= 1) {
            ctx.font = parseInt(22 - (12 * zoom)) + "px Roboto";
        }
        if (zoom > 2) {
            ctx.font = parseInt(12) + "px Roboto";
        }
        let ecks = tilesOffX
        if (ecks < 0) {
            ecks = 0
        }
        if (ecks > canvas.width - 10) {
            ecks = canvas.width - 20
        }
        ctx.fillText(-Math.floor(y), ecks + 5, y * tileSize + tilesOffY + 7);
    }

    if (!isMoving && reflectionType == 2) {
        if (selected == 2) {
            ctx.beginPath();
            ctx.moveTo(0, (-symY) * tileSize + tilesOffY + tileSize / 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(100, 149, 237, 1)';
            ctx.lineTo(canvas.width, (-symY) * tileSize + tilesOffY + tileSize / 2);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(symX * tileSize + tilesOffX, 0);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(100, 149, 237, 1)';
            ctx.lineTo(symX * tileSize + tilesOffX, canvas.height);
            ctx.stroke();
        }
    }

    if (isMoving) {
        if (selected == 2) {
            ctx.beginPath();
            ctx.moveTo(0, Math.floor(my / tileSize) * tileSize + tilesOffY % tileSize - tileSize / 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(100, 149, 237, 1)';
            ctx.lineTo(canvas.width, Math.floor(my / tileSize) * tileSize + tilesOffY % tileSize - tileSize / 2);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(Math.floor(mx / tileSize) * tileSize + tilesOffX % tileSize, 0);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(100, 149, 237, 1)';
            ctx.lineTo(Math.floor(mx / tileSize) * tileSize + tilesOffX % tileSize, canvas.height);
            ctx.stroke();
        }
    } else {
        ctx.beginPath();
        ctx.arc(Math.floor(mx / tileSize) * tileSize + tilesOffX % tileSize, Math.floor(my / tileSize) * tileSize + tilesOffY % tileSize - tileSize / 2, 1.5 * (4 - zoom), 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
    }


    for (let i = 0; i < points.length; i++) {

        let point = points[i];
        ctx.beginPath();
        ctx.arc(point[0] * tileSize + tilesOffX, (-point[1]) * tileSize + tilesOffY + tileSize / 2, 1.5 * (4 - zoom), 0, 2 * Math.PI, false);
        ctx.fillStyle = 'lightblue';
        ctx.fill();
    }

    if (isHelpOpen) {
        for (let i = 0; i < help.length; i++) {
            ctx.font = "24px Roboto";
            ctx.fillStyle = 'white';
            ctx.fillText(help[i], 10, window.innerHeight - 20 - 28 * i)
        }
    } else {
        ctx.font = "24px Roboto";
        ctx.fillStyle = 'white';
        ctx.fillText("H - Help", 10, window.innerHeight - 20)
    }


    ctx.globalAlpha = 0.25;
    ctx.drawImage(axisImg, canvas.width - 85, canvas.height - 85, 75, 75);
    ctx.globalAlpha = 1;

    requestAnimationFrame(render)
}


render()