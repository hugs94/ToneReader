//Some helper functions that perform simple math/logic

//clean string
export const normalize = str => {
  return str.replace(/\s+/g, "-").toLowerCase();
};
//turn to 50-100 range num. not actual percent
export const percentagify = score => {
  return parseFloat((score * 100).toFixed(3));
};
/**convert values from range 50-100 to 0-1
 * let prevRange = (prevMax - prevMin)
 * let newRange = (newMax - newMin)
 * let newVal = (((num - prevMin)*newRange)/prevRange)+newMin */
export const newMinMax = num => {
  Number(num);
  let newNum = ((num - 50) * (1 - 0)) / (100 - 50) + 0;
  return parseFloat(newNum.toFixed(3));
};
