from datetime import datetime, timedelta
from flask import Flask
import requests





app = Flask(__name__)


@app.route('/api/findaddd/<pc>/<num>')
def find(pc,num):
    r = requests.get(f'https://webapps.southglos.gov.uk/Webservices/SGC.RefuseCollectionService/RefuseCollectionService.svc/getAddresses/{pc}')
    house_number = str(num)
    data = r.json()
    for address in data:
        if address['Property'] == house_number:
            print(address)
            property = address
    return property['Uprn']

@app.route('/api/<addid>')
def hello(addid):
    # mock_data =[{'C1': '24/06/2024', 'C2': '20/06/2024', 'C3': '04/07/2024', 'CalendarName': 'THB', 'G1': '', 'G2': '', 'G3': '', 'R1': '13/06/2024', 'R2': '27/06/2024', 'R3': '11/07/2024'}]
    r = requests.get(f'https://webapps.southglos.gov.uk/Webservices/SGC.RefuseCollectionService/RefuseCollectionService.svc/getCollections/{addid}')
    data = r.json()
    # data = mock_data
    print(data)

    today = datetime.today()
    #today = today + timedelta(days=7)

    # Parse the dates from the response
    c1_date = datetime.strptime(data[0]['C1'], '%d/%m/%Y') if data[0]['C1'] else None
    r1_date = datetime.strptime(data[0]['R1'], '%d/%m/%Y') if data[0]['R1'] else None

    # Find the closest date
    closest_date = None
    closest_type = None

    if c1_date and (not r1_date or c1_date < r1_date):
        closest_date = c1_date
        print(closest_date)
        closest_type = 'r'
    elif r1_date:
        closest_date = r1_date
        closest_type = 'b'

    # Determine the message
    if closest_date:
        if closest_type == 'recycling':
            message = "The next collection is recycling."
        elif closest_type == 'recycling and bins':
            message = "The next collection is recycling and bins."
    else:
        message = "No upcoming collections found."

    return {'nextCollection':closest_date,'collectionType':closest_type}

if __name__ == '__main__':
    app.run(debug=True)