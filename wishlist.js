const checkWishlist = async () => {
  let priceHistory;


  const displayHistory = (curr) => {
    for (idx in priceHistory) {
      const priceSelect = document.getElementById(idx);
      const priceLst = priceHistory[idx][curr];
      if (priceSelect && priceLst) {
        const itemPrice = priceSelect.querySelector('.price');
        const lastPrice = priceLst[0].price;
        let s = '';
        for (item of priceLst) {
          s += `${item.price}, `; 
        }
        itemPrice.innerHTML += `<br/><u style='font-size: 12px;color:#444;font-weight: normal'>(${s})</u>`;
      }
    }
  };

  const extractPrice = (item) => {
    const re = /\d+\.\d+/;

    const pid = item.id;

    const priceTag = item.querySelector('.price');
    const priceText = priceTag.innerText;
    const priceNum = re.exec(priceText)[0];
    const price = parseFloat(priceNum);

    return {pid, price};
  };

  const getPrices = () => {
    const wishItems = document.querySelectorAll('#good_tabs_box > .home_board > .wishlist_list_new');
    const priceList = [];

    for(item of wishItems) {
      const price = extractPrice(item);
      priceList.push(price);
    }

    return priceList;
  };


  const updateHistory = (curr) => {
    const priceList = getPrices();  // TODO: refactor, same function as in priceHistory
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

  const config = { attributes: false, childList: true, subtree: true };
  const targetNode = document.getElementById('good_tabs_box');
  const curr = getCurrency();

  const observer = new MutationObserver((mutationsList, observer) => {
    observer.disconnect();

    console.log('wish');
    updateHistory(curr);
    displayHistory(curr);

    observer.observe(targetNode, config);
  });


  priceHistory = await loadHistory();
  
  updateHistory(curr);
  displayHistory(curr);

  observer.observe(targetNode, config);
};
