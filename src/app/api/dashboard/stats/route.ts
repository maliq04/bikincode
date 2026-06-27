import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalEmployees,
      activeEmployees,
      totalDepartments,
      pendingLeaveRequests,
      pendingExpenseReports,
      recentActivities,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.department.count(),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      prisma.expenseReport.count({ where: { status: 'PENDING' } }),
      prisma.activity.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ])

    // Calculate growth rates (mock data for now)
    const employeeGrowth = '+12%'
    const departmentGrowth = '+1'
    const monthlyRevenue = 124500
    const revenueGrowth = '+8.2%'
    const growthRate = 15.3
    const growthRateChange = '+2.1%'

    const stats = {
      totalEmployees,
      activeEmployees,
      totalDepartments,
      pendingLeaveRequests,
      pendingExpenseReports,
      employeeGrowth,
      departmentGrowth,
      monthlyRevenue,
      revenueGrowth,
      growthRate,
      growthRateChange,
      recentActivities: recentActivities.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        user: activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : null,
        createdBy: `${activity.createdBy.firstName} ${activity.createdBy.lastName}`,
        createdAt: activity.createdAt,
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}