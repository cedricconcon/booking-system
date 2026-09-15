import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

type Services = {
    id: string,
    name: string,
    price: number
  }
  
export default function App (){
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [serviceId, setServiceId] = useState<string>('')
  const [appointedAt, setAppointedAt] = useState<string>('')
  const [services, setServices] = useState<Services[]>([])
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  
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

    const selectedService = services.find(s => s.id === serviceId)
    const { error: bookingError } = await supabase
    .from('bookings')
    .insert({
      client_id: client.id,
      service_id: serviceId,
      appointed_at: appointedAt,
      price_at_booking: selectedService?.price ?? 0,
      status: 'pending'
    })
    if(bookingError){
      console.error('Booking error: ', bookingError)
      return
    }
    console.log('Booking saved successfully')
    setIsSuccess(true)
  }

  useEffect(() =>{
    const fetchServices = async () => {
      const { data, error } = await supabase
      .from('services')
      .select('id, name, price')

      if(error){
        console.error('Error fetching services:', error)
        return
      }
      if(data){
        setServices(data)
      }
    }
    fetchServices()
  }, [])

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
           {services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}  — ₱{service.price}</option>
           ))}
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
        {isSuccess && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">Booking confirmed! We will contact you shortly</div>
          )}
      </div>
    </div>
  )
}