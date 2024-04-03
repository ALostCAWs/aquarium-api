export const checkArrayOfObjectImagesEqual = <T>(oldImageArray: T[], newImageArray: T[]) => {
  oldImageArray.forEach((oldImage, i) => {
    if (!checkObjectImagesEqual(oldImage, newImageArray[i])) {
      return false;
    }
  });

  return true;
}

export const checkObjectImagesEqual = <T>(oldImage: T, newImage: T): boolean => {
  for (const key in oldImage) {
    if (oldImage[key] !== newImage[key]) {
      return false;
    }
  }
  return true;
}