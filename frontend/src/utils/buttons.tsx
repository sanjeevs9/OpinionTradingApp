interface Buttons {
  text: string;
  price: number | string;
  customClasses: string;
}

export const Button = ({ text, price, customClasses }: Buttons) => {
  return (
    <button
      className={`min-w-[120px] rounded-lg text-sm font-semibold py-2.5 px-6 cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] ${customClasses}`}
    >
      {text} ₹{price}
    </button>
  );
};
