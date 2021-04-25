# TMA4851-water-temperature-prediction
Repository for our project in Experts in Teamwork (EiT) at NTNU. The web app serves predictions for surface water temperatures at future dates, based on historical data from YR / Norwegian Meteorological Institute. Predictions are served via a pretrained Keras model that is loaded in a firebase function with [Tensorflow.js](https://github.com/tensorflow/tfjs).

The ML model consists of time-series data fed through a single convolutional layer which is then fed into two bidirectional layers of LSTM. This structure is commonly known as the "CNN-LSTM" model.

[Live demo](https://korsvika-water-temp.web.app/)

# Team members:
* Anders Hoel
* Herman Sletmoen
* Nora Høva Erevik
* Kaja Sofie Lundgaard
* Henrik Lia
* Magnus Schjølberg
