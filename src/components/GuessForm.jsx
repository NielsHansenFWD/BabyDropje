import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"

export default function GuessForm({ onSubmit }) {
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState("")
    const [newUser, setNewUser] = useState("")
    const [naamGok, setNaamGok] = useState("")
    const [gewicht, setGewicht] = useState("")
    const [lengte, setLengte] = useState("")
    const [geboortedatum, setGeboortedatum] = useState("")
    const [gewichtError, setGewichtError] = useState("")
    const [lengteError, setLengteError] = useState("")

    function handleLengteChange(e) {
        const value = e.target.value
        setLengte(value)
        if (!/^\d{0,2}$/.test(value)) {
            setLengteError("Voer exact 2 cijfers in, zonder komma.")
        } else {
            setLengteError("")
        }
    }

    function handleGewichtChange(e) {
        const value = e.target.value
        setGewicht(value)
        if (!/^\d{0,4}$/.test(value)) {
            setGewichtError("Voer exact 4 cijfers in, zonder komma.")
        } else {
            setGewichtError("")
        }
    }

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

        if (!/^\d{2}$/.test(lengte)) {
            setLengteError("Voer exact 2 cijfers in, zonder komma.")
            return
        }

        if (!/^\d{4}$/.test(gewicht)) {
            setGewichtError("Voer exact 4 cijfers in, zonder komma.")
            return
        }

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
            <h2 className="font-bold text-2xl mb-4 text-gray-800">Nieuw gokje</h2>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                    Ik ben:
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

            {!userId && (
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
            )}

            <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                    Hoe ga ik heten?
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
                    onChange={handleGewichtChange}
                    className={`block w-full border ${gewichtError ? "border-red-500" : "border-gray-300"} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    required
                    min="0"
                    max="9999"
                    step="1"
                    inputMode="numeric"
                    pattern="\d{4}"
                />
                {gewichtError && (
                    <p className="text-red-600 text-sm mt-1">{gewichtError}</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                    Hoe groot ga ik al zijn (cm)?
                </label>
                <input
                    type="text"
                    value={lengte}
                    onChange={handleLengteChange}
                    className={`block w-full border ${lengteError ? "border-red-500" : "border-gray-300"} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    required
                    inputMode="numeric"
                    pattern="\d{2}"
                    maxLength={2}
                />
                {lengteError && (
                    <p className="text-red-600 text-sm mt-1">{lengteError}</p>
                )}
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
                Drop-je gokje hier!
            </button>
        </form>
    )
}
