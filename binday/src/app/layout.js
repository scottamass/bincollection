import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Binday",
  description: "Find you next collecton",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
    

        {children}
      
        </body>
    </html>
  );
}
