"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BadgeCheck, Check, CreditCard, Shield, Sparkles, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreemCheckoutButton } from "@/components/creem-checkout-button"

type BillingCycle = "monthly" | "yearly"

const basicProductId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_BASIC || ""
const proProductId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO || ""
const teamProductId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_TEAM || ""

interface User {
  email?: string
  id?: string
}

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly")
   const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      const data = await res.json()
      if (data?.success) {
        setUser(null)
        window.location.replace("/")
      }
    } catch {
      // ignore
    }
  }

  const plans = useMemo(
    () => [
      {
        id: "basic",
        name: "Basic",
        badge: "Best for starters",
        price: { monthly: "$9.9", yearly: "$7.9" },
        description: "For individuals who need reliable, watermark-free outputs.",
        features: [
          "Up to 50 generations per day",
          "JPG / PNG / WebP uploads",
          "HD download (no watermark)",
          "Standard email support",
        ],
        productId: basicProductId,
      },
      {
        id: "pro",
        name: "Pro",
        badge: "Most popular",
        highlight: true,
        price: { monthly: "$49.9", yearly: "$39.9" },
        description: "Unlimited, watermark-free, fast lane for creators.",
        features: [
          "Unlimited generations & downloads",
          "HD/original quality, no watermark",
          "Age, gender and style presets",
          "Priority queue, ~3s average",
          "Commercial license & priority support",
        ],
        productId: proProductId,
      },
      {
        id: "team",
        name: "Team",
        badge: "Includes support",
        price: { monthly: "$99.9", yearly: "$79.9" },
        description: "For studios and brands needing seats and API access.",
        features: [
          "5 seats (expandable)",
          "Custom styles & branding",
          "Webhook & API access",
          "Dedicated technical support",
          "Invoicing & compliance help",
        ],
        productId: teamProductId,
      },
    ],
    [],
  )

  const renderPrice = (planId: string, price: Record<BillingCycle, string>) => {
    const value = price[billing]
    const suffix = billing === "monthly" ? "/mo" : "/mo (billed yearly)"
    return (
      <div className="flex items-end gap-1 text-4xl font-bold tracking-tight">
        <span>{value}</span>
        <span className="text-base text-muted-foreground mb-1">{suffix}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold">RightHair AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/pricing" className="text-purple-600">
              Pricing
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hover:text-purple-600 transition-colors">
                Login / Sign up
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 lg:py-20">
        <section className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
            <BadgeCheck className="h-4 w-4" />
            No credit card required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Clear pricing for AI age transformations
          </h1>
          <p className="text-lg text-muted-foreground">
            A simple, flexible pricing similar to imgeditor.co/pricing, for individuals to teams.
          </p>

          <div className="inline-flex items-center gap-2 p-1 rounded-full bg-white shadow-lg shadow-purple-100 border border-purple-100">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                billing === "monthly" ? "bg-purple-600 text-white shadow" : "text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                billing === "yearly" ? "bg-purple-600 text-white shadow" : "text-gray-700"
              }`}
            >
              Yearly (save 20%)
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isMissingProduct = !plan.productId && plan.id !== "free"
            return (
              <Card
                key={plan.id}
                className={`relative h-full p-6 flex flex-col gap-6 border ${
                  plan.highlight
                    ? "border-purple-500 shadow-xl shadow-purple-100 bg-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    {plan.highlight && <Shield className="h-4 w-4 text-purple-600" />}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
                  {renderPrice(plan.id, plan.price as Record<BillingCycle, string>)}
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {plan.cta ? (
                    plan.cta
                  ) : (
                    <CreemCheckoutButton
                      productId={plan.productId || ""}
                      label={isMissingProduct ? "Set product ID first" : "Subscribe now"}
                      disabled={isMissingProduct}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    />
                  )}
                  {isMissingProduct && (
                    <p className="text-xs text-amber-600 mt-2">
                      Set NEXT_PUBLIC_CREEM_PRODUCT_BASIC / NEXT_PUBLIC_CREEM_PRODUCT_PRO / NEXT_PUBLIC_CREEM_PRODUCT_TEAM in .env.local
                    </p>
                  )}
                </div>
              </Card>
            )
          })}
        </section>

        <section className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Fast checkout",
              icon: <CreditCard className="h-5 w-5 text-purple-600" />,
              desc: "Creem Checkout redirects in seconds with minimal integration.",
            },
            {
              title: "Secure & compliant",
              icon: <Shield className="h-5 w-5 text-green-600" />,
              desc: "PCI-aligned payments with webhook signature verification.",
            },
            {
              title: "Flexible plans",
              icon: <Zap className="h-5 w-5 text-blue-600" />,
              desc: "Scale seats, generations, and API access as you grow.",
            },
          ].map((item) => (
            <Card key={item.title} className="p-5 bg-white/80 backdrop-blur">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </section>

        <section className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-wide font-semibold">Creem checkout ready</p>
                <h2 className="text-3xl font-bold leading-tight">
                  Create checkout sessions in minutes
                </h2>
                <p className="text-white/80">
                  We wrapped /api/checkout already: pass a productId and jump to Creem. Switch between test-api and production via env.
                </p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span>POST /api/checkout → Creem /v1/checkouts</span>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/10 p-4 font-mono text-xs space-y-2">
                  <div className="text-white/80">Request</div>
                  <pre className="whitespace-pre-wrap text-white/90">
{`{
  "productId": "prod_xxx",
  "successUrl": "https://your.site/success"
}`}
                  </pre>
                  <div className="text-white/80">Response</div>
                  <pre className="whitespace-pre-wrap text-white/90">
{`{
  "url": "https://checkout.creem.io/..."
}`}
                  </pre>
                </div>
                <p className="text-white/80">
                  Set CREEM_API_KEY in .env.local (optional CREEM_API_BASE=https://test-api.creem.io).
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  )
}
