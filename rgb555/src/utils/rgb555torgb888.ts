const rgb555torgb888 = (red: number, green: number, blue: number) => {
  return `rgb(${red * 8}, ${green * 8}, ${blue * 8})`;
};

export default rgb555torgb888;
