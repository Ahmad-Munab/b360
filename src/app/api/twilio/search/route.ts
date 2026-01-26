import { NextResponse } from "next/server";
import { twilioClient } from "@/lib/twilio";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { areaCode, countryCode = "US" } = await req.json();

        const availableNumbers = await twilioClient.availablePhoneNumbers(countryCode)
            .local
            .list({
                areaCode: areaCode || undefined,
                limit: 10,
            });

        const numbers = availableNumbers.map((n) => ({
            phoneNumber: n.phoneNumber,
            friendlyName: n.friendlyName,
            isoCountry: n.isoCountry,
            locality: n.locality,
            region: n.region,
        }));

        return NextResponse.json(numbers);
    } catch (error) {
        console.error("[TWILIO_SEARCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
