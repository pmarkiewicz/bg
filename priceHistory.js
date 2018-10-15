
const extractPrice = (item) => {
  const re = /\d+\.\d+/;

  const label = item.querySelector('.newcart_options > span.addwish');
  const pid = label.getAttribute('products_id');

  const priceTag = item.querySelector('.newcart_price');
  const priceText = priceTag.getAttribute('data-price');
  const priceNum = re.exec(priceText)[0];
  const price = parseFloat(priceNum);

  return {pid, price};
};

const getPrices = () => {
  const shoppingCartItems = document.querySelectorAll('.newcart_list_items');
  const priceList = [];

  for(item of shoppingCartItems) {
    const price = extractPrice(item);
    priceList.push(price);
  }

  return priceList;
};

const displayHistory = (priceHistory, curr) => {
  for (idx in priceHistory) {
    const priceSelect = document.querySelector(`.newcart_options > span.addwish[products_id="${idx}"]`);
    const priceLst = priceHistory[idx][curr];
    if (priceSelect && priceLst) {
      const itemParent = priceSelect.parentElement.parentElement;
      const itemPrice = itemParent.querySelector('.newcart_price');
      const lastPrice = priceLst[0].price;
      let s = '';
      for (item of priceLst) {
        s += `${item.price}, `; 
      }
      itemPrice.innerHTML += `<br/><u>(${s})</u>`;
    }
  }
};

const checkPrices = async () => {
  const priceHistory = await loadHistory() || {};
  const curr = getCurrency();

  displayHistory(priceHistory, curr);

  const priceList = getPrices();
  for (price of priceList) {
    if (!priceHistory[price.pid]) {
      priceHistory[price.pid] = {};
    };
    const history = priceHistory[price.pid][curr] || [];
    if (!history[0] || history[0].price != price.price) {
      history.unshift({date: Date.now(), price: price.price});
      priceHistory[price.pid][curr] = history;
    }
  }

  saveHistory(priceHistory);
};

