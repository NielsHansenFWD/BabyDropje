import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient.jsx"

const CORRECT = {
    naam: "Achiel",
    gewicht: 4125,
    lengte: 52,
    geboortedatum: "2026-01-26",
}

function naamOk(g) {
    return g.naam?.trim().toLowerCase() === CORRECT.naam.toLowerCase()
}

function gewichtOk(g) {
    return Math.abs(Number(g.gewicht) - CORRECT.gewicht) <= 50
}

function lengteOk(g) {
    return Number(g.lengte) === CORRECT.lengte
}

function datumOk(g) {
    return g.geboortedatum === CORRECT.geboortedatum || g.geboortedatum === "26/01/2026"
}

function berekenPunten(g) {
    let pts = 0
    if (naamOk(g)) pts++
    if (gewichtOk(g)) pts++
    if (lengteOk(g)) pts++
    if (datumOk(g)) pts++
    return pts
}

function rangIcon(i) {
    if (i === 0) return "🥇"
    if (i === 1) return "🥈"
    if (i === 2) return "🥉"
    return i + 1
}

export default function RankingList() {
    const [guesses, setGuesses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchGuesses()
    }, [])

    async function fetchGuesses() {
        setLoading(true)
        const { data, error } = await supabase
            .from("Guesses")
            .select("*, Users(Name)")

        if (error) {
            console.error(error)
        } else {
            const scored = data.map(g => ({ ...g, punten: berekenPunten(g) }))
            scored.sort((a, b) => b.punten - a.punten)
            setGuesses(scored)
        }
        setLoading(false)
    }

    return (
        <div className="mt-8 max-w-4xl mx-auto w-full px-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-orange-400 to-yellow-400 rounded-xl p-6 mb-6 text-white text-center shadow-lg">
                <div className="text-4xl mb-2">🍼</div>
                <h2 className="text-3xl font-bold">Achiel is geboren! 🎉</h2>
                <p className="mt-1 opacity-90 text-sm">26 januari 2026 · 4125 g · 52 cm</p>
            </div>

            {/* Correct answers legend */}
            <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
                <div className="bg-pink-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Naam</div>
                    <div className="font-bold text-pink-600">Achiel</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Gewicht</div>
                    <div className="font-bold text-purple-600">4125 g <span className="text-xs font-normal text-gray-400">(±50g)</span></div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Lengte</div>
                    <div className="font-bold text-blue-600">52 cm</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Geboortedatum</div>
                    <div className="font-bold text-green-600">26/01/2026</div>
                </div>
            </div>

            {/* Ranking table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">🏆 Ranglijst</h3>
                    <span className="text-sm text-gray-400">{guesses.length} deelnemers</span>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-400">Laden…</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Deelnemer</th>
                                    <th className="px-4 py-3 text-left">Naam</th>
                                    <th className="px-4 py-3 text-left">Gewicht</th>
                                    <th className="px-4 py-3 text-left">Lengte</th>
                                    <th className="px-4 py-3 text-left">Datum</th>
                                    <th className="px-4 py-3 text-center">Punten</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {guesses.map((g, i) => (
                                    <tr
                                        key={g.id}
                                        className={
                                            i === 0
                                                ? "bg-yellow-50"
                                                : i % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50/50"
                                        }
                                    >
                                        <td className="px-4 py-3 text-base font-bold w-10">
                                            {rangIcon(i)}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {g.Users?.Name || "Onbekend"}
                                        </td>
                                        <td className={`px-4 py-3 font-medium ${naamOk(g) ? "text-green-600" : "text-red-400"}`}>
                                            {g.naam}
                                            {naamOk(g) && <span className="ml-1">✓</span>}
                                        </td>
                                        <td className={`px-4 py-3 font-medium ${gewichtOk(g) ? "text-green-600" : "text-red-400"}`}>
                                            {g.gewicht} g
                                            {gewichtOk(g) && <span className="ml-1">✓</span>}
                                        </td>
                                        <td className={`px-4 py-3 font-medium ${lengteOk(g) ? "text-green-600" : "text-red-400"}`}>
                                            {g.lengte} cm
                                            {lengteOk(g) && <span className="ml-1">✓</span>}
                                        </td>
                                        <td className={`px-4 py-3 font-medium ${datumOk(g) ? "text-green-600" : "text-red-400"}`}>
                                            {g.geboortedatum}
                                            {datumOk(g) && <span className="ml-1">✓</span>}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-block px-2 py-1 rounded-full text-sm font-bold
                                                ${g.punten === 4 ? "bg-yellow-100 text-yellow-700" :
                                                  g.punten === 3 ? "bg-green-100 text-green-700" :
                                                  g.punten === 2 ? "bg-blue-100 text-blue-700" :
                                                  g.punten === 1 ? "bg-gray-100 text-gray-600" :
                                                  "bg-red-50 text-red-400"}`}>
                                                {g.punten}/4
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

