interface Buttons {
  text: string;
  price: string;
  customClasses: string;
}

export const Button = ({ text, price, customClasses }: Buttons) => {
  return (
    <>
      <button
        className={`min-w-32 rounded text-sm font-semibold p-2 px-8 ${customClasses}`}
      >
        {text} {price}
      </button>
    </>
  );
};
