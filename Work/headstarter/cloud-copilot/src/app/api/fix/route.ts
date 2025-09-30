import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"
import { SYSTEM_PROMPTS, USER_PROMPTS } from "@/lib/prompts"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { recommendationId, scanId } = body

    if (!recommendationId || !scanId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get the recommendation and scan
    const recommendation = await prisma.recommendation.findFirst({
      where: {
        id: recommendationId,
        scan: {
          userId: user.id
        }
      },
      include: {
        scan: true
      }
    })

    if (!recommendation) {
      return NextResponse.json({ error: "Recommendation not found" }, { status: 404 })
    }

    const scan = recommendation.scan

    try {
      // Call OpenAI for Terraform generation
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPTS.TERRAFORM_GENERATION
          },
          {
            role: "user",
            content: USER_PROMPTS.GENERATE_TERRAFORM(recommendation, scan.cloudProvider)
          }
        ],
        temperature: 0.2,
        max_tokens: 3000
      })

      const terraformResult = completion.choices[0]?.message?.content
      
      if (!terraformResult) {
        throw new Error("No Terraform code generated")
      }

      let terraformData
      try {
        terraformData = JSON.parse(terraformResult)
      } catch (parseError) {
        // If JSON parsing fails, create a structured response
        terraformData = {
          terraform_code: terraformResult,
          variables: [],
          outputs: [],
          dependencies: [],
          implementation_notes: "Generated Terraform code",
          estimated_cost_impact: "Not specified"
        }
      }

      // Update recommendation with Terraform code
      await prisma.recommendation.update({
        where: { id: recommendationId },
        data: {
          terraform: terraformData.terraform_code
        }
      })

      return NextResponse.json({
        success: true,
        recommendationId: recommendationId,
        terraform: terraformData
      })

    } catch (aiError) {
      console.error("Terraform generation error:", aiError)
      
      return NextResponse.json({
        success: false,
        error: "Terraform generation failed",
        details: aiError instanceof Error ? aiError.message : "Unknown error"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Fix generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
