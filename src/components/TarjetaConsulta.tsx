type Props = {
  type: "success" | "error";
  children: React.ReactNode;
};

export const TarjetaConsulta = ({ type, children }: Props) => {
  return (
    <article
      className={`w-fit py-4 px-6 border-2 shadow-md rounded-md mx-auto ${
        type === "success" ? "border-green-500" : "border-red-500"
      }`}
    >
      {children}
    </article>
  );
};
