export default (text = "Hello world.") => {
  const element = document.createElement("div");
  element.innerHTML = text;
  element.className = "app rounded bg-red-100 border max-w-md m-4 p-4";
  return element;
};