import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from 'axios'

const TIPOS_DATO = [
    { value: "texto",    label: "Texto",     desc: "Cadenas de caracteres libres",        icon: "T" },
    { value: "numero",   label: "Número",    desc: "Valores numéricos enteros o decimales", icon: "#" },
    { value: "fecha",    label: "Fecha",     desc: "Formato de fecha y hora",             icon: "📅" },
    { value: "booleano", label: "Booleano",  desc: "Verdadero o falso",                   icon: "◐" },
    { value: "lista",    label: "Lista",     desc: "Selección de opciones predefinidas",  icon: "≡" },
];

const TIPO_COLORS = {
    texto:    { border: "#185FA5", bg: "#E6F1FB", text: "#185FA5" },
    numero:   { border: "#3B6D11", bg: "#EAF3DE", text: "#3B6D11" },
    fecha:    { border: "#854F0B", bg: "#FAEEDA", text: "#854F0B" },
    booleano: { border: "#993556", bg: "#FBEAF0", text: "#993556" },
    lista:    { border: "#533AB7", bg: "#EEEDFE", text: "#533AB7" },
};

const Field = ({ label, error, required, children, hint }) => (
    <div style={{ marginBottom: "1.4rem" }}>
        <label style={{
            display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500,
            color: "var(--color-text-primary, #1a1a1a)",
        }}>
            {label}
            {required && <span style={{ color: "#E24B4A", marginLeft: 3 }}>*</span>}
        </label>
        {children}
        {hint && !error && <p style={{ margin: "5px 0 0", fontSize: 12, color: "var(--color-text-secondary, #888)" }}>{hint}</p>}
        {error && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#A32D2D" }}>{error}</p>}
    </div>
);

const inputStyle = (hasError) => ({
    width: "100%", height: 38, padding: "0 12px", boxSizing: "border-box",
    border: `0.5px solid ${hasError ? "#E24B4A" : "var(--color-border-tertiary, #ddd)"}`,
    borderRadius: 8, fontSize: 14, outline: "none",
    background: "var(--color-background-primary, #fff)",
    color: "var(--color-text-primary, #1a1a1a)",
    transition: "border-color 0.15s",
});

export default function IndicesCreate({ indice = null }) {
    const isEdit = Boolean(indice?.id);

    const [form, setForm] = useState({
        codigo: indice?.codigo ?? "",
        nombre: indice?.nombre ?? "",
        tipo_dato: indice?.tipo_dato ?? "",
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [opciones, setOpciones] = useState(indice?.opciones ?? [""]);

    const set = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
        setErrors(e => ({ ...e, [key]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.codigo.trim()) e.codigo = "El código es obligatorio.";
        else if (form.codigo.length > 50) e.codigo = "Máximo 50 caracteres.";
        if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
        else if (form.nombre.length > 255) e.nombre = "Máximo 255 caracteres.";
        if (!form.tipo_dato) e.tipo_dato = "Seleccione un tipo de dato.";
        return e;
    };

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3200);
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }

        setSaving(true);

        const payload = {
            ...form,
            opciones: form.tipo_dato === "lista" ? opciones : [],
        };

        if (isEdit) payload.id = indice.id;

        try {
            await axios.post(route('indices.storeUpdate'),payload);
            showToast( isEdit ? "Índice actualizado correctamente." : "Índice creado correctamente.");

        } catch (error) {
            console.error(error);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            showToast("Error al guardar.", "error");

        } finally {
            setSaving(false);
        }
    };

    const selectedTipo = TIPO_COLORS[form.tipo_dato];

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", top: 24, right: 24, zIndex: 9999,
                    background: toast.type === "error" ? "#FCEBEB" : "#EAF3DE",
                    color: toast.type === "error" ? "#A32D2D" : "#27500A",
                    border: `0.5px solid ${toast.type === "error" ? "#E24B4A55" : "#63992255"}`,
                    borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 500,
                    animation: "fadeIn 0.2s ease",
                }}>
                    {toast.msg}
                </div>
            )}

            {/* Breadcrumb */}
            <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1.5rem", fontSize: 13, color: "var(--color-text-secondary, #888)" }}>
                <button onClick={() => router.visit("/configuration/indices")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary, #888)", padding: 0, fontSize: 13 }}>
                    Índices
                </button>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                <span style={{ color: "var(--color-text-primary, #1a1a1a)", fontWeight: 500 }}>
                    {isEdit ? "Editar índice" : "Nuevo índice"}
                </span>
            </nav>

            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--color-text-primary, #1a1a1a)" }}>
                    {isEdit ? "Editar índice" : "Nuevo índice"}
                </h1>
                <p style={{ margin: "5px 0 0", fontSize: 14, color: "var(--color-text-secondary, #666)" }}>
                    {isEdit ? "Modifica los datos del índice seleccionado." : "Completa la información para registrar un nuevo índice en el catálogo."}
                </p>
            </div>

            {/* Form card */}
            <div style={{
                background: "var(--color-background-primary, #fff)",
                border: "0.5px solid var(--color-border-tertiary, #e5e5e5)",
                borderRadius: 12, padding: "1.75rem",
            }}>

                {/* Sección: Identificación */}
                <div style={{ marginBottom: "1.75rem" }}>
                    <h2 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary, #888)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1.2rem", paddingBottom: 8, borderBottom: "0.5px solid var(--color-border-tertiary, #eee)" }}>
                        Identificación
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0 1.25rem" }}>
                        <Field label="Código" required error={errors.codigo} hint="Identificador único del índice.">
                            <input
                                type="text"
                                value={form.codigo}
                                onChange={e => set("codigo", e.target.value.toUpperCase())}
                                placeholder="EJ. IDX_001"
                                maxLength={50}
                                style={inputStyle(errors.codigo)}
                                onFocus={e => e.target.style.borderColor = "#185FA5"}
                                onBlur={e => e.target.style.borderColor = errors.codigo ? "#E24B4A" : "var(--color-border-tertiary, #ddd)"}
                            />
                        </Field>
                        <Field label="Nombre" required error={errors.nombre}>
                            <input
                                type="text"
                                value={form.nombre}
                                onChange={e => set("nombre", e.target.value)}
                                placeholder="Nombre descriptivo del índice"
                                maxLength={255}
                                style={inputStyle(errors.nombre)}
                                onFocus={e => e.target.style.borderColor = "#185FA5"}
                                onBlur={e => e.target.style.borderColor = errors.nombre ? "#E24B4A" : "var(--color-border-tertiary, #ddd)"}
                            />
                        </Field>
                    </div>
                </div>

                {/* Sección: Tipo de dato */}
                <div style={{ marginBottom: "1.75rem" }}>
                    <h2 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary, #888)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1.2rem", paddingBottom: 8, borderBottom: "0.5px solid var(--color-border-tertiary, #eee)" }}>
                        Tipo de dato
                        <span style={{ color: "#E24B4A", marginLeft: 3 }}>*</span>
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                        {TIPOS_DATO.map(tipo => {
                            const sel = form.tipo_dato === tipo.value;
                            const cols = TIPO_COLORS[tipo.value];
                            return (
                                <button
                                    key={tipo.value}
                                    type="button"
                                    onClick={() => set("tipo_dato", tipo.value)}
                                    style={{
                                        padding: "14px 12px", borderRadius: 10, cursor: "pointer",
                                        border: sel ? `1.5px solid ${cols.border}` : "0.5px solid var(--color-border-tertiary, #ddd)",
                                        background: sel ? cols.bg : "var(--color-background-primary, #fff)",
                                        textAlign: "left", transition: "all 0.15s",
                                        outline: "none",
                                    }}
                                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "var(--color-background-secondary, #fafafa)"; }}
                                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "var(--color-background-primary, #fff)"; }}
                                >
                                    <div style={{ fontSize: 18, marginBottom: 6, color: sel ? cols.text : "var(--color-text-secondary, #888)" }}>
                                        {tipo.icon}
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: sel ? cols.text : "var(--color-text-primary, #1a1a1a)", marginBottom: 3 }}>
                                        {tipo.label}
                                    </div>
                                    <div style={{ fontSize: 11, color: sel ? cols.text + "bb" : "var(--color-text-secondary, #999)", lineHeight: 1.4 }}>
                                        {tipo.desc}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {errors.tipo_dato && <p style={{ marginTop: 8, fontSize: 12, color: "#A32D2D" }}>{errors.tipo_dato}</p>}
                </div>
                {form.tipo_dato === "lista" && (
                    <div style={{ marginTop: 20 }}>
                        <h3 style={{ fontSize: 13 }}>Opciones</h3>

                        {opciones.map((op, i) => (
                            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                                <input
                                    type="text"
                                    value={op}
                                    onChange={(e) => {
                                        const newOps = [...opciones];
                                        newOps[i] = e.target.value;
                                        setOpciones(newOps);
                                    }}
                                    style={inputStyle()}
                                />

                                <button onClick={() => {
                                    const newOps = opciones.filter((_, idx) => idx !== i);
                                    setOpciones(newOps);
                                }}>
                                    ❌
                                </button>
                            </div>
                        ))}

                        <button onClick={() => setOpciones([...opciones, ""])}>
                            + Agregar opción
                        </button>
                    </div>
                )}

            </div>

            {/* Preview chip */}
            {form.tipo_dato && (
                <div style={{
                    marginTop: "1.25rem", padding: "12px 16px", borderRadius: 10,
                    border: `0.5px solid ${selectedTipo.border}33`,
                    background: selectedTipo.bg,
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={selectedTipo.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={{ fontSize: 13, color: selectedTipo.text }}>
                        El campo <strong style={{ fontWeight: 600 }}>{form.nombre || "sin nombre"}</strong> almacenará valores de tipo <strong style={{ fontWeight: 600 }}>{TIPOS_DATO.find(t => t.value === form.tipo_dato)?.label}</strong>.
                    </span>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: "1.75rem" }}>
                <button
                    type="button"
                    onClick={() => router.visit("/configuration/indices")}
                    style={{
                        height: 38, padding: "0 20px", borderRadius: 8, cursor: "pointer",
                        border: "0.5px solid var(--color-border-tertiary, #ddd)",
                        background: "transparent", fontSize: 14, fontWeight: 500,
                        color: "var(--color-text-secondary, #666)", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary, #f5f5f3)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                        height: 38, padding: "0 20px", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer",
                        border: "none", background: saving ? "#B5D4F4" : "#185FA5",
                        fontSize: 14, fontWeight: 500, color: "#fff",
                        display: "inline-flex", alignItems: "center", gap: 8,
                        transition: "background 0.15s", opacity: saving ? 0.8 : 1,
                    }}
                    onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#0C447C"; }}
                    onMouseLeave={e => { if (!saving) e.currentTarget.style.background = "#185FA5"; }}
                >
                    {saving && <svg style={{ animation: "spin 0.8s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
                    {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear índice"}
                </button>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
