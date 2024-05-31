import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pc = searchParams.get('pc');
    const num = searchParams.get('num');

    if (!pc || !num) {
        return NextResponse.json({ error: "Missing 'pc' or 'num' query parameter" }, { status: 400 });
    }

    const response = await fetch(`https://webapps.southglos.gov.uk/Webservices/SGC.RefuseCollectionService/RefuseCollectionService.svc/getAddresses/${pc}`);
    const data = await response.json();
    const houseNumber = num.toString();
    let property = null;

    for (let address of data) {
        if (address.Property === houseNumber) {
            property = address;
            break;
        }
    }

    if (property) {
        return NextResponse.json({ uprn: property.Uprn });
    } else {
        return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
}
// export async function GET(request) {
//     return NextResponse.json({ 'Test': 'Resp' });
// }