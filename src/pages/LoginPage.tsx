import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export const LoginPage = () => {
  const { usuario, loading, login, checking } = useAuth();
  const [documento, setDocumento] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  if (usuario && !checking) return <Navigate to={"/dashboard"} />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(documento, password);
    } catch (error) {
      toast.error((error as Error).message)
    }
  };

  return (
    <section className="flex flex-col items-center">
      <h3 className="mt-16 mb-8 font-semibold text-xl">Inicia sesión</h3>
      <form onSubmit={handleSubmit} className="min-w-80 flex flex-col gap-5 border rounded-md bg-gray-100 p-8 shadow-md">
        <label className="text-sm">
          <p className="font-medium">N° de documento</p>
          <input
            className="rounded-md border px-3 py-2 outline-none mt-2 w-full shadow-md"
            type="text"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />
        </label>
        <label className="text-sm">
          <p className="font-medium">Contraseña</p>
          <input
            className="rounded-md border px-3 py-2 outline-none mt-2 w-full shadow-md"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-4 py-2.5 rounded-md mt-4 shadow-md"
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </section>
  );
};
