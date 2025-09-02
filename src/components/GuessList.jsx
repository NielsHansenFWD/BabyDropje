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

    return (
        <div className="mt-4">
            <h2 className="font-bold text-lg mb-2">Alle gokjes</h2>
            <table className="border-collapse border w-full">
                <thead>
                <tr>
                    <th className="border p-1">Deelnemer</th>
                    <th className="border p-1">Naam gok</th>
                    <th className="border p-1">Gewicht</th>
                    <th className="border p-1">Lengte</th>
                    <th className="border p-1">Geboortedatum</th>
                </tr>
                </thead>
                <tbody>
                {guesses.map((g) => (
                    <tr key={g.id}>
                        <td className="border p-1">{g.Users?.Name}</td>
                        <td className="border p-1">{g.naam}</td>
                        <td className="border p-1">{g.gewicht} g</td>
                        <td className="border p-1">{g.lengte} cm</td>
                        <td className="border p-1">{g.geboortedatum}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
