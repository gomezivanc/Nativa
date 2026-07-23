export default function PrimaryButton({ type = 'submit', className = '', processing, children, onClick }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={
                `inline-flex items-center justify-center px-6 py-3 bg-ibg-600 border border-transparent rounded-lg font-semibold text-sm text-white shadow-lg shadow-ibg-900/20 hover:bg-ibg-900 focus:bg-ibg-900 active:bg-ibg-900 focus:outline-none focus:ring-2 focus:ring-ibg-500 focus:ring-offset-2 transition-all duration-300 ease-out ${
                    processing && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={processing}
        >
            {children}
        </button>
    );
}
