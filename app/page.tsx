"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Upload, Sparkles, Shield, Zap, TrendingUp, Download, ImageIcon, ChevronRight } from "lucide-react"
import ImageComparisonCarousel from "@/components/image-comparison-carousel"
import Link from "next/link"

interface User {
  email?: string
  id?: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedAge, setSelectedAge] = useState<string>("20")
  const [selectedGender, setSelectedGender] = useState<string>("male")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Fetch user status on mount
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(err => console.error('Failed to fetch user:', err))
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setResultUrl(null)
        setErrorMessage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setErrorMessage("请先上传图片")
      return
    }
    setIsGenerating(true)
    setErrorMessage(null)
    setResultUrl(null)
    try {
      // 直接发送 base64 给 ARK API，不需要先上传到本地
      const res = await fetch("/api/age-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadedImage, age: selectedAge }),
      })
      const data = await res.json()
      if (!res.ok) {
        const errorMsg = data?.error || "生成失败"
        const detailMsg = data?.detail || ""
        console.error("API Error:", data)
        throw new Error(`${errorMsg}${detailMsg ? `: ${detailMsg}` : ''}`)
      }
      setResultUrl(data?.url || null)
    } catch (err: any) {
      setErrorMessage(err?.message || "生成失败")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        setUser(null)
        // 清除后，跳转到主页
        window.location.href = '/'
      } else {
        console.error('Logout failed:', data.error)
      }
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }


  const handleDownload = async () => {
    if (!resultUrl) return
    try {
      const res = await fetch(resultUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `age-filter-${selectedAge}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    }
  }

  const ageOptions = [
    { value: "8", label: "Child", description: "" },
    { value: "20", label: "Adult", description: "Smooth skin\nDefined features" },
    { value: "60", label: "Middle Age", description: "" },
    { value: "80", label: "Elderly", description: "" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold">RightHair AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Home
            </Link>
            <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Tools
            </a>
            <a href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
              About
            </a>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        {/* Top Row: Title and Demo Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left: Title and Description */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              See Yourself at{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Any Age
              </span>{" "}
              in Seconds
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Upload a selfie and discover how you looked in the past or will look in the future with AI
            </p>
          </div>

          {/* Right: Image Comparison Carousel */}
          <div className="lg:pl-8">
            <ImageComparisonCarousel />
          </div>
        </div>

        {/* Bottom Row: Upload and Settings Card - Centered */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 bg-white shadow-lg">
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 bg-purple-50/50 hover:bg-purple-50 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  {uploadedImage ? (
                    <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded" className="max-h-48 rounded-lg" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-purple-400" />
                      <div className="text-center">
                        <p className="text-base font-semibold mb-1">Drag and drop your image here or click to select</p>
                        <p className="text-sm text-muted-foreground">Supports JPG, JPEG, PNG or WebP (20MB)</p>
                        <p className="text-xs text-purple-600 mt-2">( 2 Times Limit Per Day )</p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {/* Age Selection */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Select Target Age</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ageOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedAge(option.value)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        selectedAge === option.value
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="font-bold text-xl">{option.value}</div>
                      <div className="font-semibold text-xs">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Select Target Gender</h3>
                <RadioGroup value={selectedGender} onValueChange={setSelectedGender} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer text-sm">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer text-sm">
                      Female
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                className="w-full h-11 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleGenerate}
                disabled={!uploadedImage || isGenerating}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate AI Age Filter"}
              </Button>
              {errorMessage && (
                <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
              )}
              {resultUrl && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-sm">Preview</h4>
                  <img src={resultUrl} alt="Generated" className="rounded-lg max-h-64" />
                  <div className="flex gap-3">
                    <Button variant="default" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" /> Download Result
                    </Button>
                    <a
                      href={resultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-700 hover:underline"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How to Use AI Age Filter for Free</h2>
          <p className="text-center text-muted-foreground mb-12">Get professional results in just three simple steps</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Upload</h3>
              <p className="text-muted-foreground">
                Drag and drop your image or click to take a photo from your device. We support most major image formats.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Choose Gender & Age</h3>
              <p className="text-muted-foreground">
                Pick a gender and age period, click generate, and see your new age progression instantly.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Preview & Download</h3>
              <p className="text-muted-foreground">
                Preview your new age progression. If you like the result, download your AI-generated look and share it
                anywhere.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose RightHair Free AI Age Filter?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Experience the most advanced AI age progression technology with unmatched accuracy and privacy protection.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">100% Privacy Protected</h3>
              <p className="text-muted-foreground">
                Your photos are processed locally in your browser and never stored on our servers. Complete privacy
                guaranteed.
              </p>
            </Card>

            <Card className="p-6">
              <Zap className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Lightning Fast Results</h3>
              <p className="text-muted-foreground">
                Get your age progression results in under 3 seconds with our optimized AI models and advanced
                processing.
              </p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Scientific Accuracy</h3>
              <p className="text-muted-foreground">
                95% accuracy rate using scientifically-verified aging patterns and advanced Stable Diffusion models.
              </p>
            </Card>

            <Card className="p-6">
              <Download className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Completely Free</h3>
              <p className="text-muted-foreground">
                No hidden fees, no subscriptions, no watermarks. Unlimited age progressions with full download rights.
              </p>
            </Card>

            <Card className="p-6">
              <ImageIcon className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Multiple Age Options</h3>
              <p className="text-muted-foreground">
                See yourself at any age from childhood to elderly with realistic aging effects and natural transitions.
              </p>
            </Card>

            <Card className="p-6">
              <ChevronRight className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">HD Quality Downloads</h3>
              <p className="text-muted-foreground">
                Download your results in high-definition PNG or animated GIF format, perfect for sharing or keeping.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Example Gallery */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Amazing Transformations</h2>
          <p className="text-center text-muted-foreground mb-12">See the incredible results our AI can achieve</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <img
                    src={`/person-age-transformation-example-.jpg?height=400&width=400&query=person age transformation example ${i}`}
                    alt={`Age transformation example ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original: 25 years</span>
                    <span className="font-semibold text-purple-600">→ {20 + i * 10} years</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-12">Everything you need to know about AI Age Filter</p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">How does the AI Age Filter work?</AccordionTrigger>
              <AccordionContent>
                Our AI Age Filter uses advanced machine learning models trained on thousands of facial aging patterns.
                It analyzes your photo to identify key facial features and applies scientifically-verified aging
                algorithms to show you how you'll look at different ages.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">Is my photo safe and private?</AccordionTrigger>
              <AccordionContent>
                Yes! Your privacy is our top priority. All photos are processed locally in your browser and are never
                uploaded to our servers. We don't store, share, or use your photos for any purpose. Your data stays
                completely private and secure.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">How accurate are the age progression results?</AccordionTrigger>
              <AccordionContent>
                Our AI model has a 95% accuracy rate based on scientifically-verified aging patterns. The results are
                highly realistic and take into account factors like skin texture, wrinkles, facial structure changes,
                and other age-related features. However, actual aging can vary based on genetics, lifestyle, and other
                factors.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">Is the AI Age Filter really free?</AccordionTrigger>
              <AccordionContent>
                Yes, absolutely! Our AI Age Filter is completely free to use with no hidden fees or subscriptions. You
                can generate age progressions up to 2 times per day without any watermarks. All downloads are included
                at no cost.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">What image formats are supported?</AccordionTrigger>
              <AccordionContent>
                We support all major image formats including JPG, JPEG, PNG, and WebP. Images can be up to 20MB in size.
                For best results, use a clear, front-facing photo with good lighting.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">Can I download and share my results?</AccordionTrigger>
              <AccordionContent>
                Yes! You can download your age-progressed photos in high-definition PNG format or as animated GIFs. Feel
                free to share them on social media or keep them for personal use. There are no watermarks or
                restrictions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Popular AI Tools Section */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Explore Popular & Hot AI Tools</h2>
          <p className="text-center text-muted-foreground mb-12">
            Discover more amazing AI-powered tools to enhance your photos
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "AI Hair Color", icon: "💇", color: "from-pink-500 to-rose-500" },
              { name: "AI Face Swap", icon: "🔄", color: "from-blue-500 to-cyan-500" },
              { name: "AI Photo Enhancer", icon: "✨", color: "from-purple-500 to-indigo-500" },
              { name: "AI Background Remove", icon: "🖼️", color: "from-green-500 to-emerald-500" },
              { name: "AI Portrait Generator", icon: "🎨", color: "from-orange-500 to-amber-500" },
              { name: "AI Style Transfer", icon: "🎭", color: "from-violet-500 to-purple-500" },
              { name: "AI Photo Restoration", icon: "🔧", color: "from-teal-500 to-cyan-500" },
              { name: "AI Anime Filter", icon: "🎌", color: "from-red-500 to-pink-500" },
            ].map((tool, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <span className="text-3xl">{tool.icon}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">Transform your photos with AI</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold">RightHair AI</span>
              </div>
              <p className="text-sm">Transform your look with cutting-edge AI technology.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Age Filter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Hair Color
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Face Swap
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Photo Enhancer
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 RightHair AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
