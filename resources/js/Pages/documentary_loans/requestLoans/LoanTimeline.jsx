import { Timeline } from "primereact/timeline"
import { Card } from "primereact/card"
import { Tag } from "primereact/tag"
import { Avatar } from "primereact/avatar"
import { Divider } from "primereact/divider"
import { formatDate } from "../../../hooks/useDate"
import { Link, usePage } from "@inertiajs/react"
import { Button } from "primereact/button"

export default function LoanTimeline({ historic }) {
  const { translations, current_language } = usePage()?.props

  const getSeverity = (state) => {
    const severityMap = {
      5: "warning",
      4: "danger",
      2: "info",
      3: "success",
    }
    // Default to info if state doesn't match any predefined states
    return severityMap[state] || "info"
  }

  const customizedMarker = (item) => {
    const severity = getSeverity(item.state_loan_id)

    return (
      <div className="flex align-items-center justify-content-center">
        <Tag
          severity={severity}
          value={item.state_loan["name_" + current_language]}
          className="p-2 font-bold"
          style={{ borderRadius: "12px" }}
        />
      </div>
    )
  }

  const customizedContent = (item) => {
    return (
      <Card
        className="mb-3 shadow-2 border-round-lg"
        style={{
          borderLeft: `4px solid var(--${getSeverity(item.state_loan?.state)}-color)`,
          transition: "transform 0.2s",
        }}
        pt={{
          content: { className: "p-3" },
          title: { className: "text-xl font-bold mb-2" },
          subTitle: { className: "text-sm text-500 mb-3" },
        }}
      >
        <div className="card-header mb-3">
          <h3 className="text-xl font-bold m-0">{item.state_loan["name_" + current_language]}</h3>
          <div className="flex align-items-center text-500 mt-2">
            <i className="pi pi-calendar mr-2" style={{ fontSize: "1rem" }}></i>
            <span>{formatDate(item.created_at, true)}</span>
          </div>
        </div>
        <Divider />
        <div className="card-content">
          <div className="flex align-items-center mb-3">
            <i className="pi pi-user mr-2 text-primary" style={{ fontSize: "1rem" }}></i>
            <div className="flex align-items-center">
              <Avatar
                label={`${item.created_by.persona.nombre.charAt(0)}${item.created_by.persona.apellido.charAt(0)}`}
                shape="circle"
                size="small"
                className="mr-2"
              />
              <span className="font-medium">
                {item.created_by.persona.nombre} {item.created_by.persona.apellido}
              </span>
            </div>
          </div>

          <div className="flex align-items-center mb-3">
            <i className="pi pi-file mr-2 text-primary" style={{ fontSize: "1rem" }}></i>
            <span className="font-medium">{item.exp_file_files.exp_file.name}</span>
          </div>

          {item.observation && (
            <div className="p-3 border-round bg-gray-50 mt-3">
              <div className="flex align-items-center mb-2">
                <i className="pi pi-comment mr-2 text-primary" style={{ fontSize: "1rem" }}></i>
                <span className="font-medium">{translations.request_loans.request_loans
                            .table.loan_dialog.observation}:</span>
              </div>
              <p className="m-0 line-height-3">{item.observation}</p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="card border-round shadow-2 p-4">
      <div className="flex align-items-center mb-4">
        <Link href={ route('admin-loans.adminLoans') }>
            <Button label={translations.auth.back} />
        </Link>
        <h2 className="text-2xl font-bold ml-4">{translations.request_loans.request_loans.title_historic}</h2>
      </div>
      <Divider />
      <div className="timeline-container p-2">
        <Timeline
          value={historic}
          align="left"
          className="customized-timeline p-3"
          marker={customizedMarker}
          content={customizedContent}
          pt={{
            marker: { className: "timeline-marker" },
            connector: { className: "timeline-connector" },
          }}
        />
      </div>

      {!historic || historic.length === 0 ? (
        <div className="p-4 text-center text-500">No hay registros históricos disponibles</div>
      ) : null}

      <style jsx global>{`
        .customized-timeline .p-timeline-event {
          padding-bottom: 2rem;
        }
        .customized-timeline .p-timeline-event-opposite {
          flex: 0;
        }
        .customized-timeline .p-timeline-event-content {
          padding: 0 1rem;
        }
        .timeline-marker {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline-connector {
          background-color: var(--surface-border);
        }
        .card:hover {
          transform: translateY(-2px);
        }
        @media screen and (max-width: 768px) {
          .customized-timeline .p-timeline-event-content {
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}

