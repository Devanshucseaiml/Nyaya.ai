"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Phone, Video, MapPin, CreditCard, IndianRupee, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface ConsultationBookingProps {
  lawyer: any
  user: any
}

export default function ConsultationBooking({ lawyer, user }: ConsultationBookingProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    preferred_date: "",
    preferred_time: "",
    consultation_type: "online",
  })
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First, create the consultation request
      const { data: consultationData, error: consultationError } = await supabase
        .from("consultation_requests")
        .insert({
          user_id: user.id,
          lawyer_id: lawyer.id,
          subject: formData.subject,
          description: formData.description,
          preferred_date: formData.preferred_date ? new Date(formData.preferred_date).toISOString() : null,
          preferred_time: formData.preferred_time,
          consultation_type: formData.consultation_type,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (consultationError) throw consultationError

      // Move to payment step
      setCurrentStep(2)
    } catch (error) {
      console.error("Error submitting consultation request:", error)
      alert("Failed to submit consultation request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    setIsPaymentProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update consultation status to paid
      const { error: updateError } = await supabase
        .from("consultation_requests")
        .update({ 
          status: "paid",
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id)
        .eq("lawyer_id", lawyer.id)
        .order("created_at", { ascending: false })
        .limit(1)

      if (updateError) throw updateError

      // Move to success step
      setCurrentStep(3)
    } catch (error) {
      console.error("Error processing payment:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsPaymentProcessing(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatFee = (fee: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(fee)
  }

  const consultationTypes = [
    {
      value: "online",
      label: "Online Video Call",
      icon: Video,
      description: "Meet via video call from anywhere",
      price: lawyer.consultation_fee,
    },
    {
      value: "phone",
      label: "Phone Call",
      icon: Phone,
      description: "Traditional phone consultation",
      price: Math.round(lawyer.consultation_fee * 0.8), // 20% discount for phone
    },
    {
      value: "in-person",
      label: "In-Person Meeting",
      icon: MapPin,
      description: "Meet at lawyer's office",
      price: Math.round(lawyer.consultation_fee * 1.2), // 20% premium for in-person
    },
  ]

  const selectedType = consultationTypes.find(type => type.value === formData.consultation_type)

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Consultation Details</CardTitle>
        <CardDescription>Provide details about your legal consultation needs</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief subject of your legal matter"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed information about your legal issue, relevant documents, and specific questions you have..."
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferred_date">Preferred Date</Label>
              <Input
                id="preferred_date"
                type="date"
                value={formData.preferred_date}
                onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="preferred_time">Preferred Time</Label>
              <Select
                value={formData.preferred_time}
                onValueChange={(value) => setFormData({ ...formData, preferred_time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Consultation Type *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {consultationTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.consultation_type === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setFormData({ ...formData, consultation_type: type.value })}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <type.icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <IndianRupee className="h-3 w-3" />
                    {formatFee(type.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Important Notes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• The lawyer will review your request and respond within 24 hours</li>
              <li>• Payment is required to confirm your consultation</li>
              <li>• You can reschedule or cancel up to 2 hours before the consultation</li>
              <li>• All consultations are confidential and protected by attorney-client privilege</li>
            </ul>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            {isLoading ? "Submitting..." : "Continue to Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Complete payment to confirm your consultation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Consultation with {lawyer.full_name}</span>
                <span>{formatFee(selectedType?.price || 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{selectedType?.label}</span>
                <span>{formData.preferred_date} at {formData.preferred_time}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatFee(selectedType?.price || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-base">Payment Method</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Credit/Debit Card</span>
                </div>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setPaymentMethod("upi")}
              >
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  <span className="font-medium">UPI Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="card_number">Card Number</Label>
                <Input id="card_number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="upi_id">UPI ID</Label>
                <Input id="upi_id" placeholder="username@upi" />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isPaymentProcessing} 
              className="flex-1"
            >
              {isPaymentProcessing ? "Processing..." : `Pay ${formatFee(selectedType?.price || 0)}`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardContent className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-6">
          Your consultation has been booked successfully. The lawyer will contact you within 24 hours.
        </p>
        <div className="bg-muted p-4 rounded-lg mb-6 text-left">
          <h4 className="font-medium mb-2">Booking Details:</h4>
          <div className="space-y-1 text-sm">
            <div><strong>Lawyer:</strong> {lawyer.full_name}</div>
            <div><strong>Type:</strong> {selectedType?.label}</div>
            <div><strong>Date:</strong> {formData.preferred_date}</div>
            <div><strong>Time:</strong> {formData.preferred_time}</div>
            <div><strong>Amount:</strong> {formatFee(selectedType?.price || 0)}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1">
            Go to Dashboard
          </Button>
          <Button onClick={() => router.push(`/lawyers/${lawyer.id}`)} className="flex-1">
            View Lawyer Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Book Consultation</h1>
        <p className="text-muted-foreground">Schedule a consultation with {lawyer.full_name}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1 ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
            }`}>
              1
            </div>
            <span className="ml-2 hidden sm:inline">Details</span>
          </div>
          <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2 ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
            }`}>
              2
            </div>
            <span className="ml-2 hidden sm:inline">Payment</span>
          </div>
          <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 3 ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
            }`}>
              3
            </div>
            <span className="ml-2 hidden sm:inline">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lawyer Info */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={lawyer.profile_image || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {getInitials(lawyer.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{lawyer.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{lawyer.location}</p>
                  <p className="text-sm text-muted-foreground">{lawyer.experience_years} years experience</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.lawyer_specialization_mapping.slice(0, 3).map((mapping: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {mapping.lawyer_specializations.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Consultation Fee</span>
                    <span className="text-lg font-bold text-green-600">{formatFee(lawyer.consultation_fee)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  )
}
