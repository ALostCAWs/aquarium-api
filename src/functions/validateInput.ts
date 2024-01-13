export const checkStringValid = (inputString: string) => {
  if (inputString === null || inputString === undefined || inputString === '') {
    return false;
  }
  return true;
}