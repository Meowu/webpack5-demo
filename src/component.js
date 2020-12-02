export default (text = HELLO) => {
  console.info('trace.')
  const element = document.createElement("div");
  element.innerHTML = text;
  element.className = "app rounded bg-red-100 border max-w-md m-4 p-4";
  element.onclick = () => {
    import('./lazy').then(module => {
      element.textContent = module.default;
    }).catch(error => console.error(error));
  }
  return element;
};