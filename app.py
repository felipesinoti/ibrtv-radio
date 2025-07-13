from flask import Flask, render_template, jsonify
import requests
import os

app = Flask(__name__)

# Chave da API do YouTube (coloque aqui ou use dotenv)
YOUTUBE_API_KEY = 'AIzaSyCP8FZOIgigQ8jBw0GuDJq9RI3GBq6o3I4'
CHANNEL_ID ='UCwckSFwCQbw_BiCzNab44Ng' #'UCU8NMiUBdWubzn_RTRpEq7A'  # Canal IBRVT

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/live')
def get_live_video():
    url = 'https://www.googleapis.com/youtube/v3/search'
    params = {
        'part': 'snippet',
        'channelId': CHANNEL_ID,
        'eventType': 'live',
        'type': 'video',
        'key': YOUTUBE_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    print(data)
    for item in data.get('items', []):
        title = item['snippet']['title'].lower()
        #if 'vida na vida' in title:
        return jsonify({'videoId': item['id']['videoId'], 'title': title})

    return jsonify({'videoId': None})


if __name__ == '__main__':
    app.run(debug=True)
