export default function CustomButton({
  onClick,
  children,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`block cursor-pointer bg-[#004aad] text-white p-2.5 md:p-3 font-semibold rounded-lg ${className}`}
    >
      {children}
    </button>
  );
}
