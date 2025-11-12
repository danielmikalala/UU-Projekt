import React from 'react'
import { Link } from 'react-router-dom'
import PrimaryButton from './buttons/PrimaryButton'
import { GearIcon, CollectionIcon, PlusIcon, LogoutIcon } from './buttons/icons'

export default function Navigation() {
	const handleLogout = () => {
	}

	const handleCreateCampaign = () => {
	}

	return (
		<nav className="top-0 left-0 right-0 w-full border-b border-gray-200 bg-white">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
				<div className="text-xl font-extrabold">
					<Link to="/" className="text-gray-900 no-underline">CrowdFund</Link>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-500 mr-1">username</span>
					<Link to="/admin" className="no-underline">
						<PrimaryButton icon={<GearIcon />}>Admin</PrimaryButton>
					</Link>
					<Link to="/managed" className="no-underline">
						<PrimaryButton icon={<CollectionIcon />}>My Campaigns</PrimaryButton>
					</Link>
					<PrimaryButton onClick={handleCreateCampaign} icon={<PlusIcon />}>Create</PrimaryButton>
					<PrimaryButton onClick={handleLogout} aria-label="Logout" icon={<LogoutIcon />}>Logout</PrimaryButton>
				</div>
			</div>
		</nav>
	)
}


