import { useEffect, useRef } from 'react';
import styles from './ColorColumn.module.css';
import rgb555torgb888 from './utils/rgb555torgb888';

type ColorColumnProps = {
  color: 'red' | 'green' | 'blue';
  red: number;
  green: number;
  blue: number;
  setValue: (v: number) => void;
};

const CANVAS_SIZE = 384;
const CANVAS_PIXEL_SIZE = CANVAS_SIZE / 32;

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

function ColorColumn({ color, red, green, blue, setValue }: ColorColumnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const value = 
    color === 'red' ? red :
    color === 'green' ? green :
    blue;

  useEffect(() => {
    const xCoord = color === 'red' ? green : red;
    const yCoord = color === 'blue' ? green : blue;

    drawCanvas(canvasRef.current!, color, value, xCoord, yCoord);
  }, [blue, color, green, red, value])


  const labelClass =
    color === 'red' ? styles.red :
    color === 'green' ? styles.green :
    styles.blue;

  const gradientStart =
    color === 'red' ? rgb555torgb888(0, green, blue) :
    color === 'green' ? rgb555torgb888(red, 0, blue) :
    rgb555torgb888(red, green, 0);

  const gradientEnd =
    color === 'red' ? rgb555torgb888(31, green, blue) :
    color === 'green' ? rgb555torgb888(red, 31, blue) :
    rgb555torgb888(red, green, 31);

  const sliderId = `${color}-slider`;
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
        style={{'--gradient-start': gradientStart, '--gradient-end': gradientEnd} as React.CSSProperties}
      />
      <input
        type="number"
        min={0}
        max={31}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        className={styles.numberInput}
      />
      <canvas id={canvasId} width={CANVAS_SIZE} height={CANVAS_SIZE} className={styles.colorCanvas} ref={canvasRef} />
    </div>
  );
}

export default ColorColumn;
