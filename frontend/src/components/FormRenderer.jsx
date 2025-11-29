import React, { useEffect, useState } from "react";

function validateField(field, value, rules) {
  const label = field.label;

  if (rules.required) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return `${label} is required`;
    }
  }

  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return null;
  }

  switch (field.type) {
    case "text":
    case "textarea": {
      const str = String(value);
      if (rules.minLength && str.length < rules.minLength) {
        return `${label} must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && str.length > rules.maxLength) {
        return `${label} must be at most ${rules.maxLength} characters`;
      }
      if (rules.regex) {
        const re = new RegExp(rules.regex);
        if (!re.test(str)) {
          return `${label} is invalid`;
        }
      }
      return null;
    }
    case "number": {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return `${label} must be a number`;
      }
      if (rules.min !== undefined && num < rules.min) {
        return `${label} must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && num > rules.max) {
        return `${label} must be at most ${rules.max}`;
      }
      return null;
    }
    case "date": {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return `${label} must be a valid date`;
      }
      if (rules.minDate) {
        const minDate = new Date(rules.minDate);
        if (date < minDate) {
          return `${label} must be on or after ${rules.minDate}`;
        }
      }
      return null;
    }
    case "multi-select": {
      const arr = Array.isArray(value) ? value : [];
      if (rules.minSelected && arr.length < rules.minSelected) {
        return `${label} must have at least ${rules.minSelected} selected`;
      }
      if (rules.maxSelected && arr.length > rules.maxSelected) {
        return `${label} must have at most ${rules.maxSelected} selected`;
      }
      return null;
    }
    default:
      return null;
  }
}

function runValidation(schema, values) {
  const errors = {};
  for (const field of schema.fields) {
    const rules = field.validations || {};
    const err = validateField(field, values[field.name], rules);
    if (err) errors[field.name] = err;
  }
  return errors;
}

export default function FormRenderer({
  schema,
  onSubmit,
  isSubmitting,
  initialValues,
  submitLabel = "Submit"
}) {
  const makeDefaults = () => {
    const obj = {};
    schema.fields.forEach((f) => {
      if (initialValues && initialValues[f.name] !== undefined) {
        obj[f.name] = initialValues[f.name];
      } else if (f.type === "switch") {
        obj[f.name] = false;
      } else if (f.type === "multi-select") {
        obj[f.name] = [];
      } else {
        obj[f.name] = "";
      }
    });
    return obj;
  };

  const [values, setValues] = useState(makeDefaults);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => {
    setValues(makeDefaults());
    setFieldErrors({});
    setSubmitMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage(null);

    const localErrors = runValidation(schema, values);
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    const result = await onSubmit(values);

    if (!result.success && result.errors) {
      setFieldErrors(result.errors);
      return;
    }

    setFieldErrors({});
    setSubmitMessage("Success!");

    if (!initialValues) {
      setValues(makeDefaults());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {schema.fields.map((field) => {
        const error = fieldErrors[field.name];
        const value = values[field.name];

        const labelNode = (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">
            {field.label}
            {field.validations?.required && (
              <span className="text-red-500 ml-0.5">*</span>
            )}
          </label>
        );

        const helper =
          field.placeholder ? (
            <p className="text-xs text-slate-400 mb-1">{field.placeholder}</p>
          ) : null;

        const errorNode = error ? (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        ) : null;

        let control = null;

        if (["text", "number", "date"].includes(field.type)) {
          control = (
            <input
              type={
                field.type === "number"
                  ? "number"
                  : field.type === "date"
                  ? "date"
                  : "text"
              }
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900 bg-transparent"
              value={value ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          );
        } else if (field.type === "textarea") {
          control = (
            <textarea
              rows={4}
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900 bg-transparent"
              value={value ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          );
        } else if (field.type === "select") {
          control = (
            <select
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900 bg-transparent"
              value={value ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              <option value="">Select...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        } else if (field.type === "multi-select") {
          const arr = Array.isArray(value) ? value : [];
          control = (
            <div className="border rounded-md px-3 py-2 space-y-1">
              {field.options?.map((opt) => {
                const checked = arr.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-100"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleChange(field.name, [...arr, opt.value]);
                        } else {
                          handleChange(
                            field.name,
                            arr.filter((v) => v !== opt.value)
                          );
                        }
                      }}
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          );
        } else if (field.type === "switch") {
          control = (
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-100">
              <button
                type="button"
                className={
                  "w-10 h-5 rounded-full flex items-center px-0.5 transition " +
                  (value
                    ? "bg-slate-900 justify-end"
                    : "bg-slate-300 justify-start")
                }
                onClick={() => handleChange(field.name, !value)}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
              {field.placeholder || ""}
            </label>
          );
        }

        return (
          <div key={field.name}>
            {labelNode}
            {helper}
            {control}
            {errorNode}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white ${
          isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"
        }`}
      >
        {isSubmitting ? "Working..." : submitLabel}
      </button>

      {submitMessage && (
        <p className="text-sm text-emerald-600 mt-2">{submitMessage}</p>
      )}
    </form>
  );
}
