import { IoMdWifi } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai"
import { IoWifi } from "react-icons/io5";
import { MdOutlineSignalWifi4BarLock } from "react-icons/md";

export default function DashboardStatsGrid({totalStaticClients, totalHotspotIncome, totalPPPoeClients, suspendedPPPoeClients, suspendedStaticClients, remainingCredits}) {
	return (
		<div className="flex gap-4">
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
					<IoMdWifi className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Total Static Clients</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{totalStaticClients}</strong>
						<span className="text-sm text-red-500 pl-2">-{suspendedStaticClients}</span>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
					<MdOutlineSignalWifi4BarLock className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Total PPPoE Clients</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{totalPPPoeClients}</strong>
						<span className="text-sm text-red-500 pl-2">-{suspendedPPPoeClients}</span>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
					<AiFillMessage className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Remaining SMS Credits</span>
					<div className="flex items-center">
						<strong className="text-xl ml-2 text-yellow-700 font-semibold">{remainingCredits}</strong>
						{/* <span className="text-sm text-red-500 pl-2">-30</span> */}
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
					<IoWifi className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-light">Total Hotspot Income</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{totalHotspotIncome}</strong>
						{/* <span className="text-sm text-red-500 pl-2">-43</span> */}
					</div>
				</div>
			</BoxWrapper>
		</div>
	)
}

function BoxWrapper({ children }) {
	return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
}
