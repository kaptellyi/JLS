# **JLS - Japanese Language School**
JLS is a dummy promo website of a japanese language school and its basic information. **The whole project is written in vanilla javascript**
___

## Table of Content
  - [**Website Contains**](#website-contains)
  - [**Caveats**](#caveats)
  - [**Features**](#features)
  - [**Can be used as**](#can-be-used-as)
  - [**Stack**](#stack)
  - [**Used API**](#used-api)
  - [**Motivation**](#motivation)
  - [**Setup**](#setup)
___
## **Website Contains**
- Short info about available courses
- Adjustment of info regarding your preferences
- Short info about teachers
- Schools' positions on the map
- Contact form (dummy version)
___
## **Caveats**
Filter handles only information that complies with JLS has requested (even though it's not a real company). 

**Incorrect information in city field**:
> New York - ❌

**Correct information in city field**:
> Tokyo - ✅

**Example in the app:**

![example image](https://i.ibb.co/Yb2T478/example.jpg)

**[Full list of supported properties](FILTER_PROPERTIES..md)**
___
## **Features**
- No usage of frameworks
- Functions only (excluding libraries)
- Optimization on the frontend side
- Responsive UI with specific animation according to devices
___
## **Can be used as**
- Exploring JS (ES6+). Developers with weak JS knowledge can get a grasp on some advanced features of the language
- Promoting personal product
___
## **Stack**
- SASS (CSS styling solution preprocessor)
- Tailwindcss (CSS styling solution framework)
- Webpack
- Javascript
- Animejs (JS animation solution library)
- Mapbox (map API library)
- Inputmask (handles inputs validation)
- Intl-tel-input (provides API for world's phone numbers)
___
## **Used API**
- ExchangeRate-API
___
## **Motivation**
The idea was to make a website without using any frameworks such as React, Angular or Vue. It had to be rich on animation with some logic. 
___
## **Setup**
You need to have [Node.js](https://nodejs.org/en) installed.
1. Clone this repository or download the zip
2. Install dependencies with `npm install`
3. Run in any mode you want:
     - development: `npm run dev`
     - production: `npm run build`
     - live: `npm start`
     - statistic: `npm run stats`
