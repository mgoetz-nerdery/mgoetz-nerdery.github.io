
import { useState } from 'react';
import ColorColumn from './ColorColumn';
import styles from './App.module.css';
import './App.css';
import rgb555torgb888 from './utils/rgb555torgb888';

function luminance(val: number) {
  const sRGB = val / 255;
  return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

const overallLuminance = (red: number, green: number, blue: number) => {
  return (0.2126 * luminance(red * 8) + 0.7152 * luminance(green * 8) + 0.0722 * luminance(blue * 8));
};

function App() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  const displayColor = rgb555torgb888(red, green, blue);

  // Calculate relative luminance for contrast
  const L = overallLuminance(red, green, blue);

  // Contrast ratio with white and black
  const contrastWhite = (1.05) / (L + 0.05);
  const contrastBlack = (L + 0.05) / 0.05;
  const textColor = contrastWhite > contrastBlack ? '#fff' : '#222';

  return (
    <div className={styles.colorPickerApp}>
      <h1>RGB555 Color Picker</h1>
      <div className={styles.selectedColorWrapper}>
        <div
          className={styles.selectedColorDisplay}
          style={{ background: displayColor }}
        >
          <span
            className={styles.selectedColorText}
            style={{ color: textColor }}
          >
            {displayColor}
          </span>
        </div>
      </div>
      <div className={styles.colorPickerRow}>
        <ColorColumn color="red" red={red} green={green} blue={blue} setValue={setRed} />
        <ColorColumn color="green" red={red} green={green} blue={blue} setValue={setGreen} />
        <ColorColumn color="blue" red={red} green={green} blue={blue} setValue={setBlue} />
      </div>
    </div>
  );
}

export default App;
