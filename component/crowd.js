import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const config = {
    src: "/crowd-sheet.png",
    rows: 15,
    cols: 7,
};

const randomRange = (min, max) => min + Math.random() * (max - min);
const randomIndex = (array) => Math.floor(randomRange(0, array.length));
const removeFromArray = (array, i) => array.splice(i, 1)[0];
const removeRandomFromArray = (array) => removeFromArray(array, randomIndex(array));
const getRandomFromArray = (array) => array[randomIndex(array)];
const walks = [normalWalk];

const resetPeep = ({ stage, peep }) => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
    const startY = stage.height - peep.height + offsetY;

    const startX = direction === 1 ? -peep.width : stage.width + peep.width;
    const endX = direction === 1 ? stage.width : 0;
    peep.scaleX = direction;

    peep.x = startX;
    peep.y = startY;
    peep.anchorY = startY;

    return { startX, startY, endX };
};

function normalWalk({ peep, props }) {
    const { startX, startY, endX } = props;

    const tl = gsap.timeline();
    tl.timeScale(randomRange(0.5, 1.5));
    tl.to(peep, { duration: 10, x: endX, ease: "none" }, 0);
    tl.to(peep, { duration: 0.25, repeat: 10 / 0.25, yoyo: true, y: startY - 10 }, 0);

    return tl;
}

class Peep {
    constructor({ image, rect }) {
        this.image = image;
        this.setRect(rect);
        this.x = 0;
        this.y = 0;
        this.anchorY = 0;
        this.scaleX = 1;
        this.walk = null;
    }

    setRect(rect) {
        this.rect = rect;
        this.width = rect[2];
        this.height = rect[3];
        this.drawArgs = [this.image, ...rect, 0, 0, this.width, this.height];
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleX, 1);
        ctx.drawImage(...this.drawArgs);
        ctx.restore();
    }
}

const Crowd = () => {
    const canvasRef = useRef(null);
    const allPeeps = useRef([]);
    const availablePeeps = useRef([]);
    const crowd = useRef([]);
    const stage = useRef({ width: 0, height: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            createPeeps(img);
            resizeCanvas(canvas);
            initCrowd();
            gsap.ticker.add(() => render(canvas, ctx));
            window.addEventListener("resize", () => resizeCanvas(canvas));
        };

        img.src = config.src;

        return () => {
            gsap.ticker.remove(() => render(canvas, ctx));
            window.removeEventListener("resize", () => resizeCanvas(canvas));
        };
    }, []);

    const createPeeps = (img) => {
        const { rows, cols } = config;
        const { naturalWidth: width, naturalHeight: height } = img;
        const rectWidth = width / rows;
        const rectHeight = height / cols;

        for (let i = 0; i < rows * cols; i++) {
            allPeeps.current.push(
                new Peep({
                    image: img,
                    rect: [
                        (i % rows) * rectWidth,
                        Math.floor(i / rows) * rectHeight,
                        rectWidth,
                        rectHeight,
                    ],
                })
            );
        }
    };

    const resizeCanvas = (canvas) => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        stage.current.width = rect.width;
        stage.current.height = rect.height;

        crowd.current.forEach((peep) => peep.walk.kill());
        crowd.current.length = 0;
        availablePeeps.current.length = 0;
        availablePeeps.current.push(...allPeeps.current);

        initCrowd();
    };

    const initCrowd = () => {
        while (availablePeeps.current.length) {
            addPeepToCrowd().walk.progress(Math.random());
        }
    };

    const addPeepToCrowd = () => {
        const peep = removeRandomFromArray(availablePeeps.current);
        const walk = getRandomFromArray(walks)({
            peep,
            props: resetPeep({ peep, stage: stage.current }),
        }).eventCallback("onComplete", () => {
            removePeepFromCrowd(peep);
            addPeepToCrowd();
        });

        peep.walk = walk;
        crowd.current.push(peep);
        crowd.current.sort((a, b) => a.anchorY - b.anchorY);

        return peep;
    };

    const removePeepFromCrowd = (peep) => {
        crowd.current = crowd.current.filter((p) => p !== peep);
        availablePeeps.current.push(peep);
    };

    const render = (canvas, ctx) => {
        canvas.width = canvas.width; // Clear canvas
        ctx.save();
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        crowd.current.forEach((peep) => {
            peep.render(ctx);
        });

        ctx.restore();
    };

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                bottom: "0%",
                zIndex: -1,
                width: "100%",
                height: "250px",
                opacity: "0.9",
            }}
        />
    );
};

export default Crowd;
