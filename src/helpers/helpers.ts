export const getRoot = () => {
  const root = document.getElementById("root");

  if (!root) {
    throw Error("You need add div with id root to your index.html");
  }
  const divRoot = root as HTMLDivElement;
  return divRoot;
};

export const createImage = (src: string) => {
  const img = new Image();
  img.src = src;
  return img;
};
