"use client"

import { useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Home, ShoppingBag, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PRODUCT_MAP = {
  [process.env.NEXT_PUBLIC_CREEM_PRODUCT_BASIC || ""]: "Basic",
  [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO || ""]: "Pro",
  [process.env.NEXT_PUBLIC_CREEM_PRODUCT_TEAM || ""]: "Team",
} as Record<string, string>

export default function PricingSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const checkoutId = searchParams.get("checkout_id") || ""
  const orderId = searchParams.get("order_id") || ""
  const customerId = searchParams.get("customer_id") || ""
  const productId = searchParams.get("product_id") || ""

  const planName = useMemo(() => {
    if (PRODUCT_MAP[productId]) return PRODUCT_MAP[productId]
    if (productId) return `Product ${productId}`
    return "Your plan"
  }, [productId])

  const hasParams = !!checkoutId || !!orderId || !!productId

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold">RightHair AI</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push("/pricing")}>
              Pricing
            </Button>
            <Button size="sm" onClick={() => router.push("/")}>
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="p-8 shadow-lg bg-white">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Payment successful</h1>
            <p className="text-muted-foreground">
              Thank you! Your purchase is confirmed. Below are the details of your order.
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Card className="p-4 bg-purple-50 border-purple-100">
              <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Plan</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{planName}</div>
              {productId && (
                <p className="text-xs text-muted-foreground mt-1 break-all">Product ID: {productId}</p>
              )}
            </Card>

            <div className="space-y-2 text-sm text-gray-700">
              {orderId ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-medium break-all text-right">{orderId}</span>
                </div>
              ) : null}
              {checkoutId ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Checkout ID</span>
                  <span className="font-medium break-all text-right">{checkoutId}</span>
                </div>
              ) : null}
              {customerId ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer ID</span>
                  <span className="font-medium break-all text-right">{customerId}</span>
                </div>
              ) : null}
            </div>
          </div>

          {!hasParams && (
            <p className="mt-6 text-sm text-amber-600">
              We couldn’t read the checkout details from the URL. If you completed a purchase, please check your email
              receipt or contact support.
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => router.push("/")}>
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
            <Button variant="outline" onClick={() => router.push("/pricing")}>
              View Pricing
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}

