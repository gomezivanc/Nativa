import { useState } from "react"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { ProgressBar } from "primereact/progressbar"
import { classNames } from "primereact/utils"

export default function FormPreview({ questions,satisfaction_survey }) {
    const [answers, setAnswers] = useState({})
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleInputChange = (questionId, value) => {
        setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
        }))
    }

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1)
        } else {
            submit().then(() => setSubmitted(true))
        }
    }

    const submit = async () => {
        setLoading(true)
        try {
            const response = await axios.post(route("satisfaction-survey.response.store",satisfaction_survey), answers)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 0) {
        setCurrentQuestion((prev) => prev - 1)
        }
    }

    const isQuestionAnswered = (questionId) => {
        return !questions[currentQuestion].required || !!answers[questionId]?.trim()
    }

    const progressValue = ((currentQuestion + 1) / questions.length) * 100

    const cardHeader = (
        <div className="border-b p-3">
        <h1 className="text-2xl font-medium">{ satisfaction_survey.name }</h1>
        <p className="text-gray-500 text-sm">* Indica un campo obligatorio</p>
        </div>
    )

    if (submitted) {
        return (
        <Card className="shadow-lg" style={{ borderTop: "8px solid #6366F1" }}>
            <div className="text-center py-8">
            <h2 className="text-2xl font-medium mb-4">¡Gracias por enviar tus respuestas!</h2>
            <p className="text-gray-600 mb-6">Tus respuestas han sido registradas.</p>
            <Button
                label="Enviar otra respuesta"
                onClick={() => {
                setAnswers({})
                setCurrentQuestion(0)
                setSubmitted(false)
                }}
                className="p-button-primary"
            />
            </div>
        </Card>
        )
    }

    const currentQ = questions[currentQuestion]

    return (
        <div className="space-y-4">
        <Card header={cardHeader} className="shadow-lg" style={{ borderTop: "8px solid #6366F1" }}>
            <div className="pt-6">
                <div className="mb-8 ">
                    <div className="flex items-baseline mb-2">
                    <h2 className="text-base font-medium">{currentQ.question}</h2>
                    {currentQ.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                    <InputTextarea
                        value={answers[currentQ.id] || ""}
                        onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                        placeholder="Tu respuesta"
                        className="max-w-md w-full"
                    />
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                    Pregunta {currentQuestion + 1} de {questions.length}
                    </div>
                    <div className="flex gap-2">
                    {currentQuestion > 0 && (
                        <Button label="Anterior" onClick={handlePrevious} className="p-button-outlined" />
                    )}
                    <Button
                        label={currentQuestion < questions.length - 1 ? "Siguiente" : "Enviar"}
                        onClick={handleNext}
                        loading={loading}
                        disabled={!isQuestionAnswered(currentQ.id)}
                        className="p-button-primary"
                    />
                    </div>
                </div>
            </div>
        </Card>

        <ProgressBar value={progressValue} showValue={false} style={{ height: "6px" }} />

        <div className="flex justify-center">
            <div className="flex gap-1">
                {questions.map((_, index) => (
                    <div
                    key={index}
                    className={classNames("w-2 h-2 rounded-full", {
                        "bg-indigo-600": index === currentQuestion,
                        "bg-indigo-400": index < currentQuestion,
                        "bg-gray-300": index > currentQuestion,
                    })}
                    />
                ))}
            </div>
        </div>
        </div>
    )
}

