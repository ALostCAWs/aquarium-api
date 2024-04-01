export const checkObjectImagesEqual = <T>(oldImage: T, newImage: T): boolean => {
  for (const key in oldImage) {
    if (oldImage[key] !== newImage[key]) {
      return false;
    }
  }
  return true;
}