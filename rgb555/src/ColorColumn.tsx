import { useEffect, useRef, type MouseEvent } from 'react';
import styles from './ColorColumn.module.css';
import rgb555torgb888 from './utils/rgb555torgb888';

type ColorColumnProps = {
  color: 'red' | 'green' | 'blue';
  red: number;
  green: number;
  blue: number;
  setValue: (v: number) => void;
  canvasHandler: (x: number, y: number) => void;
};

const CANVAS_SIZE = 384;
const CANVAS_PIXEL_SIZE = CANVAS_SIZE / 32;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const normalize = (value: number) => {
  return clamp(Math.floor(value), 0, 31);
}

const drawCanvas = (canvas: HTMLCanvasElement, color: 'red' | 'green' | 'blue', value: number, xCoord: number, yCoord: number) => {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get context');
  }

  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      context.fillStyle =
        color === 'red' ? rgb555torgb888(value, x, y) :
        color === 'green' ? rgb555torgb888(x, value, y) :
        rgb555torgb888(x, y, value);
      context.fillRect(x * CANVAS_PIXEL_SIZE, y * CANVAS_PIXEL_SIZE, CANVAS_PIXEL_SIZE, CANVAS_PIXEL_SIZE);
    }
  }

  context.strokeStyle = '#ffffff';
  context.strokeRect(xCoord * CANVAS_PIXEL_SIZE, yCoord * CANVAS_PIXEL_SIZE, CANVAS_PIXEL_SIZE, CANVAS_PIXEL_SIZE);
};

function ColorColumn({ color, red, green, blue, setValue, canvasHandler }: ColorColumnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const value = 
    color === 'red' ? red :
    color === 'green' ? green :
    blue;

  const getGradientStop = (index: number) => {
    if (color === 'red') {
      return rgb555torgb888(index, green, blue);
    }
    if (color === 'green') {
      return rgb555torgb888(red, index, blue);
    }
    if (color === 'blue') {
      return rgb555torgb888(red, green, index);
    }
  };

  useEffect(() => {
    const xCoord = color === 'red' ? green : red;
    const yCoord = color === 'blue' ? green : blue;

    drawCanvas(canvasRef.current!, color, value, xCoord, yCoord);
  }, [blue, color, green, red, value])

  const labelClass =
    color === 'red' ? styles.red :
    color === 'green' ? styles.green :
    styles.blue;

  const backgroundColor = Array.from({ length: 32 }).map((_, index) => 
    `linear-gradient(${getGradientStop(index)}, ${getGradientStop(index)})`
  ).join(', ');

  const triggerCanvas = (e: MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = normalize((e.clientX - rect.left) / CANVAS_PIXEL_SIZE);
    const y = normalize((e.clientY - rect.top) / CANVAS_PIXEL_SIZE);
    canvasHandler(x, y);
  };

  const onCanvasMouseMove = (e: MouseEvent) => {
    if (e.buttons === 1) {
      triggerCanvas(e);
    }
  };

  const sliderId = `${color}-slider`;
  const textId = `${color}-text`;
  const canvasId = `${color}-canvas`;
  return (
    <div className={styles.colorSliderColumn}>
      <label htmlFor={sliderId} className={`${styles.label} ${labelClass}`}>
        {color.charAt(0).toUpperCase() + color.slice(1)}
      </label>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={31}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        className={styles.sliderInput}
        style={{'--image': backgroundColor} as React.CSSProperties}
      />
      <input
        id={textId}
        type="number"
        min={0}
        max={31}
        value={value}
        onChange={e => setValue(normalize(Number(e.target.value)))}
        className={styles.numberInput}
      />
      <canvas
        id={canvasId}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className={styles.colorCanvas}
        onMouseDown={triggerCanvas}
        onMouseMove={onCanvasMouseMove}
        ref={canvasRef}
      />
    </div>
  );
}

export default ColorColumn;
