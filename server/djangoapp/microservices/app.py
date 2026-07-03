import os
from flask import Flask
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import json
app = Flask("Sentiment Analyzer")

nltk_data_dir = os.path.dirname(__file__)
if nltk_data_dir not in nltk.data.path:
    nltk.data.path.append(nltk_data_dir)

sia = SentimentIntensityAnalyzer()


@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. \
    Use /analyze/text to get the sentiment"


@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt):

    scores = sia.polarity_scores(input_txt)
    print(scores)
    pos = float(scores['pos'])
    neg = float(scores['neg'])
    neu = float(scores['neu'])
    res = "positive"
    print("pos neg nue ", pos, neg, neu)
    if (neg > pos and neg > neu):
        res = "negative"
    elif (neu > neg and neu > pos):
        res = "neutral"
    res = json.dumps({"sentiment": res})
    print(res)
    return res


if __name__ == "__main__":
    app.run(debug=True)
