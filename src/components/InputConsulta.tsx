import { LoaderCircle, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { ApiResponse } from "../utils/types";
import toast from "react-hot-toast";
import { TarjetaConsulta } from "../components/TarjetaConsulta";
import { api } from "../lib/axios";

export const InputConsulta = () => {
  const [documento, setDocumento] = useState<string>("");
  const [resultado, setResultado] = useState<ApiResponse<0 | 1 | 2>>();
  const [mostrarResultado, setMostrarResultado] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || !isNaN(Number(value))) {
      setDocumento(value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (documento.length < 8) return toast.error("Ingresa un documento válido");

    setLoading(true);

    const { data } = await api.get<ApiResponse<0 | 1 | 2>>(
      `/empleados/consultar/${documento}`
    );

    setResultado(data);
    setMostrarResultado(true);
    setLoading(false);
  };

  return (
    <div>
      <form className="flex items-center gap-4 mb-12" onSubmit={handleSubmit}>
        <label className="border rounded-lg py-2 px-3 flex items-center gap-3 shadow-md">
          <Search className="size-4" />
          <input
            className="outline-none w-80 text-sm py-0.5"
            maxLength={12}
            inputMode="numeric"
            type="text"
            placeholder="Número de documento"
            value={documento}
            onChange={(e) => handleInputChange(e)}
          />
        </label>
        <button
          className="bg-gray-900 text-sm text-white py-2.5 px-5 shadow-md hover:bg-gray-800 rounded-lg"
          type="submit"
        >
          {loading ? (
            <p className="flex items-center gap-2">
              <LoaderCircle className="stroke-white size-4 animate-spin" />
              Consultando
            </p>
          ) : (
            "Consultar"
          )}
        </button>
      </form>
      {resultado && mostrarResultado && (
        <TarjetaConsulta type={resultado.data === 1 ? "success" : "error"}>
          <p className="font-semibold">{resultado.message}</p>
        </TarjetaConsulta>
      )}
    </div>
  );
};
