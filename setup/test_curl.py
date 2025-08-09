import requests
import json

def test_curl():
    try:
        url = "http://127.0.0.1:8000/items"
        data = {
            "name": "ahmed", 
            "count": 2000
        }
        
        print(f"Making POST request to {url}")
        print(f"Data: {data}")
        
        response = requests.post(
            url,
            headers={
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            json=data,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        if response.status_code == 200:
            print(f"Success! Response JSON: {response.json()}")
        else:
            print(f"Error! Status: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    test_curl()

