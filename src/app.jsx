import { useState } from "react"
import GuessForm from "./components/GuessForm"
import GuessList from "./components/GuessList"

export default function App() {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Baby Gokspel 👶</h1>
            <GuessForm onSubmit={() => setRefreshKey((k) => k + 1)} />
            <GuessList refreshKey={refreshKey} />
        </div>
    )
}
