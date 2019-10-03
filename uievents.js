console.log('uievents');

chrome.runtime.onMessage.addListener(function(message, sender) {
  console.log(`click ${message}`);

  if (message === 'checkPrices') {
    tryCodes();
  }

  if (message === 'checkPricesParallel') {
    tryCodesParallel();
  }

  if (message === 'shopping') {
    checkPrices();
  }

  if (message === 'wish') {
    checkWishlist();
  }
});


