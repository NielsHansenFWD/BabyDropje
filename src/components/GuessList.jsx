import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient.jsx"

const CORRECT = {
    naam: "Achiel",
    gewicht: 4125,
    lengte: 52,
    geboortedatum: "2026-01-26",
}

function berekenPunten(g) {
    let pts = 0
    if (g.naam?.trim().toLowerCase() === CORRECT.naam.toLowerCase()) pts++
    if (Math.abs(Number(g.gewicht) - CORRECT.gewicht) <= 50) pts++
    if (Number(g.lengte) === CORRECT.lengte) pts++
    const bd = g.geboortedatum || ""
    if (bd === CORRECT.geboortedatum || bd === "26/01/2026") pts++
    return pts
}

export default function GuessList() {
    const [guesses, setGuesses] = useState([])

    useEffect(() => {
        fetchGuesses()
    }, [])

    async function fetchGuesses() {
        const { data, error } = await supabase
            .from("Guesses")
            .select("*, Users(Name)")

        if (error) console.error(error)
        else {
            const scored = data.map(g => ({ ...g, punten: berekenPunten(g) }))
            scored.sort((a, b) => b.punten - a.punten)
            setGuesses(scored)
        }
    }

    const naamOk = (g) => g.naam?.trim().toLowerCase() === CORRECT.naam.toLowerCase()
    const gewichtOk = (g) => Math.abs(Number(g.gewicht) - CORRECT.gewicht) <= 50
    const lengteOk = (g) => Number(g.lengte) === CORRECT.lengte
    const datumOk = (g) => g.geboortedatum === CORRECT.geboortedatum || g.geboortedatum === "26/01/2026"

    return (
        <div className="mt-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 w-full">
            <h2 className="font-bold text-2xl mb-2 text-gray-800">🏆 Ranglijst</h2>
            <p className="text-sm text-gray-500 mb-6">
                Juiste antwoorden: Naam <strong>Achiel</strong> · Gewicht <strong>4125 g</strong> · Lengte <strong>52 cm</strong> · Geboortedatum <strong>26/01/2026</strong>
                <br />Gewicht mag ±50 g naast zitten. Max. 4 punten.
            </p>
            <div className="overflow-x-auto">
                <table className="border-collapse w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-b p-2 font-semibold text-left">#</th>
                            <th className="border-b p-2 font-semibold text-left">Deelnemer</th>
                            <th className="border-b p-2 font-semibold text-left">Naam</th>
                            <th className="border-b p-2 font-semibold text-left">Gewicht</th>
                            <th className="border-b p-2 font-semibold text-left">Lengte</th>
                            <th className="border-b p-2 font-semibold text-left">Geboortedatum</th>
                            <th className="border-b p-2 font-semibold text-center">Punten</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guesses.map((g, i) => (
                            <tr
                                key={g.id}
                                className={i === 0 ? "bg-yellow-50 font-semibold" : i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                            >
                                <td className="p-2">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</td>
                                <td className="p-2">{g.Users?.Name || "Onbekend"}</td>
                                <td className={`p-2 ${naamOk(g) ? "text-green-600 font-semibold" : "text-red-500"}`}>{g.naam}</td>
                                <td className={`p-2 ${gewichtOk(g) ? "text-green-600 font-semibold" : "text-red-500"}`}>{g.gewicht} g</td>
                                <td className={`p-2 ${lengteOk(g) ? "text-green-600 font-semibold" : "text-red-500"}`}>{g.lengte} cm</td>
                                <td className={`p-2 ${datumOk(g) ? "text-green-600 font-semibold" : "text-red-500"}`}>{g.geboortedatum}</td>
                                <td className="p-2 text-center font-bold text-base">{g.punten}/4</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

