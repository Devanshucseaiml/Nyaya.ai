"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Video, 
  Star, 
  IndianRupee, 
  User, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  MessageCircle,
  FileText,
  History
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface UserDashboardProps {
  user: any
  consultations: any[]
  reviews: any[]
}

export default function UserDashboard({ user, consultations, reviews }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("consultations")

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><ClockIcon className="h-3 w-3 mr-1" />Pending</Badge>
      case "paid":
        return <Badge variant="default"><CreditCard className="h-3 w-3 mr-1" />Paid</Badge>
      case "accepted":
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case "online":
        return <Video className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "in-person":
        return <MapPin className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const totalSpent = consultations
    .filter(c => c.status === "paid" || c.status === "completed")
    .reduce((sum, c) => sum + (c.lawyers?.consultation_fee || 0), 0)

  const pendingConsultations = consultations.filter(c => c.status === "pending" || c.status === "paid")
  const completedConsultations = consultations.filter(c => c.status === "completed")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {getInitials(user.user_metadata?.full_name || user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Welcome back, {user.user_metadata?.full_name || "User"}!
            </h1>
            <p className="text-muted-foreground">Manage your legal consultations and reviews</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/history">
              <History className="w-4 h-4 mr-2" />
              View History
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Consultations</p>
                  <p className="text-2xl font-bold">{consultations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedConsultations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingConsultations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{formatFee(totalSpent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="consultations">My Consultations</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="consultations" className="space-y-6">
            {consultations.length > 0 ? (
              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <Card key={consultation.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={consultation.lawyers?.profile_image || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(consultation.lawyers?.full_name || "Lawyer")}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{consultation.lawyers?.full_name}</h3>
                              {getStatusBadge(consultation.status)}
                            </div>
                            
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>Subject: {consultation.subject}</span>
                              </div>
                              
                              {consultation.preferred_date && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {formatDate(consultation.preferred_date)}
                                    {consultation.preferred_time && ` at ${formatTime(consultation.preferred_time)}`}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                {getConsultationTypeIcon(consultation.consultation_type)}
                                <span className="capitalize">{consultation.consultation_type} consultation</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{consultation.lawyers?.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600 mb-2">
                            {formatFee(consultation.lawyers?.consultation_fee || 0)}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/lawyers/${consultation.lawyers?.id}`}>
                                View Profile
                              </Link>
                            </Button>
                            
                            {consultation.status === "completed" && (
                              <Button size="sm" asChild>
                                <Link href={`/lawyers/${consultation.lawyers?.id}`}>
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  Chat
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {consultation.description && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">{consultation.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No consultations yet</h3>
                  <p className="text-muted-foreground mb-6">Start by booking a consultation with a lawyer</p>
                  <Button asChild>
                    <Link href="/lawyers">
                      Find Lawyers
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(review.lawyers?.full_name || "Lawyer")}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{review.lawyers?.full_name}</h3>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-2">{review.review_text}</p>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(review.created_at)}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/lawyers/${review.lawyers?.id}`}>
                            View Lawyer
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-6">Review lawyers after completing consultations</p>
                  <Button asChild>
                    <Link href="/lawyers">
                      Find Lawyers
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
