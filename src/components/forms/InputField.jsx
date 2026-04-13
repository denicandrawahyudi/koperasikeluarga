export function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  as = "input",
  options = [],
}) {
  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    placeholder,
    className: error ? "field-error" : "",
  };

  return (
    <label className="form-field" htmlFor={name}>
      <span>{label}</span>
      {as === "textarea" ? (
        <textarea {...commonProps} rows="3" />
      ) : as === "select" ? (
        <select {...commonProps}>
          <option value="">Pilih</option>
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      ) : (
        <input {...commonProps} type={type} />
      )}
      {error ? <small>{error}</small> : null}
    </label>
  );
}
