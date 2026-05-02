"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Clock, IndianRupee, Filter, Users, Award, MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface LawyerDirectoryProps {
  lawyers: any[]
  specializations: any[]
  user: any
}

export default function LawyerDirectory({ lawyers, specializations, user }: LawyerDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  // Debug logging
  console.log("LawyerDirectory props:", { lawyers, specializations, user })

  // Helper function to get lawyer name (handles both 'name' and 'full_name' columns)
  const getLawyerName = (lawyer: any) => {
    return lawyer.full_name || lawyer.name || "Unknown Lawyer"
  }

  // Get unique locations
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(lawyers.map((lawyer) => lawyer.location).filter(Boolean))]
    return uniqueLocations.sort()
  }, [lawyers])

  // Filter and sort lawyers
  const filteredLawyers = useMemo(() => {
    const filtered = lawyers.filter((lawyer) => {
      const lawyerName = getLawyerName(lawyer)
      
      const matchesSearch =
        lawyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lawyer.bio && lawyer.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lawyer.practice_areas && lawyer.practice_areas.some((area: string) => area.toLowerCase().includes(searchQuery.toLowerCase())))

      const matchesSpecialization =
        selectedSpecialization === "all" ||
        (lawyer.lawyer_specialization_mapping && lawyer.lawyer_specialization_mapping.some(
          (mapping: any) => mapping.lawyer_specializations.name === selectedSpecialization,
        )) ||
        (lawyer.specialization && lawyer.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase()))

      const matchesLocation = selectedLocation === "all" || lawyer.location === selectedLocation

      return matchesSearch && matchesSpecialization && matchesLocation
    })

    // Sort lawyers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "experience":
          return (b.experience_years || 0) - (a.experience_years || 0)
        case "fee_low":
          return (a.consultation_fee || 0) - (b.consultation_fee || 0)
        case "fee_high":
          return (b.consultation_fee || 0) - (a.consultation_fee || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [lawyers, searchQuery, selectedSpecialization, selectedLocation, sortBy])

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Find Legal Experts</h1>
        <p className="text-xl text-muted-foreground">
          Connect with verified lawyers across India for expert legal consultation
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lawyers, specializations, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map((spec) => (
                    <SelectItem key={spec.id} value={spec.name}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="fee_low">Lowest Fee</SelectItem>
                  <SelectItem value="fee_high">Highest Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredLawyers.length} of {lawyers.length} lawyers
          </p>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters applied</span>
          </div>
        </div>

        {filteredLawyers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lawyers found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search criteria or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedSpecialization("all")
                  setSelectedLocation("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLawyers.map((lawyer, index) => {
              const lawyerName = getLawyerName(lawyer)
              return (
                <motion.div
                  key={lawyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={lawyer.profile_image || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {getInitials(lawyerName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">{lawyerName}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {lawyer.location}
                                {lawyer.is_verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Award className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{(lawyer.rating || 0).toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">({lawyer.total_reviews || 0})</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {lawyer.experience_years || 0}y exp
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{lawyer.bio || "Experienced legal professional."}</p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {lawyer.lawyer_specialization_mapping && lawyer.lawyer_specialization_mapping.slice(0, 3).map((mapping: any, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {mapping.lawyer_specializations.name}
                              </Badge>
                            ))}
                            {lawyer.specialization && !lawyer.lawyer_specialization_mapping && (
                              <Badge variant="outline" className="text-xs">
                                {lawyer.specialization}
                              </Badge>
                            )}
                            {lawyer.lawyer_specialization_mapping && lawyer.lawyer_specialization_mapping.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{lawyer.lawyer_specialization_mapping.length - 3} more
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                              <IndianRupee className="h-4 w-4" />
                              {formatFee(lawyer.consultation_fee || 0)}
                              <span className="text-sm text-muted-foreground font-normal">/consultation</span>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/lawyers/${lawyer.id}`}>
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  View Profile
                                </Link>
                              </Button>
                              {user && (
                                <Button size="sm" asChild>
                                  <Link href={`/lawyers/${lawyer.id}/consult`}>
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Consult
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
