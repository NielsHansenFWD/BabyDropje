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
                .insert({ naam: newUser })
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
        const { error } = await supabase.from("guesses").insert({
            user_id: selectedUserId,
            naam_gok: naamGok,
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
        <form onSubmit={handleSubmit} className="p-4 border rounded">
            <h2 className="font-bold text-lg mb-2">Nieuwe gok</h2>

            <label className="block mb-2">
                Kies bestaande deelnemer:
                <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="block w-full border p-1"
                >
                    <option value="">-- kies --</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.naam}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block mb-2">
                Of nieuwe deelnemer:
                <input
                    type="text"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    className="block w-full border p-1"
                />
            </label>

            <label className="block mb-2">
                Naam gok:
                <input
                    type="text"
                    value={naamGok}
                    onChange={(e) => setNaamGok(e.target.value)}
                    className="block w-full border p-1"
                    required
                />
            </label>

            <label className="block mb-2">
                Gewicht (gram):
                <input
                    type="number"
                    value={gewicht}
                    onChange={(e) => setGewicht(e.target.value)}
                    className="block w-full border p-1"
                    required
                />
            </label>

            <label className="block mb-2">
                Lengte (cm):
                <input
                    type="number"
                    value={lengte}
                    onChange={(e) => setLengte(e.target.value)}
                    className="block w-full border p-1"
                    required
                />
            </label>

            <label className="block mb-2">
                Geboortedatum:
                <input
                    type="date"
                    value={geboortedatum}
                    onChange={(e) => setGeboortedatum(e.target.value)}
                    className="block w-full border p-1"
                    required
                />
            </label>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Opslaan
            </button>
        </form>
    )
}
