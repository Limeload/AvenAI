import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const scan = await prisma.scan.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        issues: {
          orderBy: { severity: 'desc' }
        },
        recommendations: {
          orderBy: { priority: 'desc' }
        }
      }
    })

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    return NextResponse.json({ scan })
  } catch (error) {
    console.error("Error fetching scan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const scan = await prisma.scan.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Delete scan and all related data (cascade delete)
    await prisma.scan.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Scan deleted successfully" })
  } catch (error) {
    console.error("Error deleting scan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
