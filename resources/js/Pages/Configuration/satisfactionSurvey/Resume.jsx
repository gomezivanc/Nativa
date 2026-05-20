import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Card } from "primereact/card"
import { Chart } from "primereact/chart"
import { Divider } from "primereact/divider"
import { router, usePage } from '@inertiajs/react'

const ReportView = ({ surveyData, questionData, userData, avgData }) => {
    const { translations } = usePage().props

    // Configuración mejorada de los gráficos
    const barChartData = {
        labels: surveyData.map((item) => item.satisfaction.name),
        datasets: [
        {
            label: "Respuestas Totales",
            data: surveyData.map((item) => item.total_responses),
            backgroundColor: "#6366F1",
            borderColor: "#4F46E5",
            borderWidth: 1,
            borderRadius: 6,
            hoverBackgroundColor: "#4F46E5",
        },
        ],
        survey_ids: surveyData.map((item) => item.survey_id),
    }

    const barChartOptions = {
        plugins: {
        legend: {
            position: "top",
            align: "end",
        },
        title: {
            display: true,
            text: "Distribución de Respuestas por Encuesta",
            font: {
            size: 16,
            },
        },
        },
        scales: {
        y: {
            beginAtZero: true,
            grid: {
            display: true,
            drawBorder: false,
            },
        },
        x: {
            grid: {
            display: false,
            },
        },
        },
        onClick: (e) => {
            const element = e.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
            if (element.length) {
                const index = element[0].index;
                let id = barChartData.survey_ids[index]
                router.visit(route('satisfaction-survey.response.resume', { survey_id: id}));
            }
        },
        maintainAspectRatio: false,
    }

    const pieChartData = {
        labels: questionData.map((item) => `${item.question} - ${item.response}`),
        datasets: [
        {
            data: questionData.map((item) => item.count),
            backgroundColor: ["#6366F1", "#F59E0B", "#10B981", "#EC4899", "#8B5CF6", "#14B8A6", "#F43F5E", "#0EA5E9"],
            hoverBackgroundColor: ["#4F46E5", "#D97706", "#059669", "#DB2777", "#7C3AED", "#0D9488", "#E11D48", "#0284C7"],
        },
        ],
    }

    const pieChartOptions = {
        plugins: {
            legend: {
                position: "right",
                labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12,
                },
                },
            },
            title: {
                display: true,
                text: "Distribución de Respuestas por Pregunta",
                font: {
                size: 16,
                },
            },
        },
        maintainAspectRatio: false,
    }

    return (
        <div className="space-y-6">
            <Card className="shadow-lg">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{translations.configuration.dashboard_survey.title}</h1>
                    <p className="text-gray-600">{translations.configuration.dashboard_survey.subtitle}</p>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">{translations.configuration.dashboard_survey.surveys.title}</h2>
                        <DataTable value={surveyData} paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="p-datatable-sm" stripedRows>
                            <Column field="satisfaction.name" header={translations.configuration.dashboard_survey.surveys.survey_id} sortable />
                            <Column field="total_responses" header={translations.configuration.dashboard_survey.surveys.total_responses} sortable />
                        </DataTable>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">{translations.configuration.dashboard_survey.questions.title}</h2>
                            <DataTable value={questionData} paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="p-datatable-sm" stripedRows>
                                <Column field="question" header={translations.configuration.dashboard_survey.questions.question_id} sortable />
                                <Column field="response" header={translations.configuration.dashboard_survey.questions.response} />
                                <Column field="count" header={translations.configuration.dashboard_survey.questions.count} sortable />
                            </DataTable>
                        </Card>

                        <Card className="shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">{translations.configuration.dashboard_survey.average.title}</h2>
                            <DataTable value={avgData} paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="p-datatable-sm" stripedRows>
                                <Column field="satisfaction.name" header={translations.configuration.dashboard_survey.surveys.survey_id} sortable />
                                <Column field="avg_responses_per_user" header={translations.configuration.dashboard_survey.average.avg_responses} sortable />
                            </DataTable>
                        </Card>
                    </div>

                    <Divider />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">{translations.configuration.dashboard_survey.charts.responses_by_survey}</h2>
                            <div className="h-80">
                                <Chart type="bar" data={barChartData} options={barChartOptions} />
                            </div>
                        </Card>

                        <Card className="shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">{translations.configuration.dashboard_survey.charts.responses_by_question}</h2>
                            <div className="h-80">
                                <Chart type="pie" data={pieChartData} options={pieChartOptions} />
                            </div>
                        </Card>
                    </div>

                    <Card className="shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">{translations.configuration.dashboard_survey.users.title}</h2>
                        <DataTable value={userData} paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="p-datatable-sm" stripedRows>
                            <Column header={translations.configuration.dashboard_survey.users.user_id} sortable body={(rowData) => (
                                <span>{rowData.user.persona.nombre} {rowData.user.persona.apellido}</span>
                            )} />
                            <Column field="total_surveys" header={translations.configuration.dashboard_survey.users.total_surveys} sortable />
                        </DataTable>
                    </Card>
                </div>
            </Card>
        </div>
    )
}

export default ReportView

