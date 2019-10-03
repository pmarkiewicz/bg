//console.log('bg');

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('icon click');
    const r = chrome.tabs.query({active:true,windowType:"normal", currentWindow: true},
        function(d){
            console.log("TAB: " + d[0].id);
            chrome.tabs.sendMessage(d[0].id, 'checkPricesParallel');
        });
});

chrome.webNavigation.onCompleted.addListener(function callback(d) {
        console.log('onCompleted ', d);
        chrome.tabs.sendMessage(d.tabId, 'shopping');
    },
    {url: [{urlContains: 'banggood.com/shopping_cart.html'}
    ]}
);

chrome.webNavigation.onCompleted.addListener(function callback(d) {
    console.log('on widhlist ', d);
    chrome.tabs.sendMessage(d.tabId, 'wish');
},
{url: [{urlContains: 'https://www.banggood.com/index.php'}
]}
);
