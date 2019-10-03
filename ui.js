// global list of codes with status flag, experied and invalid are flagged
_available = {};

const tryCodes = () => {
  const config = { attributes: false, childList: true, subtree: true };
  let input = document.querySelector('input[name=changecouponcode]');
  let apply = document.querySelector('span.useCoupon');
  const targetNode = document.querySelector('#step_one_main');
  let element = 0;
  let maxDiscount = 0.0;
  let discountCode = "";
  
  const observer = new MutationObserver((mutationsList, observer) => {
    input = document.querySelector('input[name=changecouponcode]');
    apply = document.querySelector('span.useCoupon');
    const notValid = document.querySelector('.tips');
    const discount = document.querySelector('.successbox > b');
    const re = /\d+\.\d+/;
    const currentCode = CODES[element];
    
    if (apply.innerText === 'wait') {
      window.setTimeout(100, tryCodes);
      return;
    }

    if (discount) {
      _available[element] = true;
      const discountStr = document.querySelector('.successbox > b').innerText;
      const discountNo = re.exec(discountStr)[0];
      const discountValue = parseFloat(discountNo);

      if (discountValue > maxDiscount) {
        maxDiscount = discountValue;
        discountCode = currentCode;
        console.log(`${discountValue} : ${discountCode}`);
      }
    }
    else if (notValid && 
              (notValid.innerText === "This coupon has expired" || 
              notValid.innerText === "Invalid Coupon Code")) {
      console.log(`${currentCode} is expired or invalid`);
      _available[currentCode] = false;
    }
    else if (!notValid) {
      console.log(`Problem with ${currentCode}`);
      window.setTimeout(100, tryCodes);
      return;
    }
    
    //console.log('next');
    element++;

    while (element < CODES.length) {
      const newCode = CODES[element];
      if (_available[newCode] || _available[newCode] === undefined) {
        input.value = newCode;
        apply.innerText = 'wait';
        apply.click();

        return;
      }

      console.log(`${newCode} skipped`);

      element++;
    }
    
    observer.disconnect();

    window.setTimeout(() => {
      if (maxDiscount > 0.0) {
        input.value = discountCode;
        apply.click();
      }
      else {
        input.value = "NO DISCOUNT";
      }
    }, 500);
  });

  observer.observe(targetNode, config);
  input.value = CODES[element];
  apply.innerText = 'wait';
  apply.click();
};
