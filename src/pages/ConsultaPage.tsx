import { InputConsulta } from "../components/InputConsulta";
import logo from "/logo_q.svg";

export const ConsultaPage = () => {
  return (
    <section className="w-full flex flex-col items-center">
      <div className="flex items-center gap-5 mt-16 mb-16">
        <img src={logo} width={30} />
        <h2 className="font-bold text-4xl">Club</h2>
      </div>
      <h3 className="text-xl font-semibold mb-8">Consulta de empleados</h3>
      <InputConsulta />
    </section>
  );
};
