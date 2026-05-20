export default function InputLabel({ forInput, value, className, children }) {
    return (
        <label htmlFor={forInput} className={`block font-bold font-oswald text-sm text-gray-600` + className}>
            {value ? value : children}
        </label>
    );
}
