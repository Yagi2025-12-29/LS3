export async function loadSteps() {
  const res = await fetch("./data/steps.json");
  return await res.json();
}
