interface Buttons {
  text: string;
  price: number | string;
  customClasses: string;
}

export const Button = ({ text, price, customClasses }: Buttons) => {
  return (
    <>
      <button
        className={`min-w-32 rounded text-sm font-semibold p-2 px-8 cursor-pointer ${customClasses}`}
      >
        {text} ₹{price}
      </button>
    </>
  );
};
