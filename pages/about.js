/**
 * @file About page of website
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';

const md = `
## About covidcompare

The covidcompare tool provides up-to-date comparisons how well international COVID-19 mortality forecasting models are performing and have performed over time. This analysis serves as a reference for decision-makers on historical model performance, and provide insight into which models should be considered for critical decisions in the future. 

From a systematic literature review identifying N=386 COVID-19 forecasting models, we identify N=8 that are global in scope and provide public historical estimates that we can compare. These include models from the following groups:

- DELPHI-MIT (Delphi): [https://github.com/COVIDAnalytics/website/tree/master/](https://github.com/COVIDAnalytics/website/tree/master/)
- Imperial College London (Imperial): [https://github.com/mrc-ide/global-lmic-reports/tree/master/](https://github.com/mrc-ide/global-lmic-reports/tree/master/)
- The Institute for Health Metrics and Evaluation (IHME): [http://www.healthdata.org/covid/data-downloads](http://www.healthdata.org/covid/data-downloads)
- The Los Alamos National Laboratory (LANL): [https://covid-19.bsvgateway.org/](https://covid-19.bsvgateway.org/)
- USC ReCOVER (Sikjalpha): [https://github.com/scc-usc/ReCOVER-COVID-19](https://github.com/scc-usc/ReCOVER-COVID-19)
- Youyang Gu (YYG): [https://github.com/youyanggu/covid19_projections/tree/master/](https://github.com/youyanggu/covid19_projections/tree/master/)

## Our Approach

For a full description of our methodology, please refer to our preprint on [MedRxiv](https://www.medrxiv.org/content/10.1101/2020.07.13.20151233v5). 

We compare the ability of models to predict total cumulative mortality of COVID-19 over time. We take an inclusive approach, considering all publicly available model-versions. While some models produce projections (or scenarios), here we compare forecasts—or what modeling-group's best guess of what will most likely happen. We compare medians metrics across time and geographic region. 

Forecast estimates are benchmarked forecasts against data from the COVID-19 Data Repository by the [Center for Systems Science and Engineering (CSSE)](https://coronavirus.jhu.edu) at Johns Hopkins University for all locations except US States. We compare estimates for US States against data from [The New York Times](https://github.com/nytimes/covid-19-data).

## Access our Data and Code

The code for reproducing this [analysis](https://github.com/pyliu47/covidcompare)  and [visualization tool](https://github.com/akre96/CovidCompare) is publicly available on Github. The code of the prediction model is contributed by Joe Friedman, Patty Liu, and Austin Carter. The code of the web application is contributed by Samir Akre. 

We encourage use of data to assess the historical and ongoing performance of models, develop new analyses for assessing performance, and hope that they will spur the requisite conversation for improving the community of forecasting models.

## Related Papers

Predictive performance of international COVID-19 mortality forecasting models Joseph Friedman, Patrick Liu, Christopher E. Troeger, Austin Carter, Robert C. Reiner JR, Ryan M. Barber, James Collins, Stephen S. Lim, David M. Pigott, Theo Vos, Simon I. Hay, Christopher J.L. Murray, Emmanuela Gakidou. [medRxiv 2020.07.13.20151233](https://doi.org/10.1101/2020.07.13.20151233)

## Authors
- Joseph Friedman: @JosephRFriedman
- Patty Liu: @pyliu47
- Samir Akre: @samirakre
`;
const AboutPage = () => <ReactMarkdown>{md}</ReactMarkdown>;

export default AboutPage;
