# UWICoin

![cordova cli](https://img.shields.io/badge/cordova%20cli-v7.1.0-green.svg)
![ionic cli](https://img.shields.io/badge/ionic%20cli-v3.19.1-blue.svg)
![npm](https://img.shields.io/badge/npm-v5.6.0-blue.svg)
[![Master Build Status](https://travis-ci.org/UWICoin/UWICoin-Mobile.svg?branch=master)](https://travis-ci.org/UWICoin/UWICoin-Mobile/)
[![Develop Build Status](https://travis-ci.com/DarionHernandez/UWICoin-mobile.svg?token=qHAbDTKpMseKMzLwNCDR&branch=develop)](https://travis-ci.org/UWICoin/UWICoin-Mobile/)

<img src="https://github.com/DarionHernandez/UWICoin-mobile/blob/develop/src/assets/imgs/icon.png" alt="UWICoin Logo" width="200">

## Group Members
* Ravish Ragoonanan
* Rajeev Kunu
* Darion Hernandez

## Project scope

The goal of this project is to create a form of cryptocurrency(UWICoin), based on the <a href="https://github.com/ripple/rippled">Ripple API</a> for use on the St. Augustine Campus of the UWI to provide students an alternative to physical cash. UWICoin is trying to resolve the issue of robberies which has become a main concern at the start of the semester. This is done by providing a cashless form of currency to use around campus. As well as trying to create a feasible form of the cryptocurrency so that it can have positive benefits to the University.

The <a href="https://github.com/UWICoin/UWICoin-Mobile">UWICoin mobile application</a>, created using Ionic 3 and Cordova, will be used as the mechanism for students to make transactions using UWICoin at outlets around the campus that accept the currency and the campus bursary.

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites


```
Node.js

Ionic Framework
```

### Installing

First install [Node.js](https://nodejs.org/en/download/)

Then install the [Ionic Framework](https://ionicframework.com/framework)

```
npm install -g ionic
```

Install [Git](https://git-scm.com/downloads)

Clone the repository

```
git clone https://github.com/UWICoin/UWICoin-Mobile
```

Open the folder and install the dependencies
```
cd UWICoin-Mobile

npm install
```

To run the application
```
ionic serve
```

## Deployment

The application was tested for android devices. Support for IOS is available but you may experience bugs due to the untested features on such devices.

### Android
* Setup for [Android](https://cordova.apache.org/docs/en/7.x/guide/platforms/android/)

To run on an Android device

```
ionic cordova run android
```

### IOS
* Setup for [iOS](https://cordova.apache.org/docs/en/7.x/guide/platforms/ios/)

To run on an iOS device
```
ionic cordova run ios
```
