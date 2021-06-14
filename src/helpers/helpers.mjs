export const createImage = (src, width, height) => {
  const image = new Image(width, height);
  image.src = src;
  return image;
};
