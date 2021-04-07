# TMA4851-bathing-temperature-prediction
Repository for our project in Experts in Teamwork (EiT) at NTNU. The web app serves predictions for bathing temperatures at future dates, based on historical data from YR / Norwegian Meteorological Institute. Predictions are served via a pretrained ML-model in Tensorflow that is deployed to and loaded in firebase function.

The ML model consists of time-series data fed through a single convolutional layer which is then fed into two bidirectional layers of LSTM. This structure is commonly known as the "CNN-LSTM" model.

[Live demo](https://tma4851-bathing-temp-pred.web.app/)

# Team members:
* Anders Hoel
* Nora Høva Erevik
* Kaja Sofie Lundgaard
* Henrik Lia
* Magnus Schjølberg
