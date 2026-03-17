import type { Metadata } from "next";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin", "vietnamese"],
	display: "swap",
});

const montserratAlternates = Montserrat_Alternates({
	variable: "--font-montserrat-alt",
	subsets: ["latin", "vietnamese"],
	weight: ["400", "500", "700"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "SAA 2025 – Sun Annual Awards",
	description: "Sun Annual Awards 2025",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className={`${montserrat.variable} ${montserratAlternates.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
