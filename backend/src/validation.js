export function validateSubmission(schema, data) {
  const errors = {};

  for (const field of schema.fields) {
    const val = data[field.name];
    const rules = field.validations || {};
    const label = field.label;

    // required
    if (rules.required) {
      if (
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "") ||
        (Array.isArray(val) && val.length === 0)
      ) {
        errors[field.name] = `${label} is required`;
        continue;
      }
    }

    if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
      continue;
    }

    switch (field.type) {
      case "text":
      case "textarea": {
        const str = String(val);
        if (rules.minLength && str.length < rules.minLength) {
          errors[field.name] = `${label} must be at least ${rules.minLength} characters`;
        }
        if (rules.maxLength && str.length > rules.maxLength) {
          errors[field.name] = `${label} must be at most ${rules.maxLength} characters`;
        }
        if (rules.regex) {
          const re = new RegExp(rules.regex);
          if (!re.test(str)) {
            errors[field.name] = `${label} is invalid`;
          }
        }
        break;
      }
      case "number": {
        const num = Number(val);
        if (Number.isNaN(num)) {
          errors[field.name] = `${label} must be a number`;
          break;
        }
        if (rules.min !== undefined && num < rules.min) {
          errors[field.name] = `${label} must be at least ${rules.min}`;
        }
        if (rules.max !== undefined && num > rules.max) {
          errors[field.name] = `${label} must be at most ${rules.max}`;
        }
        break;
      }
      case "date": {
        const date = new Date(val);
        if (Number.isNaN(date.getTime())) {
          errors[field.name] = `${label} must be a valid date`;
          break;
        }
        if (rules.minDate) {
          const minDate = new Date(rules.minDate);
          if (date < minDate) {
            errors[field.name] = `${label} must be on or after ${rules.minDate}`;
          }
        }
        break;
      }
      case "multi-select": {
        const arr = Array.isArray(val) ? val : [];
        if (rules.minSelected && arr.length < rules.minSelected) {
          errors[field.name] = `${label} must have at least ${rules.minSelected} selected`;
        }
        if (rules.maxSelected && arr.length > rules.maxSelected) {
          errors[field.name] = `${label} must have at most ${rules.maxSelected} selected`;
        }
        break;
      }
      case "select":
      case "switch":
      default:
        break;
    }
  }

  return errors;
}
