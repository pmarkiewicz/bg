
const getCurrency = () => {
  const shipping = document.querySelector(".shipto em").innerText;
  return shipping.split(',')[1].trim();
};
