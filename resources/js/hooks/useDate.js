import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export function useYearLatest(cantidad) {
    const [años, setAños] = useState([]);
  
    // Esta función se ejecuta una vez, al montar el componente
    useEffect(() => {
      const fechaActual = new Date();
      const añoActual = fechaActual.getFullYear();
      const añosPasados = [];
  
      for (let i = 0; i < cantidad; i++) {
        añosPasados.push(añoActual - i);
      }
  
      setAños(añosPasados);
    }, [cantidad]); // Ejecutar el efecto solo cuando cambie la cantidad de años
  
    return años;
  }

  export function formatDate(dateStr, withTime = false, showDayName = false) {
    const { current_language } = usePage().props;

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        throw new Error("El argumento debe ser una fecha válida");
    }

    const locale = current_language ? `${current_language}-US` : 'en-US';

    // Opciones para formatear la fecha
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...(withTime && { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        ...(showDayName && { weekday: 'long' }), // Agregar el nombre del día si showDayName es true
    };

    // Formatear la fecha
    let formattedDate = date.toLocaleString(locale, options);

    // Eliminar la coma si no se muestra la hora
    if (!withTime) {
        formattedDate = formattedDate.replace(',', '');
    }

    return formattedDate;
  }