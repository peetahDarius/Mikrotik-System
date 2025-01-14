import React from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'


export default function RecentOrders({recentClients}) {
	const navigate = useNavigate()
	return (
		<div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
			<strong className="text-gray-700 font-medium">Recent clients</strong>
			<div className="border-x border-gray-200 rounded-sm mt-3">
				<table className="w-full text-gray-700">
					<thead>
						<tr>
							<th>ID</th>
							<th>Product ID</th>
							<th>Phone</th>
							<th>Creation Date</th>
							<th>Service Type</th>
							<th>Username/Ip Address</th>
							<th>Apartment</th>
						</tr>
					</thead>
					<tbody>
						{recentClients.map((client, index) => (
							<tr key={index}>
								<td>
									<h1 className="cursor-pointer text-sky-600 hover:text-blue-600" onClick={() => navigate("/client", { state: { clientID: client.client_id },}) } >#{client.custom_id}</h1>
								</td>
								<td>
									{client.names}
								</td>
								<td>
									{client.phone_number}
								</td>
								<td>{format(new Date(client.created_at), 'dd MMM yyyy')}</td>
								<td>{client.service_type === "Static" ?
									<span className="capitalize py-1 px-2 rounded-md text-xs text-yellow-600 bg-sky-100">
									Static
								</span> :
									<span className="capitalize py-1 px-2 rounded-md text-xs text-orange-600 bg-sky-100">
									PPPoE
								</span>
									}</td>
								<td>{client.detail}</td>
								<td>{client.apartment}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
