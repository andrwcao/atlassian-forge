import api,{ route } from '@forge/api';


export const validateMaxRowsAmount = (maxCurrencyCalculationRows, min, max) => {
  if (maxCurrencyCalculationRows < min) return min;
  if (maxCurrencyCalculationRows > max) return max;
  return maxCurrencyCalculationRows;
};

export async function getCustomFieldContext(fieldId) {
  const result = await requestJira(fieldId);
  return result.values;
}

async function requestJira(fieldId) {
  let transformedResponseJson;
  const response = await api
    .asUser()
    .requestJira(route`/rest/api/3/app/field/${fieldId}/context/configuration`);
  try {
    transformedResponseJson = await response.json();
  } catch (e) {
    console.log("Error transformedResponseJson: ", e);
  }
  console.log("transformedResponseJson result: ", transformedResponseJson);
  return transformedResponseJson || {};
}

export const setOutcomeProps = (index: number, targetObject) => {
    const outcome: any = {};
    for(let i=1; i <= index; i++) {
        if(targetObject[`prop${i}`] && targetObject[`prop${i}`].amount && targetObject[`prop${i}`].currency) {
            outcome[`prop${i}`] = {
                amount: +targetObject[`prop${i}`].amount,
                currency: targetObject[`prop${i}`].currency.value || targetObject[`prop${i}`].currency,
            };
        }
    }
    outcome[`currencySummary`] = {
        currency: targetObject[`currencySummary`],
        amount: 0,
    }
    return outcome;
}

export const currencyConversion = (fieldValue, currencyExchangeCourses) => {

    const fieldValueArray = formValueObjectTransform(fieldValue).slice(0,-1);

    const fieldValueAmountSumm = fieldValueArray.reduce(
        (accumulator: number, currentValue: any) => {
            const {amount, currency} = currentValue;
            const filteredCurrencyExchangeCourse = findChoosenCurrency(currency, currencyExchangeCourses);
            return accumulator += amount / filteredCurrencyExchangeCourse.exchangeValue;
        }, 0);


      const USDSumm = USDtoUserChoiceConversion(fieldValueAmountSumm, fieldValue.currencySummary.currency, currencyExchangeCourses);
      fieldValue.currencySummary.amount = USDSumm.toFixed(2);

      return fieldValue;
};
 
    
export const formValueObjectTransform = (formValues) => {
    return Object.values(formValues);
};

const findChoosenCurrency = (selectItemLabel, currencyExchangeCourses) => (
    currencyExchangeCourses.find( (element) => element.label === selectItemLabel)
);

const USDtoUserChoiceConversion = (amount, userSummaryDisplayCurrency, currencyExchangeCourses) => {
    const exchangeRate = findChoosenCurrency(userSummaryDisplayCurrency, currencyExchangeCourses);
    return amount * exchangeRate.exchangeValue;
}
