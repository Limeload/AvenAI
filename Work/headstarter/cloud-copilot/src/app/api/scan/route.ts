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
    const { cloudProvider, infraData, scanId } = body

    if (!cloudProvider || !infraData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if scan exists and belongs to user
    const scan = await prisma.scan.findFirst({
      where: {
        id: scanId,
        userId: user.id
      }
    })

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Update scan status to running
    await prisma.scan.update({
      where: { id: scanId },
      data: { status: 'RUNNING' }
    })

    try {
      // Call OpenAI for analysis
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPTS.INFRASTRUCTURE_ANALYSIS
          },
          {
            role: "user",
            content: USER_PROMPTS.ANALYZE_INFRASTRUCTURE(infraData, cloudProvider)
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })

      const analysisResult = completion.choices[0]?.message?.content
      
      if (!analysisResult) {
        throw new Error("No analysis result from OpenAI")
      }

      let analysis
      try {
        analysis = JSON.parse(analysisResult)
      } catch (parseError) {
        // If JSON parsing fails, create a structured response
        analysis = {
          summary: analysisResult,
          issues: [],
          recommendations: [],
          overall_score: {
            cost_optimization: 50,
            security: 50,
            performance: 50,
            best_practices: 50
          }
        }
      }

      // Save issues to database
      const issues = analysis.issues || []
      for (const issue of issues) {
        await prisma.issue.create({
          data: {
            scanId: scanId,
            title: issue.title,
            description: issue.description,
            severity: issue.severity || 'MEDIUM',
            category: issue.category || 'General'
          }
        })
      }

      // Save recommendations to database
      const recommendations = analysis.recommendations || []
      for (const recommendation of recommendations) {
        await prisma.recommendation.create({
          data: {
            scanId: scanId,
            title: recommendation.title,
            description: recommendation.description,
            priority: recommendation.priority || 'MEDIUM',
            category: recommendation.category || 'General'
          }
        })
      }

      // Update scan with results
      await prisma.scan.update({
        where: { id: scanId },
        data: {
          status: 'COMPLETED',
          summary: analysis.summary,
          infraData: infraData,
          completedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        scanId: scanId,
        analysis: analysis
      })

    } catch (aiError) {
      console.error("AI analysis error:", aiError)
      
      // Update scan status to failed
      await prisma.scan.update({
        where: { id: scanId },
        data: { status: 'FAILED' }
      })

      return NextResponse.json({
        success: false,
        error: "AI analysis failed",
        details: aiError instanceof Error ? aiError.message : "Unknown error"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Scan analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
