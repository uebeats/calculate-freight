/**
 * global const 
 */
window.onload = () => {

  const inputCost = document.querySelectorAll('.currency');
  const masksOptions = {
    mask: Number,  // enable number mask

    // other options are optional with defaults below
    scale: 2,  // digits after point, 0 for integers
    signed: true,  // disallow negative
    thousandsSeparator: '',  // any single char
    padFractionalZeros: true,  // if true, then pads zeros at end to the length of scale
    normalizeZeros: true,  // appends or removes zeros at ends
    radix: '.',  // fractional delimiter
    mapToRadix: ['.'],  // symbols to process as radix

    // additional number interval options (e.g.)
    min: 0,
    max: 100000000
  }

  for (const item of inputCost) {
    const mask = new IMask(item, masksOptions);
  }

  const valorDolar = dolarCustoms[0].julio;
  dolarAduanero.innerHTML = valorDolar;

  let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}

// esta función se ejecuta, luego de dar click en "calcular"
const getCalculateImport = () => {

  const iva = 19;
  let adValorem = null;

  let input = document.querySelector('input[type=checkbox]');
  function check() {
    let a = input.checked ? 0 : 6;
    adValorem = a;
  }

  input.onchange = check;
  check();

  const pp = parseFloat(priceProduct.value);
  const pf = parseFloat(priceFreight.value);
  const pi = parseFloat(priceInsurance.value);

  if (Number.isNaN(pp) || Number.isNaN(pf) || Number.isNaN(pi)) {
    console.warn('Debes ingresar todos los costos solicitados para calcular el monto total.');
    const alertError = document.querySelector('#alertError');
    alertError.classList.remove('d-none');
  } else {
    alertError.classList.add('d-none');
    const numberFormatUsd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const numberFormatClp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

    const resultCif = pp + pf + pi;
    showResultCif = `<u>${numberFormatUsd.format(resultCif)} USD</u>`;

    const adValoremDuty = (resultCif * adValorem) / 100;
    showAdValorem = `<u>${numberFormatUsd.format(adValoremDuty)} USD</u>`;

    const totalTaxBase = resultCif + adValoremDuty;
    const ivaTotalTaxBase = (totalTaxBase * iva) / 100;
    showIvaTotalTaxBase = `<u>${numberFormatUsd.format(ivaTotalTaxBase)} USD</u>`;

    const totalCostImport = adValoremDuty + ivaTotalTaxBase;
    showTotalCostImportUsd = `<u>${numberFormatUsd.format(totalCostImport)} USD</u>`;

    const totalCostImportClp = totalCostImport * dolarCustoms[0].junio;
    showTotalCostImportClp = `<u>${numberFormatClp.format(totalCostImportClp)} CLP</u>`;

    responseCalculate.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> calculando...';

    const funcResponse = () => {
      if (adValorem === 0) {
        let response = `<p>El <strong><u>CIF</u></strong> de tu importación es de <strong>${showResultCif}</strong>, 
        como cuentas con certificado de origen no debes pagar el <strong><u>derecho Advalorem</u></strong>.
        Por otra parte, el pago por concepto de <strong><u>IVA</u></strong> corresponde a <strong>${showIvaTotalTaxBase}</strong>.</p>
        <p>El monto aproximado a pagar en <strong><u>Aduanas</u></strong> es de <strong>${showTotalCostImportUsd}</strong>, convertido al <strong><u>Dólar Aduanero</u></strong> el monto a pagar es de <strong>${showTotalCostImportClp}</strong></p>`;
        responseCalculate.innerHTML = response;
      } else {
        let response = `<p>El <span><strong><u>CIF</u></strong></span> de tu importación es de <strong>${showResultCif}</strong>, 
        como <strong><u>NO</u></strong> cuentas con certificado de origen, el <strong><u>derecho Advalorem</u></strong> que debes pagar es de <strong>${showAdValorem}</strong>.
        Por otra parte, el pago por concepto de <strong>IVA</strong> corresponde a <strong>${showIvaTotalTaxBase}</strong>.</p>
        <p>El monto aproximado a pagar en <strong><u>Aduanas</u></strong> es de <strong>${showTotalCostImportUsd}</strong>, convertido al <strong><u>Dólar Aduanero</u></strong> el monto a pagar es de <strong>${showTotalCostImportClp}</strong></p>`;
        responseCalculate.innerHTML = response;
      }
    }
    const messageSuccess = setTimeout(funcResponse, 2000);
  }

}