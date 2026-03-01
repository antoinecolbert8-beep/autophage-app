import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";

export const dynamic = 'force-dynamic';

console.log('🔗 AUTH_ROUTE: Initializing handler with providers:', authOptions?.providers?.length);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
