const valueToHex = (value: number) => {
  return (value * 8).toString(16).padStart(2, '0');
};

const rgb555torgb888 = (red: number, green: number, blue: number) => {
  return `#${valueToHex(red)}${valueToHex(green)}${valueToHex(blue)}`;
};

export default rgb555torgb888;
