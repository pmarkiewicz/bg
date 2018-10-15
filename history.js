const loadHistory = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('prices', function (result) {
      //console.log(result.prices);
      return resolve(result.prices) || {};
    })
  });
};

const saveHistory = (priceList) => {
  chrome.storage.local.set({'prices': priceList}, function() {
    //console.log('Value is set to ' + priceList);
  });
};
