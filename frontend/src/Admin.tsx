import { useEffect, useState } from "react";
import {supabase} from "./lib/supabase"

type Booking = {
    id: string
    appointed_at: string
    status: string
    price_at_booking: number
    clients: {full_name: string; email: string}
    services: {name: string}
}
export default function Admin(){
    const [bookings, setBookings] = useState<Booking[]>([])

    const fetchBookings = async () => {
        const {data, error} = await supabase
        .from('bookings')
        .select(`id, appointed_at, status, price_at_booking, clients(full_name, email), services(name)`)
        .order('appointed_at', {ascending: false})

        if(error) {console.error(error); return}
        if(data) setBookings(data as unknown as Booking[])
    }
    const updateStatus = async (id: string, status: string) => {
        await supabase.from('bookings').update({ status }).eq('id', id)
        fetchBookings()
    }

    useEffect(() => { fetchBookings() }, [])

    return(
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>
            <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-md">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Client</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Service</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Date</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Price</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="border-t border-gray-100">
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{booking.clients.full_name}</p>
                                    <p className="text-sm text-gray-500">{booking.clients.email}</p>
                                </td>
                                <td className="p-4 text-gray-700">{booking.services.name}</td>
                                <td className="p-4 text-gray-700">
                                    {new Date(booking.appointed_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-gray-700">₱{booking.price_at_booking}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                     'bg-yellow-100 text-yellow-800'
                                    }`}>{booking.status}</span>
                                </td>
                                <td className="p-4 space-x-2">
                                    <button onClick={() => updateStatus(booking.id, 'confirmed')}
                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">Confirm</button>
                                        <button onClick={() => updateStatus(booking.id, 'cancelled')}
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">Cancel</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                </table>
            </div>
        </div>
    )
}