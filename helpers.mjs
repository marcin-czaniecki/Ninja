export const createImage = (src, width, height) => {
  const image = new Image(width, height);
  image.src = src;
  return image;
};

export const createElement = (tagName, property) => {
  const element = document.createElement(tagName);

  //Set property element from object
  if (property) {
    for (const key in property) {
      if (property.hasOwnProperty.call(property, key)) {
        element[key] = property[key];
      }
    }
  }
  return element;
};
