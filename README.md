# Covid Compare Visualization Tool

This repository contains code for the visualization of COVID death predictions on models that operate globally. 

Based on the preprint: [Predictive performance of international COVID-19 mortality forecasting models](https://www.medrxiv.org/content/10.1101/2020.07.13.20151233v5.external-links.html)

## Running Visualization Locally

1. Pull repository
2. Create config file to point to database named `next.config.js`
Example:
```javascript
module.exports = { 
     env: {    
        'MYSQL_HOST': HOST,   
        'MYSQL_PORT': PORT,    
        'MYSQL_DATABASE': DATABASE,    
        'MYSQL_USER': USER,    
        'MYSQL_PASSWORD': PASSWORD,  
    }
}
```

- Ask author for help to connect to our database

3. Run command `yarn Dev`
