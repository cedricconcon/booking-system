import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

type Services = {
  id: string
  name: string
  price: number
}

// ADD THIS
type FormErrors = {
  fullName?: string
  email?: string
  phoneNumber?: string
  serviceId?: string
  appointedAt?: string
}

export default function App() {
  const [fullName, setFullName]       = useState<string>('')
  const [email, setEmail]             = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [serviceId, setServiceId]     = useState<string>('')
  const [appointedAt, setAppointedAt] = useState<string>('')
  const [services, setServices]       = useState<Services[]>([])
  const [isSuccess, setIsSuccess]     = useState<boolean>(false)
  const [isLoading, setIsLoading]     = useState<boolean>(false)

  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): FormErrors => {
    const errs: FormErrors = {}

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required.'
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 20 characters.'
    }

    if (!email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address.'
    }

    const cleanPhone = phoneNumber.replace(/[-\s]/g, '')
    if (!phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required.'
    } else if (!/^(09|\+639)\d{9}$/.test(cleanPhone)) {
      errs.phoneNumber = 'Enter a valid PH number (e.g. 09123456789).'
    }

    if (!serviceId) {
      errs.serviceId = 'Please select a service.'
    }

    if (!appointedAt) {
      errs.appointedAt = 'Please pick an appointment date.'
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (new Date(appointedAt) < today) {
        errs.appointedAt = 'Date must be today or in the future.'
      }
    }

    return errs
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    setIsLoading(true)

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({ full_name: fullName, email, phone_number: phoneNumber })
      .select()
      .single()

    if (clientError) {
      console.error('Client error:', clientError)
      setIsLoading(false)
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
        status: 'pending',
      })

    if (bookingError) {
      console.error('Booking error: ', bookingError)
      setIsLoading(false)
      return
    }

    setIsSuccess(true)
    setIsLoading(false)
  }

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price')
      if (error) { console.error('Error fetching services:', error); return }
      if (data) setServices(data)
    }
    fetchServices()
  }, [])

  return (
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
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">! {errors.fullName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@gmail.com"
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">! {errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="09123456789"
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.phoneNumber ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">! {errors.phoneNumber}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.serviceId ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — ₱{service.price}
              </option>
            ))}
          </select>
          {errors.serviceId && <p className="text-red-500 text-sm mt-1">! {errors.serviceId}</p>}
        </div>

        {/* Appointment Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
          <input
            type="date"
            value={appointedAt}
            onChange={(e) => setAppointedAt(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.appointedAt ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.appointedAt && <p className="text-red-500 text-sm mt-1">! {errors.appointedAt}</p>}
        </div>

        {/* Submit */}
        <div className="mb-4">
          <button
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Submit'}
          </button>
        </div>

        {isSuccess && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            Booking confirmed! We will contact you shortly.
          </div>
        )}
      </div>
    </div>
  )
}