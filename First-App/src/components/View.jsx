import ForgeUI, {
    useProductContext,
    CustomField,
    Text,
    Fragment,
    useState,
  } from "@forge/ui";
  import api from "@forge/api";
  import { viewComponentText } from "../data/textFields";
  import { getCustomFieldContext } from "../utils/utils";
  import { DEFAULT_CONTEXT_CONFIG } from "../data/data";
  
  export const View = () => {
    const {
      extensionContext: { fieldValue, fieldId },
    } = useProductContext();
    const [customFieldContext] = useState(getCustomFieldContext(fieldId));
    let [{configuration}] = customFieldContext;
    if(!configuration) {
      configuration = {...DEFAULT_CONTEXT_CONFIG};
    }
    const {provision} = configuration;
      const { value, valueWithConfig, noValues, noConfiguration } = viewComponentText;
      const currencySummaryAmount = fieldValue?.currencySummary?.amount;
      const currencySummaryCurrency = fieldValue?.currencySummary?.currency;
      const summaryAfterProvision = (currencySummaryAmount - (provision / 100) * currencySummaryAmount).toFixed(2);
  
    return (
      <CustomField>
        <Fragment>
          {currencySummaryAmount ? (
            <Fragment>
              <Text>
                {value} {currencySummaryAmount} {currencySummaryCurrency}
              </Text>
              <Text>
                {valueWithConfig} {summaryAfterProvision} {currencySummaryCurrency}
              </Text>
            </Fragment>
          ) : (
            <Text>{noValues}</Text>
          )}
        </Fragment>
      </CustomField>
    )
  };
  