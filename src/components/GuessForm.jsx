import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function GuessForm({ onSubmit }) {
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState("")
    const [newUser, setNewUser] = useState("")
    const [naamGok, setNaamGok] = useState("")
    const [gewicht, setGewicht] = useState("")
    const [lengte, setLengte] = useState("")
    const [geboortedatum, setGeboortedatum] = useState("")

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        const { data, error } = await supabase.from("Users").select("*")
        if (error) console.error(error)
        else setUsers(data)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        let selectedUserId = userId

        // Als nieuwe gebruiker ingevuld is, eerst aanmaken
        if (newUser.trim()) {
            const { data, error } = await supabase
                .from("Users")
                .insert({ Name: newUser })
                .select()
            if (error) {
                console.error(error)
                return
            }
            selectedUserId = data[0].id
            setUsers([...users, data[0]])
            setUserId(data[0].id)
        }

        // Voeg gok toe
        const { error } = await supabase.from("Guesses").insert({
            user_id: selectedUserId,
            naam: naamGok,
            gewicht: parseInt(gewicht),
            lengte: parseInt(lengte),
            geboortedatum,
        })

        if (error) console.error(error)
        else {
            // Clear form
            setNewUser("")
            setNaamGok("")
            setGewicht("")
            setLengte("")
            setGeboortedatum("")
            if (onSubmit) onSubmit()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="font-bold text-2xl mb-4 text-gray-800">Nieuwe gok</h2>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                    Kies bestaande deelnemer:
                </label>
                <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">-- kies --</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.Name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                    Of nieuwe deelnemer:
                </label>
                <input
                    type="text"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                    Wat wordt mijn naam?
                </label>
                <input
                    type="text"
                    value={naamGok}
                    onChange={(e) => setNaamGok(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                    Hoeveel ga ik wegen (gram)?
                </label>
                <input
                    type="number"
                    value={gewicht}
                    onChange={(e) => setGewicht(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                    Hoe groot ga ik al zijn (cm)?
                </label>
                <input
                    type="number"
                    value={lengte}
                    onChange={(e) => setLengte(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 mb-1 font-medium">
                    Wanneer zal ik er zijn?
                </label>
                <input
                    type="date"
                    value={geboortedatum}
                    onChange={(e) => setGeboortedatum(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-150"
            >
                Verzenden
            </button>
        </form>
    )
}
