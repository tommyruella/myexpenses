"use client";
import React from "react";
import { useRouter } from "next/navigation";

const menuItems = [
	{
		href: "/",
		label: "Home",
		icon: (
			<svg
				width="28"
				height="28"
				fill="none"
				stroke="#181818"
				strokeWidth="2.2"
				viewBox="0 0 24 24"
			>
				<path d="M3 12L12 4l9 8" />
				<path d="M5 10v10a1 1 0 0 0 1 1h4m4 0h4a1 1 0 0 0 1-1V10" />
				<path d="M9 21V14h6v7" />
			</svg>
		),
	},
	{
		href: "/dashboard/pages/spese",
		label: "Spese",
		icon: (
			<span className="floatingmenu-euro" style={{fontSize: 28, fontWeight: 600, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				€
			</span>
		),
	},
	{
		href: null,
		label: "Aggiungi",
		icon: (
			<svg
				width="36"
				height="36"
				fill="none"
				stroke="#181818"
				strokeWidth="2.6"
				viewBox="0 0 24 24"
			>
				<path d="M12 6v12M6 12h12" />
			</svg>
		),
		onClick: true,
	},
];

const sharedBtnStyle = {
	background: 'none',
	border: 'none',
	padding: 0,
	paddingLeft: 8,
	paddingRight: 8,
	margin: 0,
	cursor: 'pointer',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minWidth: 0
};

export default function FloatingMenu({ onAddClick }: { onAddClick?: () => void }) {
	const router = useRouter();
	// Ordine: Home, +, Spese
	const items = [menuItems[0], menuItems[2], menuItems[1]];

	return (
		<div className="floatingmenu-container">
			<nav className="floatingmenu-root open">
				{items.map((item) =>
					item.onClick ? (
						<button
							key={item.label}
							className="floatingmenu-link"
							aria-label="Aggiungi nuova spesa o entrata"
							onClick={onAddClick}
							type="button"
							style={sharedBtnStyle}
						>
							{item.icon}
						</button>
					) : (
						item.href ? (
							<button
								key={item.href}
								className="floatingmenu-link"
								style={sharedBtnStyle}
								aria-label={item.label}
								onClick={() => router.push(item.href!)}
								type="button"
							>
								{item.icon}
							</button>
						) : null
					)
				)}
			</nav>
		</div>
	);
}
