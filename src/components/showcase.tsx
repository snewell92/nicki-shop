import { Motion } from "@motionone/solid";
import type { ImageMetadata } from "astro";

const fillWith = (numOfSlots: number, value: number) => {
  const arr = new Array(numOfSlots);
  arr.fill(value);

  return arr;
}

const fillSteady = (totalSlots: number, initial: Array<any>) => {
  const len = initial.length;
  const remaining = totalSlots - len;
  const last = initial.at(-1);

  return [...initial, ...fillWith(remaining, last)];
}

function *stepTo(initial: number, step: number, target: number) {
  // true == direction UP (adding), else down, subtracting
  let direction = target > initial ? true : false;
  let x = initial;

  yield x;
  while (direction ? target > x : target < x) {
    x = direction ? x + step : x - step;
    yield x;
  }
}

function mkArr(generatedIterable: Iterable<number>) {
  const xs = [];

  for (const x of generatedIterable) {
    xs.push(x);
  }

  return xs;
}

// first group (36)
const scaleSteps = [...fillWith(5, 4), ...mkArr(stepTo(4.0, .05, 2.5))];
const xSteps = [...fillWith(5, 0), ...mkArr(stepTo(0, 2, 62))];
const ySteps = [...fillWith(5, -10), ...mkArr(stepTo(-10, 4, 84))];
const opacitySteps = [...fillSteady(
  Math.max(scaleSteps.length, xSteps.length, ySteps.length) - 16,
  mkArr(stepTo(0, 0.2, 1))
), ...mkArr(stepTo(1, 0.2, 0))];

// transition (4)
const scaleTrans = [2.5, 2.5, 2.5, 2.5];
const xTrans = [62, 450, 450, 450];
const yTrans = [84, -250, -250, -250];
const opacityTrans = [0, 0, 0, 0];

// second group (36)
const scaleStepsTwo = fillSteady(36, mkArr(stepTo(2.5, 0.03, 1.8)));
const xStepsTwo = fillWith(36, 450);
const yStepsTwo = fillWith(36, -250);
const opacityStepsTwo = fillSteady(
  Math.max(scaleStepsTwo.length, xStepsTwo.length, yStepsTwo.length) - 4,
  mkArr(stepTo(0, 0.2, 1))
);

// final
const finalScale = [...scaleSteps, ...scaleTrans, ...scaleStepsTwo];
const finalX = [...xSteps, ...xTrans, ...xStepsTwo];
const finalY = [...ySteps, ...yTrans, ...yStepsTwo];
const finalOpacity = [...opacitySteps, ...opacityTrans, ...opacityStepsTwo];

export function Showcase({ image }: {image: ImageMetadata}) {
  return (
    <Motion.img
      animate={{
        opacity: finalOpacity,
        scale: finalScale,
        x: finalX,
        y: finalY
      }}
      transition={{
        duration: 25,
        easing: "ease-in"
      }}
      style="opacity:0"
      width={image.width}
      height={image.height}
      src={image.src}
    />
  );
}
