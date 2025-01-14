import React, { useEffect, useState } from 'react'
import DashboardStatsGrid from '../components/DashboardStatsGrid'
import TransactionChart from '../components/TransactionChart'
import RecentOrders from '../components/RecentOrders'
import BuyerProfilePieChart from '../components/BuyerProfilePieChart'
import PopularProducts from '../components/PopularProducts'
import api from '../api'

export default function Dashboard() {

	const [totalHotspotClients, setTotalHotspotClients] = useState(0)
	const [recentClients, setRecentClients] = useState([])
	const [remainingCredits, setRemainingCredits] = useState(0)
	const [totalPPPoeClients, setTotalPPPoeClients] = useState(0)
	const [totalStaticClients, setTotalStaticClients] = useState(0)
	const [suspendedPPPoeClients, setSuspendedPPPoeClients] = useState(0)
	const [suspendedStaticClients, setSuspendedStaticClients] = useState(0)
	const [totalHotspotIncome, setTotalHotspotIncome] = useState(0)
	const [userCount, setUserCount] = useState([])

	useEffect(() => {
		fetchSMSRemainingCredits()
	}, [])


	const fetchSMSRemainingCredits = async () => {
		try {
			const response = await api.get("api/dashboard/")
			setTotalStaticClients(response.data["total_dhcp_clients"])
			setTotalPPPoeClients(response.data["total_ppp_clients"])
			setSuspendedStaticClients(response.data["suspended_dhcp_clients"])
			setSuspendedPPPoeClients(response.data["suspended_ppp_clients"])
			setTotalHotspotClients(response.data["total_hotspot_clients"])
			setTotalHotspotIncome(response.data["total_hotspot_income"])
			setRecentClients(response.data["recent_clients"])
			setRemainingCredits(response.data["sms_balance"])
			setUserCount(response.data["user_count"].reverse())
		} catch (error) {
			console.error(error)
		}
	}
	return (
		<div className="flex flex-col gap-4">
			<DashboardStatsGrid totalPPPoeClients={totalPPPoeClients} totalStaticClients={totalStaticClients} totalHotspotIncome={totalHotspotIncome} suspendedPPPoeClients={suspendedPPPoeClients} suspendedStaticClients={suspendedStaticClients} remainingCredits={remainingCredits}/>
			<div className="flex flex-row gap-4 w-full">
				<TransactionChart data={userCount}/>
				<BuyerProfilePieChart totalHotspotClients={totalHotspotClients} totalStaticClients={totalStaticClients} totalPPPoeClients={totalPPPoeClients}/>
			</div>
			<div className="flex flex-row gap-4 w-full">
				<RecentOrders recentClients={recentClients} />
				<PopularProducts />
			</div>
		</div>
	)
}
