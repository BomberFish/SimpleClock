export function zeroPad(n) {
  if (n < 10) {
    n = "0" + n;
  }
  return n;
}

export function hoursToAngle(hours, minutes) {
  let hrAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hrAngle + minAngle;
}

export function minutesToAngle(minutes, seconds) {
  let minAngle = (360 / 60) * minutes;
  let secAngle = (1 / 60) * seconds;
  return (minAngle + secAngle) - 1;
}

export function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

export function comma(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}