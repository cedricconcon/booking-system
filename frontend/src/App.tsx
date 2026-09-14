import { useState } from "react"
import { supabase } from "./lib/supabase"

export default function App (){
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [_serviceId, setServiceId] = useState<string>('')
  const [appointedAt, setAppointedAt] = useState<string>('')

  const handleSubmit = async () =>{
    const {data: client, error: clientError} = await supabase
    .from('clients')
    .insert({
      full_name: fullName,
      email: email,
      phone_number: phoneNumber
    })
    .select()
    .single()
    
    if(clientError) {
      console.error('Client error:', clientError)
      return
    }
    console.log('Client created:', client)
  }
  return(
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Book An Appointment</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="John1@gmail.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="09-123-456-790"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setServiceId(e.target.value)}>
           <option value="">Select a service</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
          <input 
          type="date"
          value={appointedAt}
          onChange={(e) => setAppointedAt(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="mb-4">
          <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
}