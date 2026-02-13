function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default InputField;
