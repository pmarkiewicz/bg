const tryCodesParallel = async () => {
  const resultLookup = 'input type="text" name="changecouponcode"';
  const resultEnd = 'u class="cancelCoupon" data-type="cancel"';
  const body = document.querySelector('body');

  const results = [];

  const insertResult = (result) => {
    const input = document.querySelector('input[name=changecouponcode]');
    const apply = document.querySelector('span.useCoupon');
  
    input.value = result.code;

    if (result.discount > 0.0) {
      apply.click();
    }
  };

  const loadCodes = () => {
    const url = chrome.runtime.getURL('data/codes.json');

    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json()) //assuming file contains json
        .then((json) => resolve(json));
    })
  };

  const sendReq = (code) => {
    return new Promise((resolve, reject) => {
      $.ajax ({
        url: 'https://www.banggood.com/index.php',
        type: 'POST',
        data: `com=shopcartnew&t=useCoupon&coupon_code=${code}&step=1&useCoupstep=2&clearCoupon=undefined`,
        dataType: 'html',
        success: (data) => {
          const idx = data.indexOf(resultLookup);
          const result = data.substring(idx);
          const idx2 = result.indexOf(resultEnd);
          const result2 = result.substring(0, idx2);

          const discountStr = result2.match(/\d+\.\d+/);
          const discount = {code, discount: discountStr ? parseFloat(discountStr) : 0.0};

          resolve(discount);
        },
        error: (error) => {
          reject(error);
        }
    });
    });
  };
  
  body.classList.add('transparent-box');

  const codes = await loadCodes();
  console.log(codes);

  for (const code of codes) {
    results.push(sendReq(code));
  }

  Promise.all(results).then((values) => {
    console.log('resolved');

    const result = values.reduce((max, curr) => {
      if (max.discount < curr.discount) {
        return curr;
      }

      return max;
      }, {code: 'NO DISCOUNT FOUND', discount: 0.0}
    );

    console.log(result);

    insertResult(result);
    body.classList.remove('transparent-box');
  });
};
