"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Clock, Award, Phone, Mail, Calendar, MessageCircle, Scale, User, IndianRupee, Video, CreditCard } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface LawyerProfileProps {
  lawyer: any
  reviews: any[]
  user: any
}

export default function LawyerProfile({ lawyer, reviews, user }: LawyerProfileProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isStartingChat, setIsStartingChat] = useState(false)
  const router = useRouter()

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const startChat = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsStartingChat(true)
    try {
      const response = await fetch("/api/chat/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lawyerId: lawyer.id }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/chat/${data.conversationId}`)
      } else {
        alert("Failed to start chat. Please try again.")
      }
    } catch (error) {
      console.log("[v0] Error starting chat:", error)
      alert("Failed to start chat. Please try again.")
    } finally {
      setIsStartingChat(false)
    }
  }

  const consultationTypes = [
    {
      type: "online",
      label: "Video Call",
      icon: Video,
      price: lawyer.consultation_fee,
      description: "Meet via video call"
    },
    {
      type: "phone",
      label: "Phone Call",
      icon: Phone,
      price: Math.round(lawyer.consultation_fee * 0.8),
      description: "Traditional phone consultation"
    },
    {
      type: "in-person",
      label: "In-Person",
      icon: MapPin,
      price: Math.round(lawyer.consultation_fee * 1.2),
      description: "Meet at lawyer's office"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={lawyer.profile_image || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {getInitials(lawyer.full_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{lawyer.full_name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {lawyer.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {lawyer.experience_years} years experience
                      </div>
                      {lawyer.is_verified && (
                        <Badge variant="secondary">
                          <Award className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(Math.floor(lawyer.rating))}
                        <span className="font-medium ml-1">{lawyer.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({lawyer.total_reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatFee(lawyer.consultation_fee)}
                      <span className="text-sm text-muted-foreground font-normal">/consultation</span>
                    </div>
                    {user && (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={startChat} disabled={isStartingChat}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {isStartingChat ? "Starting..." : "Start Chat"}
                        </Button>
                        <Button asChild>
                          <Link href={`/lawyers/${lawyer.id}/consult`}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Consultation
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{lawyer.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {lawyer.lawyer_specialization_mapping.map((mapping: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {mapping.lawyer_specializations.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Consultation Pricing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Consultation Pricing
            </CardTitle>
            <CardDescription>Choose your preferred consultation type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {consultationTypes.map((type) => (
                <div key={type.type} className="p-4 border rounded-lg hover:border-primary transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <type.icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                  <div className="flex items-center gap-1 text-lg font-bold text-green-600 mb-3">
                    <IndianRupee className="h-4 w-4" />
                    {formatFee(type.price)}
                  </div>
                  {user && (
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/lawyers/${lawyer.id}/consult`}>
                        Book {type.label}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specializations">Specializations</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({lawyer.total_reviews})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{lawyer.bio}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Practice Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {lawyer.practice_areas.map((area: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <Scale className="h-4 w-4 text-primary" />
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{lawyer.email}</span>
                    </div>
                    {lawyer.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{lawyer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{lawyer.location}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Bar Council Number</p>
                      <p className="text-sm text-muted-foreground">{lawyer.bar_council_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{lawyer.experience_years} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Languages</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lawyer.languages.map((lang: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specializations">
            <Card>
              <CardHeader>
                <CardTitle>Areas of Expertise</CardTitle>
                <CardDescription>Detailed information about legal specializations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lawyer.lawyer_specialization_mapping.map((mapping: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{mapping.lawyer_specializations.name}</h3>
                      <p className="text-sm text-muted-foreground">{mapping.lawyer_specializations.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>What clients say about this lawyer</CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.user_profiles?.full_name || "Anonymous"}</span>
                              <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                              <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                            </div>
                            {review.review_text && <p className="text-muted-foreground">{review.review_text}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground">Be the first to review this lawyer</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
