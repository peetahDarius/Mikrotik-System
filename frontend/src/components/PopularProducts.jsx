import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api';
import WifiImage from '../img/wifi.png'

function PopularProducts() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(null)
	useEffect(() => {
		fetchHotspotPackage();
	  }, []);
	
	  const fetchHotspotPackage = async () => {
		setLoading(true)
		try {
		  const response = await api.get("/api/hotspot/packages/");
		  setProducts(response.data.reverse());
		} catch (error) {
		} finally {
		  setLoading(false)
		}
	  };
	
	return !loading && (
		<div className="w-[20rem] bg-white p-4 rounded-sm border border-gray-200">
			<strong className="text-gray-700 font-medium">Hotspot Packages</strong>
			<div className="mt-4 flex flex-col gap-3">
				{products.map((product) => (
					<Link
						key={product.id}
						to={`/packages`}
						className="flex items-start hover:no-underline"
					>
						<div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm">
							<img
								className="w-full h-full object-cover rounded-sm"
								src={WifiImage}
								alt={product.product_name}
							/>
						</div>
						<div className="ml-4 flex-1">
							<p className="text-sm text-gray-800">{product.name} @ ksh {product.amount}</p>
							<span
								className={classNames(
									product.byte_quota
										? 'text-green-500'
										: 'text-orange-500',
									'text-xs font-medium'
								)}
							>
								{product.byte_quota ? 'Unlimited' :  'Limited'}
							</span>
						</div>
						<div className="text-xs text-gray-400 pl-1.5">{product.product_price}</div>
					</Link>
				))}
			</div>
		</div>
	)
}

export default PopularProducts
