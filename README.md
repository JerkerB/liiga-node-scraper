# liiga-node-scraper

Simple node scraper for scraping https://www.liiga.fi

## Getting started

To run this project, install it locally with npm or yarn:

```
git clone git@github.com:JerkerB/liiga-node-scraper.git
yarn install
```

### Scrape games

To scrape games you have to pass (s)eason and (t)ype as arguments. Optional arguments for console (p)rint, include (l)ineups and for (w)riting to results to file.

```
node games-scraper.js -s 2023 -t runkosarja -p -w games.json
```
Output:
```
{ games:
   [ { date: '20190912',
       home: 'HPK',
       homeScore: 2,
       away: 'Kärpät',
       awayScore: 3 },
     { date: '20190913',
       home: 'Ilves',
       homeScore: 4,
       away: 'Tappara',
       awayScore: 5 },
       ...
   ]    
}
```
