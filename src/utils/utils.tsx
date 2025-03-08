export function formatPopulationNumber(number: number) {
  const newNum = Math.round(number / 1000) * 1000;
  return newNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type ValueOf<T> = T[keyof T];

export function shuffleArray(array: any[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

export function calculateAverage(correct: number, incorrect: number) {
  if (correct === 0 && incorrect === 0) return 0;

  return (correct / (correct + incorrect)) * 100;
}
