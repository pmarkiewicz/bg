console.log("popup started");

function vv1() {
  chrome.tabs.query({active: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, 'checkPrices');
  });

  window.close();
}

function vv2() {
  chrome.tabs.query({active: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, 'checkPricesParallel');
    console.log('checkPricesParallel');
    //window.close();
  });

}

document.getElementById('vv1').addEventListener('click', vv1);
document.getElementById('vv2').addEventListener('click', vv2);



