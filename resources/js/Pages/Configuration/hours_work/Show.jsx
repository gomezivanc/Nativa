"use client"

import { useState, useEffect } from "react"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Timeline } from "primereact/timeline"
import { Badge } from "primereact/badge"
import { ProgressBar } from "primereact/progressbar"
import { usePage } from "@inertiajs/react"
// Mapeo de números a nombres de días
const diasSemana = {
  "1": "Lunes",
  "2": "Martes",
  "3": "Miércoles",
  "4": "Jueves",
  "5": "Viernes",
  "6": "Sábado",
  "7": "Domingo",
}

export default function HorarioDetalle({ data: horarioData }) {
  const [horario, setHorario] = useState(horarioData)
  const [visible, setVisible] = useState(false)
  const [jsonDialogContent, setJsonDialogContent] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isWorkingHours, setIsWorkingHours] = useState(false)
  const [workingProgress, setWorkingProgress] = useState(0)

  // Simular carga de datos
  useEffect(() => {
    // Aquí normalmente harías una llamada a la API
    // fetch('/api/horarios/1')
    //   .then(res => res.json())
    //   .then(data => setHorario(data))

    // Actualizar la hora actual cada minuto
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Verificar si estamos en horario laboral
      const currentDay = now.getDay() || 7 // getDay() devuelve 0 para domingo, lo convertimos a 7
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const currentTimeMinutes = currentHour * 60 + currentMinute

      const dayInRange =
        currentDay >= Number.parseInt(horario.day_of_week_init) &&
        currentDay <= Number.parseInt(horario.day_of_week_end)

      const [initHour, initMinute] = horario.init_work_hour.split(":").map(Number)
      const [endHour, endMinute] = horario.end_work_hour.split(":").map(Number)

      const initTimeMinutes = initHour * 60 + initMinute
      const endTimeMinutes = endHour * 60 + endMinute

      const timeInRange = currentTimeMinutes >= initTimeMinutes && currentTimeMinutes <= endTimeMinutes

      setIsWorkingHours(dayInRange && timeInRange)

      // Calcular progreso del día laboral
      if (dayInRange && timeInRange) {
        const totalWorkMinutes = endTimeMinutes - initTimeMinutes
        const elapsedWorkMinutes = currentTimeMinutes - initTimeMinutes
        const progress = Math.round((elapsedWorkMinutes / totalWorkMinutes) * 100)
        setWorkingProgress(progress)
      } else if (dayInRange && currentTimeMinutes > endTimeMinutes) {
        setWorkingProgress(100)
      } else if (dayInRange && currentTimeMinutes < initTimeMinutes) {
        setWorkingProgress(0)
      }
    }, 60000)

    // Ejecutar una vez al inicio para no esperar al primer intervalo
    const now = new Date()
    const currentDay = now.getDay() || 7
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeMinutes = currentHour * 60 + currentMinute

    const dayInRange =
      currentDay >= Number.parseInt(horario.day_of_week_init) && currentDay <= Number.parseInt(horario.day_of_week_end)

    const [initHour, initMinute] = horario.init_work_hour.split(":").map(Number)
    const [endHour, endMinute] = horario.end_work_hour.split(":").map(Number)

    const initTimeMinutes = initHour * 60 + initMinute
    const endTimeMinutes = endHour * 60 + endMinute

    const timeInRange = currentTimeMinutes >= initTimeMinutes && currentTimeMinutes <= endTimeMinutes

    setIsWorkingHours(dayInRange && timeInRange)

    if (dayInRange && timeInRange) {
      const totalWorkMinutes = endTimeMinutes - initTimeMinutes
      const elapsedWorkMinutes = currentTimeMinutes - initTimeMinutes
      const progress = Math.round((elapsedWorkMinutes / totalWorkMinutes) * 100)
      setWorkingProgress(progress)
    } else if (dayInRange && currentTimeMinutes > endTimeMinutes) {
      setWorkingProgress(100)
    } else if (dayInRange && currentTimeMinutes < initTimeMinutes) {
      setWorkingProgress(0)
    }

    return () => clearInterval(interval)
  }, [horario])

  const mostrarJson = () => {
    setJsonDialogContent(JSON.stringify(horario, null, 2))
    setVisible(true)
  }

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "No disponible"
    const fecha = new Date(fechaStr)
    return fecha.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Calcular duración del horario laboral en horas y minutos
  const calcularDuracionLaboral = () => {
    const [initHour, initMinute] = horario.init_work_hour.split(":").map(Number)
    const [endHour, endMinute] = horario.end_work_hour.split(":").map(Number)

    const initMinutes = initHour * 60 + initMinute
    const endMinutes = endHour * 60 + endMinute

    const diffMinutes = endMinutes - initMinutes

    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    return `${hours} horas y ${minutes} minutos`
  }

  // Generar eventos para la línea de tiempo
  const generarEventosTimeline = () => {
    const eventos = []

    // Evento de inicio de jornada
    eventos.push({
      status: "Inicio",
      date: horario.init_work_hour,
      icon: "pi pi-clock",
      color: "#4CAF50",
      description: "Inicio de jornada laboral",
    })

    // Evento de fin de jornada
    eventos.push({
      status: "Fin",
      date: horario.end_work_hour,
      icon: "pi pi-flag-fill",
      color: "#F44336",
      description: "Fin de jornada laboral",
    })

    return eventos
  }

  // Generar días de la semana para visualización
  const generarDiasSemana = () => {
    const dias = []
    for (let i = 1; i <= 7; i++) {
      const activo = i >= Number.parseInt(horario.day_of_week_init) && i <= Number.parseInt(horario.day_of_week_end)
      dias.push({
        numero: i,
        nombre: diasSemana[i.toString()],
        activo: activo,
      })
    }
    return dias
  }

  const customizedMarker = (item) => {
    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    )
  }

  const customizedContent = (item) => {
    return (
      <div className="ml-4">
        <h3 className="text-lg font-semibold m-0">{item.status}</h3>
        <p className="text-xl text-primary font-medium m-0">{item.date}</p>
        <p className="text-gray-500 m-0">{item.description}</p>
      </div>
    )
  }

    const { translations } = usePage()?.props;
    const t = (key) => translations?.configuration?.hours_work?.show?.[key] ?? key;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Card className="shadow-lg max-w-5xl mx-auto bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
              <i className="pi pi-calendar text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 m-0">{t("title")}</h1>
              <p className="text-gray-500 m-0">{t("id")}: {horario.id}</p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Estado actual */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{t("current_status")}</h2>
              <p className="text-gray-500">
                {currentTime.toLocaleString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isWorkingHours ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="font-medium">
                {isWorkingHours ? t("within_schedule") : t("outside_schedule")}
              </span>
              <Badge value={isWorkingHours ? t("active") : t("inactive")} severity={isWorkingHours ? "success" : "danger"} />
            </div>
          </div>

          {isWorkingHours && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">{t("progress")}</p>
              <ProgressBar value={workingProgress} showValue />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{t("working_days")}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {generarDiasSemana().map((dia) => (
                <div
                  key={dia.numero}
                  className={`p-3 rounded-lg text-center w-20 ${
                    dia.activo
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  <div className="text-sm">{dia.nombre.substring(0, 3)}</div>
                  <div className={`text-xl font-bold ${dia.activo ? "text-blue-800" : "text-gray-400"}`}>
                    {dia.numero}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-gray-500">{t("working_days_range")}</p>
              <p className="text-xl font-medium">
                {diasSemana[horario.day_of_week_init]} a {diasSemana[horario.day_of_week_end]}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{t("schedule")}</h2>
            <Timeline
              value={generarEventosTimeline()}
              align="alternate"
              className="mt-4"
              marker={customizedMarker}
              content={customizedContent}
            />
            <div className="mt-6 text-center">
              <p className="text-gray-500">{t("total_duration")}</p>
              <p className="text-xl font-medium">{calcularDuracionLaboral()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{t("additional_info")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{t("created_by")}</p>
              <p className="font-medium">Usuario #{horario.creado_por_id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{t("created_at")}</p>
              <p className="font-medium">{formatearFecha(horario.created_at)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{t("updated_at")}</p>
              <p className="font-medium">{formatearFecha(horario.updated_at)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Dialog para mostrar JSON */}
      <Dialog
        header={t("json_dialog_title")}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-end">
            <Button label={t("close")} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
          </div>
        }
      >
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">{jsonDialogContent}</pre>
      </Dialog>
    </div>
  )
}
