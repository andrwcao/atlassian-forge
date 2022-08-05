import ForgeUI, {
    useProductContext,
    CustomFieldContextConfig,
    TextField,
    Table,
    Head,
    Cell,
    Text,
    Row,
  } from "@forge/ui";
  import { DEFAULT_CONTEXT_CONFIG, DEFAULT_CONFIGURATION } from "../data/data";
  import { validateMaxRowsAmount } from "../utils/utils";
  export const ContextConfig = () => {
    const {
      extensionContext: { configuration = { ...DEFAULT_CONTEXT_CONFIG } },
    } = useProductContext();
    const {
      maxRowsAmounts: { min, max },
    } = DEFAULT_CONFIGURATION;
  
    const onSubmit = (formData) => {
      formData.maxCurrencyCalculationRows = validateMaxRowsAmount(
        formData.maxCurrencyCalculationRows,
        min,
        max
      );
      const formDataCurrencyExchangeCourses =
        configuration.currencyExchangeCourses.map((e) => ({
          label: e.label,
          exchangeValue: +formData[e.label],
        }));
      return {
        configuration: {
          provision: +formData.provision,
          maxCurrencyCalculationRows: +formData.maxCurrencyCalculationRows,
          currencyExchangeCourses: formDataCurrencyExchangeCourses,
        },
      };
    };
  
    return (
      <CustomFieldContextConfig onSubmit={onSubmit}>
        <TextField
          type="number"
          name="provision"
          label="Bank provision (%)"
          defaultValue={configuration.provision}
        />
        <TextField
          type="number"
          name="maxCurrencyCalculationRows"
          label="Maximum amount of currency"
          defaultValue={configuration.maxCurrencyCalculationRows}
        />
        <Table>
          <Head>
            <Cell>
              <Text>Value compared to USD</Text>
            </Cell>
          </Head>
          {configuration.currencyExchangeCourses.map((e) => (
            <Row>
              <Cell>
                <TextField
                  name={e.label}
                  label={e.label}
                  placeholder={e.curencyValue}
                  defaultValue={e.exchangeValue}
                />
              </Cell>
            </Row>
          ))}
        </Table>
      </CustomFieldContextConfig>
    );
  };
  