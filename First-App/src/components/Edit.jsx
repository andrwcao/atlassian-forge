import ForgeUI, {
    CustomFieldEdit,
    TextField,
    useProductContext,
    Select,
    Option,
    useState,
    Text,
    Button,
    Table,
    Head,
    Cell,
    Row,
  } from "@forge/ui";
  import {
    getCustomFieldContext,
    setOutcomeProps,
    currencyConversion,
  } from "./../utils/utils";
  import {
    DEFAULT_FIELD_VALUE,
    DEFAULT_CONTEXT_CONFIG,
    DEFAULT_CONFIGURATION,
  } from "../data/data";
  
  export const Edit = () => {
    const {
      extensionContext: { fieldValue, fieldId },
    } = useProductContext();
    const [customFieldContext] = useState(getCustomFieldContext(fieldId));
    const [arrayFields, setArrayFields] = useState(
      Object.values(fieldValue || DEFAULT_FIELD_VALUE).slice(0, -1)
    );
    let [{ configuration }] = customFieldContext;
    if (!configuration) {
      configuration = { ...DEFAULT_CONTEXT_CONFIG };
    }
    const { currencyExchangeCourses, maxCurrencyCalculationRows } = configuration;
    const currencies = currencyExchangeCourses.map((e) => e.label);
    const userSummCurrency = fieldValue?.currencySummary?.currency;
  
    const onSubmit = (formValue) => {
      const copy = JSON.parse(JSON.stringify(formValue));
      const outcome = setOutcomeProps(maxCurrencyCalculationRows, copy);
      const calculatedCurrency = currencyConversion(
        outcome,
        currencyExchangeCourses
      );
      return calculatedCurrency;
    };
  
    const addRow = () => {
      arrayFields.push({
        amount: undefined,
        currency: undefined,
      });
      setArrayFields(arrayFields);
    };
  
    const deleteRow = (index) => {
      let copy = arrayFields;
      copy = arrayFields.filter((e, i) => i !== index);
      setArrayFields(copy);
    };
  
    return (
      <CustomFieldEdit onSubmit={onSubmit}>
        <Text>
          Available fields: {arrayFields.length}/{maxCurrencyCalculationRows}
        </Text>
        <Button
          text="Add row"
          disabled={arrayFields.length >= maxCurrencyCalculationRows}
          onClick={() => addRow()}
        />
  
        <Table>
          <Head>
            {DEFAULT_CONFIGURATION.tableHeaders.map((e) => (
              <Cell>
                <Text>{e}</Text>
              </Cell>
            ))}
          </Head>
          {arrayFields.map((e, i) => (
            <Row>
              <Cell>
                <TextField
                  isRequired={true}
                  type="number"
                  name={`prop${i + 1}.amount`}
                  placeholder="Provide cash amount"
                  defaultValue={e.amount}
                />
              </Cell>
              <Cell>
                <Select isRequired={true} name={`prop${i + 1}.currency`}>
                  {currencies.map((element) => (
                    <Option
                      label={element}
                      value={element}
                      defaultSelected={element === e.currency}
                    />
                  ))}
                </Select>
              </Cell>
              <Cell>
                <Button
                  appearance="danger"
                  text="Delete"
                  onClick={() => deleteRow(i)}
                />
              </Cell>
            </Row>
          ))}
        </Table>
  
        <Select
          isRequired={true}
          label="Choose summary currency"
          name="currencySummary"
        >
          {currencies.map((e) => (
            <Option
              defaultSelected={userSummCurrency === e}
              label={e}
              value={e}
            />
          ))}
        </Select>
      </CustomFieldEdit>
    );
  };
  