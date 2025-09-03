import { useState } from "react"
import GuessForm from "./components/GuessForm"
import GuessList from "./components/GuessList"

export default function App() {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">Baby Dropje 👶</h1>
            <GuessForm onSubmit={() => setRefreshKey((k) => k + 1)} />
            <GuessList refreshKey={refreshKey} />
        </div>
    )
}
