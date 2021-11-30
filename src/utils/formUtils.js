import Joi from "joi";

export function formUtilities(
  schema,
  data,
  errors,
  setData,
  setErrors,
  doSubmit
) {
  function validate() {
    const options = { abortEarly: false };
    const joiObjectSchema = Joi.object(schema);
    const { error } = joiObjectSchema.validate(data, options);
    if (!error) return null;

    const errors = {};

    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  }

  function validateProperty({ name, value }) {
    const obj = { [name]: value };
    const propertySchema = Joi.object({ [name]: schema[name] });
    const { error } = propertySchema.validate(obj);

    return error ? error.details[0].message : null;
  }

  function handleChange({ currentTarget: input }) {
    const errorsClone = { ...errors };
    const errorMessage = validateProperty(input, schema);
    if (errorMessage) errorsClone[input.name] = errorMessage;
    else delete errorsClone[input.name];

    const dataClone = { ...data };
    dataClone[input.name] = input.value;

    setData(dataClone);
    setErrors(errorsClone);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errors = validate();
    setErrors(errors || {});
    if (errors) return;

    doSubmit();
  }
  return {
    validate,
    validateProperty,
    handleChange,
    handleSubmit,
  };
}
