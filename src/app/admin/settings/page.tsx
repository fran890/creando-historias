import { getMonetizationSettings } from "@/services/revenue.service";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getMonetizationSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Configuración de Monetización</h1>
        <p className="text-sm text-gray-400">Ajusta el reparto de ingresos publicitarios entre los autores y la plataforma.</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
