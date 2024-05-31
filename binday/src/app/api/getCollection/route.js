import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const urn = searchParams.get('urn');
    

    if (!urn ) {
        return NextResponse.json({ error: "Missing 'pc' or 'num' query parameter" }, { status: 400 });
    }

    const response = await fetch(`https://webapps.southglos.gov.uk/Webservices/SGC.RefuseCollectionService/RefuseCollectionService.svc/getCollections/${urn}`);
    const data = await response.json();
    
    const parseDate = (dateString) => dateString ? new Date(dateString.split('/').reverse().join('-')) : null;

    const c1Date = parseDate(data[0]['C1']);
    const r1Date = parseDate(data[0]['R1']);

    let closestDate = null;
    let closestType = null;

    if (c1Date && (!r1Date || c1Date < r1Date)) {
        closestDate = c1Date;
        closestType = 'recycling';
    } else if (r1Date) {
        closestDate = r1Date;
        closestType = 'recycling and bins';
    }
    
    return NextResponse.json({'collectionType':closestType,'collectionDate':closestDate});
    
}