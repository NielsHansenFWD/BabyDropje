import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient.jsx"

export default function GuessList({ refreshKey }) {
    const [guesses, setGuesses] = useState([])

    useEffect(() => {
        fetchGuesses()
    }, [refreshKey])

    async function fetchGuesses() {
        const { data, error } = await supabase
            .from("Guesses")
            .select("*, Users(Name)")
            .order("user_id", { ascending: false })
            .order("created_at", { ascending: true })

        if (error) console.error(error)
        else setGuesses(data)
    }

    const counts = {}
    guesses.forEach(g => {
        const name = g.Users?.Name || "Onbekend"
        counts[name] = (counts[name] || 0) + 1
    })
/*
    return (
        <div className="mt-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="font-bold text-xl mb-4 text-gray-800">Alle gokjes</h2>
            <div className="overflow-x-auto">
                <table className="border-collapse w-full text-sm">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border-b p-2 font-semibold text-left">Deelnemer</th>
                        <th className="border-b p-2 font-semibold text-left">Naam gok</th>
                        <th className="border-b p-2 font-semibold text-left">Gewicht</th>
                        <th className="border-b p-2 font-semibold text-left">Lengte</th>
                        <th className="border-b p-2 font-semibold text-left">Geboortedatum</th>
                    </tr>
                    </thead>
                    <tbody>
                    {guesses.map((g, i) => (
                        <tr
                            key={g.id}
                            className={i % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-100"}
                        >
                            <td className="p-2">{g.Users?.Name}</td>
                            <td className="p-2">{g.naam}</td>
                            <td className="p-2">{g.gewicht} g</td>
                            <td className="p-2">{g.lengte} cm</td>
                            <td className="p-2">{g.geboortedatum}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    ) */

    return (
        <div className="mt-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="font-bold text-xl mb-4 text-gray-800">Aantal gokjes per deelnemer</h2>
            <div className="overflow-x-auto">
                <table className="border-collapse w-full text-sm">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border-b p-2 font-semibold text-left">Deelnemer</th>
                        <th className="border-b p-2 font-semibold text-left">Aantal gokjes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(counts).map(([name, count]) => (
                        <tr key={name} className="bg-white hover:bg-gray-100">
                            <td className="p-2">{name}</td>
                            <td className="p-2">{count}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
