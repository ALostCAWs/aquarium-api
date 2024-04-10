export const checkArrayOfObjectImagesEqual = <T>(oldImageArray: T[], newImageArray: T[]) => {
  for (const [i, oldImage] of oldImageArray.entries()) {
    if (!checkObjectImagesEqual(oldImage, newImageArray[i])) {
      return false;
    }
  }

  return true;
}

export const checkObjectImagesEqual = <T>(oldImage: T, newImage: T): boolean => {
  for (const key in oldImage) {
    if (oldImage[key] !== newImage[key]) {
      console.log(oldImage[key] !== newImage[key]);
      return false;
    }
  }
  return true;
}