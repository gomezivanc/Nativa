
import { TabView, TabPanel } from "primereact/tabview"
import { usePage } from '@inertiajs/react'
import EmailInbox from './EmailInbox'
import { useState } from "react"
import EmailComposer from "./EmailComposer"

export default function Index() {
    const { translations, current_language } = usePage()?.props
    const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="card">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header={translations.filing.email_filing.tabs.inbox} leftIcon="pi pi-inbox">
          <EmailInbox />
        </TabPanel>
        <TabPanel header={translations.filing.email_filing.tabs.compose} leftIcon="pi pi-pencil">
          <EmailComposer changeView={ () => setActiveIndex(0) } />
        </TabPanel>
      </TabView>
    </div>
  )
}