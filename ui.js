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
    
    if (apply.innerText === 'wait') {
      window.setTimeout(100, tryCodes);
      return;
    }

    if (discount) {
      const discountStr = document.querySelector('.successbox > b').innerText;
      const discountNo = re.exec(discountStr)[0];
      const discountValue = parseFloat(discountNo);

      if (discountValue > maxDiscount) {
        maxDiscount = discountValue;
        discountCode = CODES[element];
        console.log(`${discountValue} : ${discountCode}`);
      }
    }
    else if (notValid && notValid.innerText === "This coupon has expired") {
      console.log(`${CODES[element]} is expired`);
    }
    else if (!notValid) {
      console.log(`Problem with ${CODES[element]}`);
      window.setTimeout(100, tryCodes);
      return;
    }
    
    //console.log('next');
    element++;
    if (element < CODES.length) {
      input.value = CODES[element];
      apply.innerText = 'wait';
      apply.click();

      return;
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
