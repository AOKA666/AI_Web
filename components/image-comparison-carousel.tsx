"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComparisonImage {
  before: string
  after: string
  beforeLabel: string
  afterLabel: string
}

const comparisonImages: ComparisonImage[] = [
  {
    before: "/images/1.jpeg",
    after: "/images/1-old.jpeg",
    beforeLabel: "Original (45 years)",
    afterLabel: "Aged (65 years)",
  },
  {
    before: "/images/2.jpeg",
    after: "/images/2-young.jpeg",
    beforeLabel: "Original (25 years)",
    afterLabel: "Younger (12 years)",
  },
]

export default function ImageComparisonCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentImage = comparisonImages[currentIndex]

  useEffect(() => {
    if (isPaused) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % comparisonImages.length)
      setSliderPosition(50)
    }, 3000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % comparisonImages.length)
    setSliderPosition(50)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + comparisonImages.length) % comparisonImages.length)
    setSliderPosition(50)
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  return (
    <div
      className="w-full max-w-4xl mx-auto space-y-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        {/* Image Comparison Container */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 cursor-ew-resize select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* After Image (Background) */}
          <div className="absolute inset-0">
            <img
              src={currentImage.after || "/placeholder.svg"}
              alt={currentImage.afterLabel}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {currentImage.afterLabel}
            </div>
          </div>

          {/* Before Image (Overlay with clip) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={currentImage.before || "/placeholder.svg"}
              alt={currentImage.beforeLabel}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {currentImage.beforeLabel}
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="flex gap-1">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white"
          onClick={handlePrevious}
          disabled={comparisonImages.length <= 1}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white"
          onClick={handleNext}
          disabled={comparisonImages.length <= 1}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2">
        {comparisonImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setSliderPosition(50)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-purple-600 w-8" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to comparison ${index + 1}`}
          />
        ))}
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-muted-foreground">
        Drag the slider or click and move to compare before and after
      </p>
    </div>
  )
}
